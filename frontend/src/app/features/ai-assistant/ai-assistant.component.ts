import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

interface Suggestion {
  text: string;
  category: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-page feature-page" style="display:flex;flex-direction:column;height:100%;padding:0">

      <!-- Header -->
      <div class="page-header" style="margin:0;padding:20px 24px 16px;border-bottom:1px solid var(--border);flex-shrink:0;">
        <div class="page-header-content">
          <div class="page-header-icon" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
              <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
              <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
              <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
              <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">AI Clinical Assistant</h1>
            <p class="page-subtitle">Decision support, drug interactions, differential diagnosis</p>
          </div>
        </div>
        <div class="page-header-actions">
          <button class="btn-ghost-sm" (click)="clearChat()">Clear</button>
          <div class="ai-model-badge">GPT-4 Clinical</div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area" id="aiChatArea">

        <!-- Suggestions (empty state) -->
        <div class="suggestions-wrap" *ngIf="messages.length === 0">
          <div class="suggestions-header">
            <div class="suggestions-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
            </div>
            <h2>Clinical AI Assistant</h2>
            <p>How can I assist with your clinical decision-making today?</p>
          </div>
          <div class="suggestions-grid">
            <button class="suggestion-chip" *ngFor="let s of suggestions" (click)="sendSuggestion(s.text)">
              <span class="suggestion-cat">{{ s.category }}</span>
              <span class="suggestion-text">{{ s.text }}</span>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="messages" *ngIf="messages.length > 0">
          <div class="message-row" *ngFor="let msg of messages" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
            <div class="msg-avatar" *ngIf="msg.role === 'assistant'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
            </div>
            <div class="msg-bubble" [class.typing-bubble]="msg.typing">
              <div *ngIf="!msg.typing">{{ msg.content }}</div>
              <div class="typing-dots" *ngIf="msg.typing">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div class="msg-time">{{ msg.timestamp | date:'HH:mm' }}</div>
          </div>
        </div>
      </div>

      <!-- Composer -->
      <div class="ai-composer" style="flex-shrink:0">
        <div class="composer-inner glass">
          <textarea
            class="ai-input"
            rows="1"
            placeholder="Ask about symptoms, drug interactions, diagnostic criteria, treatment protocols…"
            [(ngModel)]="inputText"
            (keydown)="onKeyDown($event)"
          ></textarea>
          <button class="ai-send-btn" (click)="sendMessage()" [disabled]="!inputText.trim() || isThinking">
            <svg *ngIf="!isThinking" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <span class="send-spinner" *ngIf="isThinking"></span>
          </button>
        </div>
        <p class="ai-disclaimer">AI-generated content is for clinical decision support only. Always verify with clinical judgment and institutional guidelines.</p>
      </div>

    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
    .ai-page { padding: 0 !important; }

