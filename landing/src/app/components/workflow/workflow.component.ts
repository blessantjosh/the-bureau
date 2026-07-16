import { Component, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-workflow', standalone: true, imports: [CommonModule], templateUrl: './workflow.component.html', styleUrls: ['./workflow.component.scss'] })
export class WorkflowComponent implements AfterViewInit, OnDestroy {
  active = signal(0);
  private timer: any;

  steps = [
    { num: '01', title: 'Ingest Documents', desc: 'Upload any file type — PDF, DOCX, XLSX, images, emails. NeuralOS accepts all formats and begins processing immediately via OCR and layout analysis.', icon: '📥', color: '#3B82F6' },
    { num: '02', title: 'Embed & Index', desc: 'Documents are chunked, embedded into dense vector representations, and stored in Qdrant for semantic search and Elasticsearch for full-text retrieval.', icon: '⚡', color: '#8B5CF6' },
    { num: '03', title: 'Agent Processing', desc: 'LangGraph orchestrates autonomous agents that retrieve relevant context, apply business rules, cross-reference policies, and reason over the document content.', icon: '🧠', color: '#06B6D4' },
    { num: '04', title: 'AI Decision', desc: 'The AI reasoning engine produces a structured decision — Approve, Reject, Escalate, or Request Info — with a full confidence score and reasoning trace.', icon: '⚖️', color: '#10B981' },
    { num: '05', title: 'Execute & Audit', desc: 'Decisions trigger downstream actions: notifications, workflow updates, CRM writes, or approval workflows. Every step is recorded in an immutable audit trail.', icon: '✅', color: '#F59E0B' },
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.workflow-intro');
      this.timer = setInterval(() => this.active.update(v => (v + 1) % this.steps.length), 3500);
    }, 300);
  }

  select(i: number) { this.active.set(i); }
  ngOnDestroy() { clearInterval(this.timer); }
}
