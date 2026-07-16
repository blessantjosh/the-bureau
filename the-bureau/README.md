# the-bureau

LangGraph.js orchestration service for Mediscribe. Implements the 8-agent
clinical decision-support pipeline:

```
Doctor -> Angular Dashboard -> NestJS API -> LangGraph Workflow (this service)

Agent 1  Patient History Extraction
Agent 2  Clinical Evidence Retrieval
Agent 3  Guideline Validator
Agent 4  Drug Interaction Checker
Agent 5  Risk Prediction
Agent 6  Treatment Recommendation
Agent 7  Evidence Ranking
Agent 8  Explainability Generator -> Doctor
```

## Structure

```
src/
  state.ts                     shared LangGraph state schema
  graph.ts                     StateGraph wiring (linear pipeline)
  index.ts                     Express entrypoint (POST /pipeline/run)
  agents/
    patientHistoryExtraction.ts
    clinicalEvidenceRetrieval.ts
    guidelineValidator.ts
    drugInteractionChecker.ts
    riskPrediction.ts
    treatmentRecommendation.ts
    evidenceRanking.ts
    explainabilityGenerator.ts
```

Every agent is a stub right now (clearly marked `--- STUB LOGIC ---`) so the
graph runs end-to-end immediately. Swap in real model calls (clinical NER,
drug-interaction classifier, ElasticSearch/Qdrant retrieval, etc.) one agent
at a time without touching the graph wiring.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

## Call it

```bash
curl -X POST http://localhost:4100/pipeline/run \
  -H "Content-Type: application/json" \
  -d '{"patientId": "p123", "encounterNote": "Patient presents with..."}'
```

Your NestJS backend should call this endpoint after the doctor submits an
encounter note, then persist `auditTrail` for your verifiable-AI / IEEE
audit-logging requirements.

## Next steps

1. Replace stub logic in each agent, one at a time, starting with
   `patientHistoryExtraction` (feeds everything downstream).
2. Add conditional edges in `graph.ts` if you need branching (e.g. skip
   `drugInteractionChecker` when the patient has no active medications).
3. Add retry/error handling per node if a downstream model call fails —
   currently errors bubble up to `/pipeline/run`'s catch block.
