// ============================================================
// THE BUREAU v2 — frontend
// ============================================================

let AGENTS = [];
let config = { provider: '', model: '' };
let activeAgentId = null;
const histories = {};
const STORAGE_PREFIX = 'bureau:history:';

const island = {
  el: null,
  expandTimer: null,
  alertTimer: null,
  mode: 'compact',
};

// ---------- boot ----------

async function boot() {
  island.el = document.getElementById('dynamicIsland');
  initParticles();
  bindUI();
  initTheme();
  islandSetStatus('Connecting…');

  try {
    const [agentsRes, configRes, healthRes] = await Promise.all([
      fetch('/api/agents'),
      fetch('/api/config'),
      fetch('/api/health'),
    ]);

    const agentsData = await agentsRes.json();
    const configData = await configRes.json();
    const healthData = await healthRes.json();

    AGENTS = agentsData.agents;
    config = { provider: configData.provider, model: configData.model };

    AGENTS.forEach((agent) => {
      histories[agent.id] = loadHistory(agent.id);
    });

    document.getElementById('providerTag').textContent = `${config.provider}`;
    document.getElementById('islandProvider').textContent = config.provider;
    document.getElementById('statusPill').classList.toggle('offline', !healthData.ok);

    renderRoster();
    selectAgent(AGENTS[0].id, { silent: true });
    islandSetStatus('Ready');
    islandExpandBrief();

    hideSplash();
  } catch (err) {
    islandSetStatus('Offline', 'error');
    document.getElementById('statusPill').classList.add('offline');
    document.getElementById('providerTag').textContent = 'server unreachable';
    hideSplash();
  }
}

function hideSplash() {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
  }, 600);
}

function bindUI() {
  document.getElementById('composer').addEventListener('submit', onSubmit);
  document.getElementById('clearChatBtn').addEventListener('click', clearActiveChat);
  document.getElementById('mobileRosterToggle').addEventListener('click', toggleMobileRoster);
  document.getElementById('rosterBackdrop').addEventListener('click', closeMobileRoster);

  island.el.addEventListener('click', () => {
    if (island.mode === 'compact') islandExpandBrief(4000);
    else islandCollapse();
  });

  const input = document.getElementById('composerInput');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('composer').requestSubmit();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 160) + 'px';
  });
}

// ---------- dynamic island ----------

function islandSetAgent(agent) {
  if (!agent) return;
  island.el.style.setProperty('--island-accent', agent.accent);
  document.getElementById('islandTag').textContent = agent.tag;
  document.getElementById('islandAvatar').textContent = agent.tag;
  document.getElementById('islandAgentName').textContent = agent.name;
  document.getElementById('islandAgentRole').textContent = agent.role;
  updateMsgCount();
}

function islandSetStatus(text, type) {
  document.getElementById('islandStatus').textContent = text;
  island.el.classList.remove('alert-success', 'alert-error');
  if (type === 'success') island.el.classList.add('alert-success');
  if (type === 'error') island.el.classList.add('alert-error');
}

function islandExpandBrief(duration = 2800) {
  clearTimeout(island.expandTimer);
  island.mode = 'expanded';
  island.el.classList.remove('compact');
  island.el.classList.add('expanded');
  island.el.dataset.state = 'expanded';
  island.expandTimer = setTimeout(islandCollapse, duration);
}

function islandCollapse() {
  clearTimeout(island.expandTimer);
  if (island.el.classList.contains('thinking')) return;
  island.mode = 'compact';
  island.el.classList.remove('expanded');
  island.el.classList.add('compact');
  island.el.dataset.state = 'idle';
}

function islandStartThinking() {
  clearTimeout(island.expandTimer);
  island.mode = 'thinking';
  island.el.classList.remove('compact', 'alert-success', 'alert-error');
  island.el.classList.add('expanded', 'thinking');
  island.el.dataset.state = 'thinking';
  islandSetStatus('Thinking…');
  document.getElementById('islandWave').classList.remove('hidden');
}

function islandStopThinking(success = true) {
  document.getElementById('islandWave').classList.add('hidden');
  island.el.classList.remove('thinking');
  islandSetStatus(success ? 'Ready' : 'Error', success ? 'success' : 'error');
  islandExpandBrief(success ? 2000 : 3500);
  if (!success) {
    setTimeout(() => island.el.classList.remove('alert-error'), 3500);
  } else {
    setTimeout(() => island.el.classList.remove('alert-success'), 2000);
  }
}

