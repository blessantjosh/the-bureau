import "dotenv/config";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { buildMediscribeGraph } from "./graph";

const app = express();
app.use(express.json());

const graph = buildMediscribeGraph();

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "the-bureau" });
});

/**
 * Main entrypoint your NestJS backend calls after a doctor submits/updates
 * an encounter note. Runs the full 8-agent pipeline and returns the
 * explainability report + audit trail.
 */
app.post("/pipeline/run", async (req, res) => {
  const { patientId, encounterNote } = req.body ?? {};

  if (!patientId || !encounterNote) {
    return res.status(400).json({ error: "patientId and encounterNote are required" });
  }

  const runId = uuidv4();

  try {
    const result = await graph.invoke({
      patientId,
      encounterNote,
    });

    res.json({
      runId,
      explainability: result.explainability,
      riskPrediction: result.riskPrediction,
      treatmentRecommendation: result.treatmentRecommendation,
      auditResult: result.auditResult,
      auditTrail: result.auditTrail,
      errors: result.errors,
    });
  } catch (err) {
    console.error(`[the-bureau] pipeline run ${runId} failed:`, err);
    res.status(500).json({ runId, error: "Pipeline execution failed" });
  }
});

const PORT = process.env.PORT ?? 4100;
app.listen(PORT, () => {
  console.log(`[the-bureau] LangGraph orchestration service running on port ${PORT}`);
});
