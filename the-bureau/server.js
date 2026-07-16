require('dotenv').config();
const express = require('express');
const path = require('path');
const { AGENTS } = require('./src/agents');
const { callModel, PROVIDER, getModelConfig } = require('./src/llmProvider');

const app = express();
const PORT = process.env.PORT || 3000;
const STARTED_AT = Date.now();

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function publicAgent(agent) {
  const { id, name, role, tagline, accent, tag } = agent;
  return { id, name, role, tagline, accent, tag };
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    uptime: Math.floor((Date.now() - STARTED_AT) / 1000),
    provider: PROVIDER,
  });
});

app.get('/api/config', (req, res) => {
  const { provider, model } = getModelConfig();
  res.json({
    provider,
    model,
    agentCount: Object.keys(AGENTS).length,
    version: '2.0.0',
  });
});

app.get('/api/agents', (req, res) => {
  const { model } = getModelConfig();
  const roster = Object.values(AGENTS).map(publicAgent);
  res.json({ provider: PROVIDER, model, agents: roster });
});

app.post('/api/chat', async (req, res) => {
  const { agentId, messages } = req.body || {};
  const agent = AGENTS[agentId];

  if (!agent) {
    return res.status(400).json({ error: `Unknown agent: "${agentId}"` });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array.' });
  }

  const sanitized = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(({ role, content }) => ({ role, content: content.slice(0, 32000) }));

  if (sanitized.length === 0) {
    return res.status(400).json({ error: 'No valid messages in request.' });
  }

  try {
    const reply = await callModel({ systemPrompt: agent.systemPrompt, messages: sanitized });
    res.json({
      reply,
      agent: publicAgent(agent),
      meta: { provider: PROVIDER, ...getModelConfig() },
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message || 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  const { model } = getModelConfig();
  console.log(`\n  The Bureau is open → http://localhost:${PORT}`);
  console.log(`  Provider: ${PROVIDER}  ·  Model: ${model}\n`);
});
