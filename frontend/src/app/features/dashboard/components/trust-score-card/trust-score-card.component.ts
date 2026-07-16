import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditResult } from '../../../../core/services/clinical-pipeline.service';

@Component({
  selector: 'app-trust-score-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="compliance-card" *ngIf="auditResult">
      <div class="compliance-header">
        <h4 class="compliance-title">Logic Consistency Audit</h4>
        <div class="compliance-badge" [class.optimal]="auditResult.trustScore >= 0.9" [class.variance]="auditResult.trustScore < 0.9">
          {{ auditResult.trustScore >= 0.9 ? 'Verified' : 'Variance' }}
        </div>
      </div>

      <div class="compliance-main-layout">
        <!-- Score Circular representation -->
        <div class="score-readout">
          <div class="score-numeral">{{ displayScore }}</div>
          <div class="score-lbl">Index</div>
        </div>

        <!-- Status Summary -->
        <div class="status-summary">
          <p class="status-line" [class.teal]="auditResult.trustScore >= 0.9" [class.warm]="auditResult.trustScore < 0.9">
            {{ getStatusLine(auditResult.trustScore) }}
          </p>
          <p class="reasoning-text">{{ auditResult.reasoning }}</p>
        </div>
      </div>

      <!-- Expandable details trigger -->
      <div class="expand-control-bar">
        <button class="details-toggle-btn" (click)="expanded = !expanded" [attr.aria-expanded]="expanded">
          {{ expanded ? 'Hide Verification Metrics' : 'Expand Verification Metrics' }}
          <svg class="toggle-chevron" [class.rotated]="expanded" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      <!-- Expandable Details Panel with Grid Height Transition -->
      <div class="details-panel" [class.open]="expanded">
        <div class="details-panel-inner">
          
          <!-- Contradictions Section -->
          <div class="detail-section">
            <h5 class="section-subtitle">Clinical Logic Contradictions</h5>
            <div class="data-box" *ngIf="auditResult.contradictions && auditResult.contradictions.length > 0; else noContradictions">
              <div class="contradiction-item" *ngFor="let c of auditResult.contradictions">
                <div class="contradiction-header">
                  <span class="agent-source">{{ c.sourceAgent }}</span>
                  <span class="vs-arrow">⟷</span>
                  <span class="agent-target">{{ c.targetAgent }}</span>
                </div>
                <p class="contradiction-desc">{{ c.description }}</p>
              </div>
            </div>
            <ng-template #noContradictions>
              <p class="empty-state-text">Zero contradictory logic statements detected across active agents.</p>
            </ng-template>
          </div>

          <!-- Unresolved Flags Section -->
          <div class="detail-section">
            <h5 class="section-subtitle">Unresolved Safety Warnings</h5>
            <div class="data-box" *ngIf="auditResult.unresolvedFlags && auditResult.unresolvedFlags.length > 0; else noFlags">
              <ul class="unresolved-flags-list">
                <li *ngFor="let flag of auditResult.unresolvedFlags">{{ flag }}</li>
              </ul>
            </div>
            <ng-template #noFlags>
              <p class="empty-state-text">All drug safety and contraindication flags were successfully resolved.</p>
            </ng-template>
          </div>

          <!-- Audit Metrics Section -->
          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-lbl">Evidence Weight</span>
              <span class="metric-val">{{ auditResult.claimSupportScore * 100 | number:'1.0-0' }}%</span>
            </div>
            <div class="metric-card">
              <span class="metric-lbl">Contradictions</span>
              <span class="metric-val">{{ auditResult.contradictions.length }}</span>
            </div>
            <div class="metric-card">
              <span class="metric-lbl">Safety Flags</span>
              <span class="metric-val">{{ auditResult.unresolvedFlags.length }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .compliance-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow);
      padding: 20px 20px 0 20px;
      font-family: var(--font-body);
      overflow: hidden;
    }

    .compliance-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 10px;
      margin-bottom: 14px;
    }

    .compliance-title {
      font-family: var(--font-body);
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .compliance-badge {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--border);

      &.optimal {
        background: rgba(31, 111, 99, 0.05);
        color: var(--accent);
        border-color: rgba(31, 111, 99, 0.15);
      }

      &.variance {
        background: rgba(194, 139, 48, 0.05);
        color: var(--error);
        border-color: rgba(194, 139, 48, 0.15);
      }
    }

    .compliance-main-layout {
      display: flex;
      gap: 20px;
      padding-bottom: 14px;
      align-items: flex-start;
      
      @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }

    .score-readout {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border-radius: 50%;
      border: 1px solid var(--border-bright);
      background: var(--bg-panel);
      flex-shrink: 0;
      padding: 6px;
      box-shadow: inset 0 2px 4px rgba(20, 29, 26, 0.01);
    }

    .score-numeral {
      font-family: var(--font-mono);
      font-size: 2.2rem;
      line-height: 1;
      font-weight: 500;
      color: var(--accent);
      letter-spacing: -0.02em;
    }

    .score-lbl {
      font-size: 0.58rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      margin-top: 1px;
    }

    .status-summary {
      flex: 1;
      min-width: 0;
    }

    .status-line {
      font-family: var(--font-display);
      font-size: 1.15rem;
      margin: 0 0 6px 0;
      font-weight: 500;
      line-height: 1.3;

      &.teal {
        color: var(--accent);
      }

      &.warm {
        color: var(--error);
      }
    }

    .reasoning-text {
      font-family: var(--font-display);
      font-size: 0.85rem;
      line-height: 1.55;
      color: var(--text-muted);
      margin: 0;
      font-style: italic;
    }

    .expand-control-bar {
      border-top: 1px solid var(--border);
      padding: 8px 0;
      display: flex;
      justify-content: center;
    }

    .details-toggle-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.72rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 150ms ease-out;
      font-family: var(--font-body);

      &:hover {
        color: var(--text);
      }
    }

    .toggle-chevron {
      width: 11px;
      height: 11px;
      transition: transform 150ms var(--ease-smooth);

      &.rotated {
        transform: rotate(180deg);
      }
    }

    /* Expandable Details Panel with Grid height animation */
    .details-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 250ms var(--ease-smooth), opacity 250ms var(--ease-smooth);
      opacity: 0;
      background: var(--clinical-bg);
      margin-left: -20px;
      margin-right: -20px;
      padding: 0 20px;
      overflow: hidden;

      &.open {
        grid-template-rows: 1fr;
        opacity: 1;
        border-top: 1px solid var(--border);
        padding-top: 16px;
        padding-bottom: 20px;
      }
    }

    .details-panel-inner {
      min-height: 0;
    }

    .detail-section {
      margin-bottom: 14px;
      
      &:last-of-type {
        margin-bottom: 18px;
      }
    }

    .section-subtitle {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      margin: 0 0 5px 0;
      font-family: var(--font-mono);
    }

    .data-box {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px;
    }

    .contradiction-item {
      border-bottom: 1px dashed var(--border);
      padding-bottom: 6px;
      margin-bottom: 6px;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }
    }

    .contradiction-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.7rem;
      font-weight: 600;
      margin-bottom: 2px;
      font-family: var(--font-mono);
    }

    .agent-source {
      color: var(--error);
    }

    .agent-target {
      color: var(--accent);
    }

    .vs-arrow {
      color: var(--text-dim);
    }

    .contradiction-desc {
      font-size: 0.75rem;
      line-height: 1.4;
      color: var(--text-muted);
      margin: 0;
    }

    .unresolved-flags-list {
      margin: 0;
      padding-left: 14px;

      li {
        font-size: 0.75rem;
        line-height: 1.45;
        color: var(--text-muted);
        margin-bottom: 2px;
        
        &::marker {
          color: var(--error);
        }
      }
    }

    .empty-state-text {
      font-size: 0.75rem;
      color: var(--text-dim);
      margin: 0;
      font-style: italic;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .metric-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-lbl {
      font-size: 0.58rem;
      font-weight: 600;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metric-val {
      font-family: var(--font-mono);
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--accent);
    }
  `]
})
export class TrustScoreCardComponent implements OnChanges, OnDestroy {
  @Input() auditResult: AuditResult | null = null;
  
  expanded = false;
  displayScore = 0;
  private animationInterval: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['auditResult'] && this.auditResult) {
      this.animateScore();
    }
  }

  animateScore(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    if (!this.auditResult) {
      this.displayScore = 0;
      return;
    }

    const target = Math.round(this.auditResult.trustScore * 100);
    const duration = 750; // ms
    const startTime = Date.now();

    this.animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      this.displayScore = Math.round(easeProgress * target);

      if (progress >= 1) {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
    }, 16);
  }

  getStatusLine(score: number): string {
    if (score >= 0.95) {
      return 'Consistent Reasoning — Safe for Clinical Application';
    } else if (score >= 0.9) {
      return 'Reasoning Verified — Consistent with Practice Guidelines';
    } else if (score >= 0.75) {
      return 'Minor Variance Flagged — Discretionary Review Suggested';
    } else {
      return 'Significant Logic Conflict — Manual Clinician Override Required';
    }
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