function updateMsgCount() {
  const agent = getActiveAgent();
  if (!agent) return;
  const count = histories[agent.id]?.length || 0;
  document.getElementById('islandMsgCount').textContent = `${count} msg${count === 1 ? '' : 's'}`;
}

// ---------- particles ----------

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(60, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124, 108, 255, 0.35)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124, 108, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    });
    if (!reduced) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
  if (!reduced) draw();
}

// ---------- storage ----------

function loadHistory(agentId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + agentId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(agentId) {
  try {
    localStorage.setItem(STORAGE_PREFIX + agentId, JSON.stringify(histories[agentId]));
  } catch { /* silent */ }
}

function clearActiveChat() {
  const agent = getActiveAgent();
  if (!agent) return;
  if (histories[agent.id].length && !confirm(`Clear all messages with ${agent.name}?`)) return;
  histories[agent.id] = [];
  saveHistory(agent.id);
  renderTranscript();
  updateMsgCount();
  islandSetStatus('Chat cleared', 'success');
  islandExpandBrief(2000);
}

// ---------- roster ----------

function renderRoster() {
  const list = document.getElementById('rosterList');
  list.innerHTML = '';

  AGENTS.forEach((agent) => {
    const count = histories[agent.id]?.length || 0;
    const card = document.createElement('button');
    card.className = 'agent-card' + (agent.id === activeAgentId ? ' active' : '');
    card.style.setProperty('--card-accent', agent.accent);
    card.addEventListener('click', () => {
      selectAgent(agent.id);
      closeMobileRoster();
    });

    card.innerHTML = `
      <span class="agent-card-avatar">${escapeHtml(agent.tag)}</span>
      <span class="agent-card-body">
        <p class="agent-card-name">${escapeHtml(agent.name)}</p>
        <p class="agent-card-role">${escapeHtml(agent.role)}</p>
        <p class="agent-card-tagline">${escapeHtml(agent.tagline)}</p>
      </span>
      <span class="agent-card-badge">${count || '—'}</span>
    `;
    list.appendChild(card);
  });
}

function toggleMobileRoster() {
  document.getElementById('roster').classList.toggle('open');
  document.getElementById('rosterBackdrop').classList.toggle('open');
}

function closeMobileRoster() {
  document.getElementById('roster').classList.remove('open');
  document.getElementById('rosterBackdrop').classList.remove('open');
}

// ---------- agent selection ----------

function selectAgent(agentId, opts = {}) {
  activeAgentId = agentId;
  const agent = getActiveAgent();
  islandSetAgent(agent);
  if (!opts.silent) {
    islandSetStatus(`Switched to ${agent.tag}`);
    islandExpandBrief(2200);
  }
  renderRoster();
  renderHeader();
  renderTranscript();
  document.documentElement.style.setProperty('--header-accent', agent.accent);
}

function getActiveAgent() {
  return AGENTS.find((a) => a.id === activeAgentId);
}

const HINTS = {
  strategist: ['Help me prioritize my goals', 'Review my business idea'],
  coder: ['Explain this error message', 'Review my code structure'],
  wordsmith: ['Improve this email draft', 'Make this paragraph clearer'],
  analyst: ['Break down this problem', 'What are the trade-offs?'],
  coach: ['I feel stuck on a project', 'Help me plan my week'],
};

function renderHeader() {
  const agent = getActiveAgent();
  const header = document.getElementById('deskHeader');
  header.style.setProperty('--header-accent', agent.accent);
  const msgCount = histories[agent.id]?.length || 0;
  header.innerHTML = `
    <div class="desk-header-top">
      <div>
        <h2 class="desk-header-name">
          ${escapeHtml(agent.name)}
          <span class="desk-header-stamp">${escapeHtml(agent.tag)}</span>
        </h2>
        <p class="desk-header-tagline">${escapeHtml(agent.role)} — ${escapeHtml(agent.tagline)}</p>
      </div>
      <div class="desk-header-stats">
        <span class="stat-chip">${msgCount} messages</span>
      </div>
    </div>
  `;
}

// ---------- transcript ----------

function renderTranscript() {
  const agent = getActiveAgent();
  const transcript = document.getElementById('transcript');
  transcript.style.setProperty('--msg-accent', agent.accent);
  transcript.innerHTML = '';

  const history = histories[agent.id];

  if (history.length === 0) {
    const hints = (HINTS[agent.id] || []).map(
      (h) => `<button type="button" class="hint-chip" data-hint="${escapeHtml(h)}">${escapeHtml(h)}</button>`
    ).join('');

    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <div class="empty-icon">${escapeHtml(agent.tag)}</div>
      <h2>${escapeHtml(agent.name)} is ready.</h2>
      <p>${escapeHtml(agent.tagline)} Send a message or pick a starter below.</p>
      <div class="empty-hints">${hints}</div>
    `;
    empty.querySelectorAll('.hint-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.getElementById('composerInput').value = btn.dataset.hint;
        document.getElementById('composer').requestSubmit();
      });
    });
    transcript.appendChild(empty);
    return;
  }

  history.forEach((msg, i) => {
    transcript.appendChild(buildMessageRow(msg, agent, i));
  });

  transcript.scrollTop = transcript.scrollHeight;
}

function buildMessageRow(msg, agent, index) {
  const row = document.createElement('div');
  row.className = `msg-row ${msg.role === 'user' ? 'user' : 'assistant'}`;
  row.style.animationDelay = `${Math.min(index * 0.04, 0.3)}s`;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble' + (msg.error ? ' error' : '');
  bubble.innerHTML = formatContent(msg.content);

  if (msg.role === 'assistant') {
    const tag = document.createElement('span');
    tag.className = 'msg-tag';
    tag.textContent = msg.error ? 'ERR' : agent.tag;
    row.appendChild(tag);
  }

  row.appendChild(bubble);
  return row;
}

// ---------- sending messages ----------

async function onSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('composerInput');
  const text = input.value.trim();
  if (!text) return;

  const agent = getActiveAgent();
  const history = histories[agent.id];

  history.push({ role: 'user', content: text });
  saveHistory(agent.id);
  renderTranscript();
  renderRoster();
  updateMsgCount();

  input.value = '';
  input.style.height = 'auto';
  setSending(true);
  islandStartThinking();
  showTyping(agent);

  let success = true;
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: agent.id,
        messages: history.map(({ role, content }) => ({ role, content })),
      }),
    });

    const data = await res.json();
    hideTyping();

    if (!res.ok) {
      success = false;
      history.push({ role: 'assistant', content: data.error || 'Something went wrong.', error: true });
    } else {
      history.push({ role: 'assistant', content: data.reply });
    }
  } catch (err) {
    success = false;
    hideTyping();
    history.push({
      role: 'assistant',
      content: `Couldn't reach the server: ${err.message}`,
      error: true,
    });
  }

  saveHistory(agent.id);
  renderTranscript();
  renderHeader();
  renderRoster();
  updateMsgCount();
  setSending(false);
  islandStopThinking(success);
  input.focus();
}

function setSending(isSending) {
  const btn = document.getElementById('sendButton');
  btn.disabled = isSending;
  btn.classList.toggle('sending', isSending);
}

function showTyping(agent) {
  const transcript = document.getElementById('transcript');
  const row = document.createElement('div');
  row.className = 'msg-row assistant';
  row.id = 'typingRow';

  const tag = document.createElement('span');
  tag.className = 'msg-tag';
  tag.textContent = agent.tag;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';

  row.appendChild(tag);
  row.appendChild(bubble);
  transcript.appendChild(row);
  transcript.scrollTop = transcript.scrollHeight;
}

function hideTyping() {
  document.getElementById('typingRow')?.remove();
}

// ---------- formatting & utils ----------

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatContent(raw) {
  let html = escapeHtml(raw);

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code>${code}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n/g, '<br>');

  html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match) =>
    match.replace(/<br>/g, '\n')
  );

  return html;
}

// ---------- theme management ----------

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('bureau:theme') || 'light';
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(activeTheme);
  });
}

function applyTheme(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    document.documentElement.classList.remove('dark-theme');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
  localStorage.setItem('bureau:theme', theme);
}

boot();
