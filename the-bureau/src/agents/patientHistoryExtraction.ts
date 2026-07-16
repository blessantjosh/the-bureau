import { MediscribeStateType } from "../state";

/**
 * Agent 1 — Patient History Extraction
 * Pulls structured history (conditions, meds, allergies, demographics)
 * out of the raw encounter note.
 *
 * TODO: wire up your clinical NER model here (trained-from-scratch model
 * per your Mediscribe Phase 2 plan) instead of the stub below.
 */
export async function patientHistoryExtraction(
  state: MediscribeStateType
): Promise<Partial<MediscribeStateType>> {
  // --- STUB LOGIC ---
  const extracted = {
    conditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    demographics: {},
    sourceNoteLength: state.encounterNote?.length ?? 0,
  };
  // --- END STUB ---

  return {
    patientHistory: extracted,
    auditTrail: [
      {
        agent: "PatientHistoryExtraction",
        timestamp: new Date().toISOString(),
        note: `Extracted history for patient ${state.patientId}`,
      },
    ],
  };
}
