import { MediscribeStateType } from "../state";

/**
 * Agent 7 — Evidence Ranking
 * Ranks the evidence that supports the treatment recommendation by
 * relevance/strength, so the explainability layer can cite the best sources.
 *
 * TODO: replace stub with real ranking (e.g. re-ranker model or
 * relevance-score sort over clinicalEvidence + guidelineValidation).
 */
export async function evidenceRanking(
  state: MediscribeStateType
): Promise<Partial<MediscribeStateType>> {
  // --- STUB LOGIC ---
  const ranked = [...state.clinicalEvidence]
    .sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0))
    .map((e, i) => ({ ...e, rank: i + 1 }));
  // --- END STUB ---

  return {
    evidenceRanking: ranked,
    auditTrail: [
      {
        agent: "EvidenceRanking",
        timestamp: new Date().toISOString(),
        note: `Ranked ${ranked.length} evidence items`,
      },
    ],
  };
}
