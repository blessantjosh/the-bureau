import { auditorNode } from "./agents/auditorNode";
import { MediscribeStateType } from "./state";

// Mock the llmProvider module
jest.mock("./llmProvider", () => {
  return {
    callModel: jest.fn(),
  };
});

// Import the mocked module to control its mock implementation
import { callModel } from "./llmProvider";

describe("Consistency Auditor Node Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate a low trust score and capture contradictions when treatmentRecommendation ignores contraindication flags", async () => {
    // 1. Setup deliberately inconsistent fixture
    const inconsistentState: Partial<MediscribeStateType> = {
      patientId: "P-4821",
      encounterNote: "Patient has history of renal impairment and diabetes. Needs medication review.",
      drugInteractions: [
        { flags: ["Metformin + Lisinopril: Contraindicated in severe renal impairment"] }
      ],
      riskPrediction: {
        flags: ["Renal failure risk: High"]
      },
      treatmentRecommendation: {
        claims: ["Prescribe Metformin 500mg BID", "Prescribe Lisinopril 10mg QD"],
        candidateActions: ["Prescribe Metformin 500mg BID", "Prescribe Lisinopril 10mg QD"],
      },
      evidenceRanking: [
        { text: "Lisinopril is standard of care for diabetic nephropathy unless contraindicated." }
      ],
      auditTrail: [],
      errors: [],
    };

    // 2. Setup mock response from LLM
    const mockLlmResponse = `
    \`\`\`json
    {
      "claimSupportScore": 0.5,
      "unresolvedFlags": [
        "Metformin + Lisinopril contraindication flag in renal impairment was raised but not addressed in the recommendations."
      ],
      "contradictions": [
        {
          "sourceAgent": "drugInteractionChecker",
          "targetAgent": "treatmentRecommendation",
          "description": "recommends Metformin + Lisinopril despite flagged severe renal contraindication"
        }
      ],
      "reasoning": "The treatment recommendation fails to address the drug interaction warning and recommends both Metformin and Lisinopril in a high renal risk patient."
    }
    \`\`\`
    `;

    (callModel as jest.Mock).mockResolvedValue(mockLlmResponse);

    // 3. Run the auditorNode
    const result = await auditorNode(inconsistentState as MediscribeStateType);

    // 4. Assertions
    expect(result.auditResult).toBeDefined();
    const audit = result.auditResult!;

    // Expected trustScore calculation:
    // claimSupportScore = 0.5
    // totalFlagsRaised = 2 (1 drug flag + 1 risk flag)
    // unresolvedFlags = 1 -> unresolvedTerm = 1 - (1/2) = 0.5
    // totalClaims = 2 -> contradictionTerm = 1 - (1/2) = 0.5
    // trustScore = 0.4 * 0.5 + 0.3 * 0.5 + 0.3 * 0.5 = 0.2 + 0.15 + 0.15 = 0.50
    expect(audit.trustScore).toBe(0.5);
    expect(audit.claimSupportScore).toBe(0.5);
    expect(audit.unresolvedFlags.length).toBe(1);
    expect(audit.contradictions.length).toBe(1);
    expect(audit.contradictions[0].sourceAgent).toBe("drugInteractionChecker");
    expect(audit.contradictions[0].targetAgent).toBe("treatmentRecommendation");
  });

  it("should calculate a high trust score when clinical pipeline is fully consistent", async () => {
    // 1. Setup fully consistent fixture
    const consistentState: Partial<MediscribeStateType> = {
      patientId: "P-4821",
      drugInteractions: [],
      riskPrediction: {
        flags: []
      },
      treatmentRecommendation: {
        claims: ["Initiate safe lifestyle modifications"],
        candidateActions: ["Initiate safe lifestyle modifications"]
      },
      evidenceRanking: [
        { text: "Lifestyle modifications are first-line for pre-hypertension." }
      ],
      auditTrail: [],
      errors: [],
    };

    // 2. Setup mock response from LLM
    const mockLlmResponse = `
    \`\`\`json
    {
      "claimSupportScore": 1.0,
      "unresolvedFlags": [],
      "contradictions": [],
      "reasoning": "The recommendations are fully supported by evidence, and no flags are raised."
    }
    \`\`\`
    `;

    (callModel as jest.Mock).mockResolvedValue(mockLlmResponse);

    // 3. Run the auditorNode
    const result = await auditorNode(consistentState as MediscribeStateType);

    // 4. Assertions
    expect(result.auditResult).toBeDefined();
    const audit = result.auditResult!;

    // Expected trustScore calculation:
    // claimSupportScore = 1.0
    // totalFlagsRaised = 0 -> unresolvedTerm = 1 - (0/1) = 1.0
    // totalClaims = 1 -> contradictionTerm = 1 - (0/1) = 1.0
    // trustScore = 0.4 * 1.0 + 0.3 * 1.0 + 0.3 * 1.0 = 1.0
    expect(audit.trustScore).toBe(1.0);
    expect(audit.unresolvedFlags.length).toBe(0);
    expect(audit.contradictions.length).toBe(0);
  });
});
