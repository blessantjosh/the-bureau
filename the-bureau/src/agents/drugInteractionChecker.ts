import { MediscribeStateType } from "../state";

/**
 * Agent 4 — Drug Interaction Checker
 * Runs the patient's current medications through your drug-interaction
 * classifier (trained on RxNorm/DrugBank per Mediscribe Phase 2).
 *
 * TODO: replace stub with a call to your trained-from-scratch
 * drug-interaction classifier service.
 */
export async function drugInteractionChecker(
  state: MediscribeStateType
): Promise<Partial<MediscribeStateType>> {
  const medications =
    (state.patientHistory?.medications as string[] | undefined) ?? [];

  // --- STUB LOGIC ---
  const interactions = medications.map((med) => ({
    medication: med,
    interactsWith: [] as string[],
    severity: "none" as "none" | "minor" | "moderate" | "severe",
  }));
  // --- END STUB ---

  return {
    drugInteractions: interactions,
    auditTrail: [
      {
        agent: "DrugInteractionChecker",
        timestamp: new Date().toISOString(),
        note: `Checked ${medications.length} medications for interactions`,
      },
    ],
  };
}
