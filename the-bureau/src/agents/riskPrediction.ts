import { MediscribeStateType } from "../state";

/**
 * Agent 5 — Risk Prediction
 * Combines history, evidence, guideline validation and drug interactions
 * to produce a patient risk score / risk category.
 *
 * TODO: replace stub with your risk prediction model inference call.
 */
export async function riskPrediction(
  state: MediscribeStateType
): Promise<Partial<MediscribeStateType>> {
  const severeInteractions = state.drugInteractions.filter(
    (i) => i.severity === "severe"
  ).length;

  // --- STUB LOGIC ---
  const risk = {
    riskScore: severeInteractions > 0 ? 0.8 : 0.2,
    riskCategory: severeInteractions > 0 ? "high" : "low",
    contributingFactors: severeInteractions > 0 ? ["severe_drug_interaction"] : [],
  };
  // --- END STUB ---

  return {
    riskPrediction: risk,
    auditTrail: [
      {
        agent: "RiskPrediction",
        timestamp: new Date().toISOString(),
        note: `Computed risk category: ${risk.riskCategory}`,
      },
    ],
  };
}
