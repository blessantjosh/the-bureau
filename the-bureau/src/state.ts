import { Annotation } from "@langchain/langgraph";

/**
 * Shared state passed between all 8 agents in the Mediscribe pipeline.
 * Each agent reads what it needs and writes its own slice.
 * Arrays use a reducer so multiple agents can append without clobbering.
 */
export interface AgentOutput {
  claims: string[];
  citedEvidence: string[];
  confidence: number;
  flags?: string[];
}

export interface AuditResult {
  claimSupportScore: number;   // 0-1
  unresolvedFlags: string[];
  contradictions: {
    sourceAgent: string;
    targetAgent: string;
    description: string;
  }[];
  trustScore: number;          // 0-1 composite
  reasoning: string;
}

export interface BureauState {
  patientId?: string;
  encounterNote?: string;
  patientHistory: AgentOutput;
  clinicalEvidence: AgentOutput;
  guidelineValidation: AgentOutput;
  drugInteraction: AgentOutput;
  riskPrediction: AgentOutput;
  treatmentRecommendation: AgentOutput;
  evidenceRanking: AgentOutput;
  explainability: AgentOutput;
  auditResult?: AuditResult;
}

/**
 * Shared state passed between all 8 agents in the Mediscribe pipeline.
 * Each agent reads what it needs and writes its own slice.
 * Arrays use a reducer so multiple agents can append without clobbering.
 */
export const MediscribeState = Annotation.Root({
  // Input
  patientId: Annotation<string>(),
  encounterNote: Annotation<string>(), // raw clinical note / transcript

  // Agent 1 — Patient History Extraction
  patientHistory: Annotation<Record<string, any> | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Agent 2 — Clinical Evidence Retrieval
  clinicalEvidence: Annotation<Record<string, any>[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // Agent 3 — Guideline Validator
  guidelineValidation: Annotation<Record<string, any> | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Agent 4 — Drug Interaction Checker
  drugInteractions: Annotation<Record<string, any>[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // Agent 5 — Risk Prediction
  riskPrediction: Annotation<Record<string, any> | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Agent 6 — Treatment Recommendation
  treatmentRecommendation: Annotation<Record<string, any> | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Agent 7 — Evidence Ranking
  evidenceRanking: Annotation<Record<string, any>[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // Agent 8 — Explainability Generator
  explainability: Annotation<Record<string, any> | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),

  // Audit trail — every agent appends a log entry (feeds your IEEE audit-logging work)
  auditTrail: Annotation<{ agent: string; timestamp: string; note: string }[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  errors: Annotation<string[]>({
    reducer: (curr, next) => curr.concat(next),
    default: () => [],
  }),

  // Consistency Auditor Result
  auditResult: Annotation<AuditResult | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
});

export type MediscribeStateType = typeof MediscribeState.State;