    .ai-model-badge {
      padding: 5px 12px; border-radius: 99px; font-size: 0.72rem; font-weight: 600;
      background: rgba(139,92,246,0.12); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.25);
    }
    .chat-area {
      flex: 1; overflow-y: auto; padding: 24px;
      scrollbar-width: thin; scrollbar-color: var(--border) transparent;
    }

    .suggestions-wrap { max-width: 680px; margin: 0 auto; padding: 20px 0; }
    .suggestions-header { text-align: center; margin-bottom: 28px; }
    .suggestions-icon {
      width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 16px;
      background: linear-gradient(135deg,#8b5cf6,#7c3aed); color: white;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(139,92,246,0.35);
    }
    .suggestions-header h2 { font-size: 1.2rem; font-weight: 700; color: var(--text); margin: 0 0 8px; }
    .suggestions-header p  { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
    .suggestions-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    }
    @media (max-width: 600px) { .suggestions-grid { grid-template-columns: 1fr; } }
    .suggestion-chip {
      display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
      padding: 14px 16px; border-radius: 14px; border: 1px solid var(--border);
      background: var(--bg-glass); cursor: pointer; text-align: left;
      transition: all 0.15s ease;
      &:hover { background: var(--bg-glass-hover); border-color: rgba(139,92,246,0.3); transform: translateY(-1px); }
    }
    .suggestion-cat { font-size: 0.65rem; font-weight: 700; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.06em; }
    .suggestion-text { font-size: 0.83rem; color: var(--text-muted); line-height: 1.4; }

    .messages { display: flex; flex-direction: column; gap: 16px; max-width: 780px; margin: 0 auto; }
    .message-row {
      display: flex; align-items: flex-end; gap: 10px;
      &.user { flex-direction: row-reverse; }
    }
    .msg-avatar {
      width: 30px; height: 30px; border-radius: 10px; flex-shrink: 0;
      background: linear-gradient(135deg,#8b5cf6,#7c3aed);
      display: flex; align-items: center; justify-content: center; color: white;
    }
    .msg-bubble {
      max-width: 75%; padding: 12px 16px; border-radius: 16px; font-size: 0.875rem; line-height: 1.6;
      background: var(--bg-glass); border: 1px solid var(--border); color: var(--text);
      .user & { background: linear-gradient(135deg,#0ea5e9,#0284c7); color: white; border-color: transparent; border-radius: 16px 16px 4px 16px; }
      .assistant & { border-radius: 4px 16px 16px 16px; }
    }
    .msg-time { font-size: 0.65rem; color: var(--text-dim); flex-shrink: 0; padding-bottom: 4px; }
    .typing-dots { display: flex; gap: 4px; align-items: center; height: 20px; }
    .typing-dots span {
      width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted);
      animation: typingBounce 1.2s ease-in-out infinite;
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
    @keyframes typingBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%            { transform: translateY(-6px); opacity: 1; }
    }

    .ai-composer {
      padding: 12px 24px 16px; border-top: 1px solid var(--border);
      background: var(--bg-panel); backdrop-filter: blur(12px);
    }
    .composer-inner {
      display: flex; align-items: flex-end; gap: 10px;
      background: var(--bg-glass); border: 1px solid var(--border);
      border-radius: 16px; padding: 10px 10px 10px 16px;
      transition: border-color 0.15s;
      &:focus-within { border-color: rgba(139,92,246,0.4); }
    }
    .ai-input {
      flex: 1; background: none; border: none; outline: none; resize: none;
      color: var(--text); font-size: 0.9rem; line-height: 1.5; max-height: 160px;
      font-family: var(--font-body);
      &::placeholder { color: var(--text-dim); }
    }
    .ai-send-btn {
      width: 38px; height: 38px; border-radius: 12px; border: none; flex-shrink: 0;
      background: linear-gradient(135deg,#8b5cf6,#7c3aed); color: white;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      transition: opacity 0.15s, transform 0.15s;
      &:hover:not(:disabled) { opacity: 0.88; transform: scale(1.05); }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
    .send-spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .ai-disclaimer {
      text-align: center; font-size: 0.68rem; color: var(--text-dim); margin: 8px 0 0;
    }
  `],
})
export class AiAssistantComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  inputText = '';
  isThinking = false;
  private scrollTimer: ReturnType<typeof setTimeout> | null = null;

  readonly suggestions: Suggestion[] = [
    { category: 'Diagnosis',     text: 'What are common differential diagnoses for acute chest pain?' },
    { category: 'Drug Safety',   text: 'Check for interactions: warfarin + aspirin + metformin' },
    { category: 'Protocol',      text: 'Summarise ACLS protocol for STEMI management' },
    { category: 'Lab Values',    text: 'Interpret: Na 128, K 3.1, Creatinine 2.4, HCO3 18' },
    { category: 'Radiology',     text: 'What findings suggest pulmonary embolism on CT-PA?' },
    { category: 'Pharmacology',  text: 'Dosing for heparin infusion in a 70 kg patient with ACS' },
  ];

  // Simulated AI responses
  private readonly RESPONSES: Record<string, string> = {
    default: `I'm your Clinical AI Assistant. I can help with differential diagnoses, drug interactions, lab interpretation, treatment protocols, and evidence-based medicine questions.\n\nPlease note that all AI-generated content should be verified with clinical judgment and current institutional guidelines.`,
    interaction: `⚠️ Drug Interaction Alert:\n\nWarfarin + Aspirin: HIGH RISK — concurrent use significantly increases bleeding risk. Monitor INR closely (target 2.0-3.0). Consider GI protection.\n\nWarfarin + Metformin: LOW RISK — minimal interaction. Monitor blood glucose if anticoagulation therapy changes.\n\nRecommendation: Assess benefit-risk ratio. If combination necessary, use lowest effective ASA dose (81mg), add PPI prophylaxis, and increase INR monitoring frequency.`,
    chest: `Differential Diagnoses — Acute Chest Pain:\n\n🔴 Life-threatening (rule out first):\n• ACS (NSTEMI, STEMI, Unstable Angina)\n• Aortic Dissection\n• Pulmonary Embolism\n• Tension Pneumothorax\n• Cardiac Tamponade\n\n🟡 Serious:\n• Myocarditis / Pericarditis\n• Esophageal Rupture\n\n🟢 Non-emergent:\n• GERD / Esophageal Spasm\n• Musculoskeletal\n• Anxiety / Panic\n\nWorkup: ECG (immediate), troponin x2, CXR, BMP. Consider D-dimer if PE likely.`,
  };

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
  }

  sendSuggestion(text: string): void {
    this.inputText = text;
    this.sendMessage();
  }

  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    if (!text || this.isThinking) return;

    this.inputText = '';
    this.messages.push({ role: 'user', content: text, timestamp: new Date() });
    this.scrollToBottom();

    this.isThinking = true;
    const typingMsg: ChatMessage = { role: 'assistant', content: '', timestamp: new Date(), typing: true };
    this.messages.push(typingMsg);
    this.scrollToBottom();

    await new Promise(r => setTimeout(r, 1400 + Math.random() * 800));

    const lower = text.toLowerCase();
    let response = this.RESPONSES['default'];
    if (lower.includes('chest') || lower.includes('pain')) response = this.RESPONSES['chest'];
    if (lower.includes('warfarin') || lower.includes('interaction')) response = this.RESPONSES['interaction'];

    // Replace typing indicator
    const idx = this.messages.indexOf(typingMsg);
    if (idx !== -1) {
      this.messages[idx] = { role: 'assistant', content: response, timestamp: new Date(), typing: false };
    }
    this.isThinking = false;
    this.scrollToBottom();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [];
  }

  private scrollToBottom(): void {
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      const el = document.getElementById('aiChatArea');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
