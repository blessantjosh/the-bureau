import { StateGraph, START, END } from "@langchain/langgraph";
import { MediscribeState } from "./state";
import { patientHistoryExtraction } from "./agents/patientHistoryExtraction";
import { clinicalEvidenceRetrieval } from "./agents/clinicalEvidenceRetrieval";
import { guidelineValidator } from "./agents/guidelineValidator";
import { drugInteractionChecker } from "./agents/drugInteractionChecker";
import { riskPrediction } from "./agents/riskPrediction";
import { treatmentRecommendation } from "./agents/treatmentRecommendation";
import { evidenceRanking } from "./agents/evidenceRanking";
import { explainabilityGenerator } from "./agents/explainabilityGenerator";
import { auditorNode } from "./agents/auditorNode";

/**
 * Linear 9-agent pipeline:
 * PatientHistoryExtraction -> ClinicalEvidenceRetrieval -> GuidelineValidator
 * -> DrugInteractionChecker -> RiskPrediction -> TreatmentRecommendation
 * -> EvidenceRanking -> ExplainabilityGenerator -> ConsistencyAuditor
 *
 * Kept linear/sequential to match your architecture diagram. If you later
 * need branching (e.g. skip DrugInteractionChecker when no meds exist),
 * swap the relevant addEdge for addConditionalEdges.
 */
export function buildMediscribeGraph() {
  const graph = new StateGraph(MediscribeState)
    .addNode("patientHistoryExtraction", patientHistoryExtraction)
    .addNode("clinicalEvidenceRetrieval", clinicalEvidenceRetrieval)
    .addNode("guidelineValidator", guidelineValidator)
    .addNode("drugInteractionChecker", drugInteractionChecker)
    .addNode("riskPredictor", riskPrediction)
    .addNode("treatmentRecommender", treatmentRecommendation)
    .addNode("evidenceRanker", evidenceRanking)
    .addNode("explainabilityGenerator", explainabilityGenerator)
    .addNode("auditorNode", auditorNode)

    .addEdge(START, "patientHistoryExtraction")
    .addEdge("patientHistoryExtraction", "clinicalEvidenceRetrieval")
    .addEdge("clinicalEvidenceRetrieval", "guidelineValidator")
    .addEdge("guidelineValidator", "drugInteractionChecker")
    .addEdge("drugInteractionChecker", "riskPredictor")
    .addEdge("riskPredictor", "treatmentRecommender")
    .addEdge("treatmentRecommender", "evidenceRanker")
    .addEdge("evidenceRanker", "explainabilityGenerator")
    .addEdge("explainabilityGenerator", "auditorNode")
    .addEdge("auditorNode", END);

  return graph.compile();
}
