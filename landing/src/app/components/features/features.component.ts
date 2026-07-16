import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements AfterViewInit {
  features = [
    { gradient: 'linear-gradient(135deg,#3B82F6,#06B6D4)', title: 'Autonomous AI Agents', desc: 'Deploy self-directing agents that perceive, reason, and execute complex multi-step workflows without human intervention using LangGraph.', tags: ['LangGraph','Multi-Agent','Self-Healing'], stat: '10x', statLabel: 'faster than manual' },
    { gradient: 'linear-gradient(135deg,#8B5CF6,#EC4899)', title: 'Document Intelligence', desc: 'Extract, classify, and act on information from any document type with 99.2% accuracy using advanced RAG pipelines and OCR.', tags: ['RAG','OCR','Classification'], stat: '99.2%', statLabel: 'extraction accuracy' },
    { gradient: 'linear-gradient(135deg,#10B981,#06B6D4)', title: 'Real-Time Decisions', desc: 'Make millisecond-level compliance and risk decisions powered by multi-model AI reasoning with complete, tamper-proof audit trails.', tags: ['<200ms','Audit Trail','Risk Engine'], stat: '142ms', statLabel: 'avg decision latency' },
    { gradient: 'linear-gradient(135deg,#F59E0B,#EF4444)', title: 'Advanced RAG Engine', desc: 'Semantic search with hybrid BM25+vector retrieval across Qdrant and Elasticsearch, achieving sub-100ms knowledge retrieval at scale.', tags: ['Qdrant','Elasticsearch','Hybrid'], stat: '<50ms', statLabel: 'retrieval speed' },
    { gradient: 'linear-gradient(135deg,#6366F1,#8B5CF6)', title: 'Multi-Model Orchestration', desc: 'Seamlessly route between OpenAI GPT-4, Google Gemini, Anthropic Claude, and local Ollama models based on task complexity and cost.', tags: ['GPT-4','Gemini','Claude','Ollama'], stat: '8+', statLabel: 'AI models supported' },
    { gradient: 'linear-gradient(135deg,#06B6D4,#10B981)', title: 'Enterprise Security', desc: 'SOC2 Type II, GDPR, and HIPAA compliant infrastructure with end-to-end encryption, RBAC, SSO, and complete audit logging.', tags: ['SOC2','GDPR','HIPAA','SSO'], stat: '99.9%', statLabel: 'uptime SLA' },
  ];

  icons = [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.features-intro');
      this.anim.observeStagger('.features-grid', '.feat-card', 80);
      this.anim.initTiltEffect('.feat-card');
    }, 300);
  }
}
