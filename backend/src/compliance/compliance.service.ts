import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../database/prisma.service';
import { buildComplianceGraph } from './compliance.graph';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface SseEvent {
  type: string;
  data: any;
  timestamp: string;
}

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  // Map: documentId -> Subject that streams SSE events
  private readonly streams = new Map<string, Subject<SseEvent>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────

  async createDecisionRecord(documentId: string, documentType: string): Promise<void> {
    if (!this.prisma.isConnected) return;
    try {
      await this.prisma.complianceDecision.create({
        data: { documentId, documentType, status: 'PROCESSING' },
      });
    } catch (err) {
      this.logger.warn(`Could not create decision record: ${err.message}`);
    }
  }

  getOrCreateStream(documentId: string): Subject<SseEvent> {
    if (!this.streams.has(documentId)) {
      this.streams.set(documentId, new Subject<SseEvent>());
    }
    return this.streams.get(documentId)!;
  }

  async getDecisionById(documentId: string) {
    if (!this.prisma.isConnected) return null;
    try {
      return await this.prisma.complianceDecision.findUnique({
        where: { documentId },
        include: { auditTrailEntries: { orderBy: { stepNumber: 'asc' } } },
      });
    } catch {
      return null;
    }
  }

  async getDashboardStats() {
    if (!this.prisma.isConnected) {
      return {
        pendingDecisions:   0,
        completedDecisions: 0,
        escalatedDecisions: 0,
        failedDecisions:    0,
        avgRiskScore:       0,
        actionsTaken:       {},
        recentDecisions:    [],
        dbOnline:           false,
      };
    }

    try {
      const [pending, completed, escalated, failed, recent] = await Promise.all([
        this.prisma.complianceDecision.count({ where: { status: 'PROCESSING' } }),
        this.prisma.complianceDecision.count({ where: { status: 'COMPLETED'  } }),
        this.prisma.complianceDecision.count({ where: { status: 'ESCALATED'  } }),
        this.prisma.complianceDecision.count({ where: { status: 'FAILED'     } }),
        this.prisma.complianceDecision.findMany({
          orderBy: { createdAt: 'desc' },
          take: 20,
        }),
      ]);

      const allRisk = recent.map(d => d.riskScore);
      const avgRisk = allRisk.length
        ? allRisk.reduce((a, b) => a + b, 0) / allRisk.length
        : 0;

      const actionsTaken: Record<string, number> = {};
      for (const d of recent) {
        const acts = (d.executedActions as any[]) ?? [];
        for (const a of acts) {
          actionsTaken[a.type] = (actionsTaken[a.type] ?? 0) + 1;
        }
      }

      return {
        pendingDecisions:   pending,
        completedDecisions: completed,
        escalatedDecisions: escalated,
        failedDecisions:    failed,
        avgRiskScore:       Math.round(avgRisk * 10) / 10,
        actionsTaken,
        recentDecisions:    recent,
        dbOnline:           true,
      };
    } catch (err) {
      this.logger.error('Dashboard stats error:', err);
      return {
        pendingDecisions: 0, completedDecisions: 0, escalatedDecisions: 0,
        failedDecisions:  0, avgRiskScore: 0, actionsTaken: {}, recentDecisions: [], dbOnline: false,
      };
    }
  }

  async seedDefaultRules(): Promise<number> {
    if (!this.prisma.isConnected) return 0;
    const defaults = [
      { ruleName: 'Fraud Indicators',       category: 'fraud_detection',  severity: 'CRITICAL', ruleText: 'The document must not contain signs of falsified information, duplicate claim numbers, or inconsistent dates.' },
      { ruleName: 'Coverage Validation',    category: 'coverage_check',   severity: 'HIGH',     ruleText: 'The claimed amount must fall within the policy coverage limits stated in the policyholder record.' },
      { ruleName: 'Documentation Complete', category: 'policy_validation', severity: 'HIGH',     ruleText: 'All required supporting documents must be referenced: incident report, medical records if applicable, and proof of ownership.' },
      { ruleName: 'Time Limit Compliance',  category: 'policy_validation', severity: 'MEDIUM',   ruleText: 'The claim must be filed within 30 days of the incident date as per standard policy terms.' },
      { ruleName: 'Identity Verification',  category: 'fraud_detection',  severity: 'HIGH',     ruleText: 'Policyholder identity must be verifiable through matching name, policy number, and date of birth.' },
      { ruleName: 'Geographic Coverage',    category: 'coverage_check',   severity: 'MEDIUM',   ruleText: 'The incident must have occurred within the geographic coverage area specified in the policy.' },
    ];

    let count = 0;
    for (const rule of defaults) {
      try {
        await this.prisma.complianceRule.upsert({
          where: { id: uuidv4() },
          update: {},
          create: rule,
        });
        count++;
      } catch {
        try {
          await this.prisma.complianceRule.create({ data: rule });
          count++;
        } catch (e) {
          this.logger.warn(`Could not seed rule "${rule.ruleName}": ${e.message}`);
        }
      }
    }
    return count;
  }

  // ─────────────────────────────────────────────────────────────
  // EVENT HANDLER — Runs the LangGraph pipeline
  // ─────────────────────────────────────────────────────────────

  @OnEvent('compliance.document.ingested')
  async handleDocumentIngestion(payload: {
    documentId: string;
    content: string;
    documentType: string;
  }) {
    const { documentId, content, documentType } = payload;
    this.logger.log(`Pipeline starting for ${documentId}`);

    const stream = this.getOrCreateStream(documentId);
    const startTime = Date.now();

    // Helper to emit SSE update + log
    const emitStep = (step: string, data: any) => {
      const event: SseEvent = {
        type: step,
        data,
        timestamp: new Date().toISOString(),
      };
      stream.next(event);
    };

    emitStep('pipeline_started', { documentId, documentType });

    try {
      const graph = buildComplianceGraph();

      const finalState = await graph.invoke({
        documentId,
        documentContent: content,
        documentType,
        emitStep,
      });

      const duration = Date.now() - startTime;

      // Persist to DB
      if (this.prisma.isConnected) {
        try {
          await this.prisma.complianceDecision.update({
            where: { documentId },
            data: {
              decision:            finalState.decision,
              riskScore:           finalState.riskScore,
              reasoning:           finalState.decisionReasoning,
              confidenceScore:     finalState.confidence,
              executedActions:     finalState.actions,
              actionsStatus:       finalState.actions.every((a: any) => a.status === 'SUCCESS') ? 'EXECUTED' : 'FAILED',
              auditLog:            finalState.auditLog,
              violationsFound:     finalState.issuesFound,
              status:              finalState.decision === 'ESCALATE' ? 'ESCALATED' : 'COMPLETED',
              completedAt:         new Date(),
              processingDurationMs: duration,
            },
          });

          // Persist audit trail entries
          for (let i = 0; i < finalState.auditLog.length; i++) {
            const entry = finalState.auditLog[i];
            await this.prisma.auditTrailEntry.create({
              data: {
                decisionId: (await this.prisma.complianceDecision.findUnique({ where: { documentId } }))!.id,
                stepName:   entry.step,
                stepNumber: i + 1,
                outputData: entry,
                durationMs: entry.durationMs,
                reasoning:  entry.reasoning ?? null,
              },
            });
          }
        } catch (dbErr) {
          this.logger.warn(`DB persist error: ${dbErr.message}`);
        }
      }

      emitStep('pipeline_complete', {
        documentId,
        decision:          finalState.decision,
        riskScore:         finalState.riskScore,
        reasoning:         finalState.decisionReasoning,
        actions:           finalState.actions,
        auditLog:          finalState.auditLog,
        durationMs:        duration,
      });

    } catch (err: any) {
      this.logger.error(`Pipeline failed for ${documentId}:`, err);

      if (this.prisma.isConnected) {
        try {
          await this.prisma.complianceDecision.update({
            where: { documentId },
            data: { status: 'FAILED', reasoning: err.message },
          });
        } catch {}
      }

      emitStep('pipeline_error', { documentId, error: err.message });
    } finally {
      // Close stream after 30 s so the SSE client can clean up
      setTimeout(() => {
        stream.complete();
        this.streams.delete(documentId);
      }, 30_000);
    }
  }
}
