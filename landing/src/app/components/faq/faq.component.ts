import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-faq', standalone: true, imports: [CommonModule], templateUrl: './faq.component.html', styleUrls: ['./faq.component.scss'] })
export class FaqComponent implements AfterViewInit {
  open = signal(-1);

  faqs = [
    { q: 'How quickly can we get NeuralOS running in production?', a: 'Most customers go from signup to first production AI workflow within 24–48 hours. Our onboarding team provides a guided setup session, pre-built integrations for major enterprise systems, and a library of workflow templates you can customize.' },
    { q: 'What document formats does NeuralOS support?', a: 'NeuralOS ingests PDF, DOCX, XLSX, PPTX, TXT, CSV, JSON, XML, HTML, and all major image formats (PNG, JPG, TIFF, WEBP). Our OCR engine handles scanned documents and handwritten content with industry-leading accuracy.' },
    { q: 'Can we use our own AI models or keep data on-premise?', a: 'Yes. NeuralOS supports bring-your-own-model (BYOM) including Ollama, locally hosted Llama, Mistral, and any OpenAI-compatible API. Enterprise customers can also deploy the full NeuralOS stack in an air-gapped, on-premise environment.' },
    { q: 'How does NeuralOS ensure compliance with GDPR and HIPAA?', a: 'NeuralOS is SOC2 Type II certified and HIPAA-compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We support data residency requirements, offer EU-based data centers, and provide Data Processing Agreements (DPAs) for GDPR compliance.' },
    { q: 'What does the audit trail capture?', a: 'Every AI action, decision, document access, agent step, model call, and user interaction is recorded in an immutable, tamper-proof audit log with full timestamps, confidence scores, and reasoning traces. Logs are exportable in JSON, CSV, and standard SIEM formats.' },
    { q: 'How do AI agents handle edge cases and uncertain decisions?', a: "Agents are designed with configurable confidence thresholds. When a decision's confidence falls below your defined threshold, it automatically routes to a human reviewer with full context. You control the escalation rules, routing logic, and notification workflows." },
    { q: 'What integrations are available out of the box?', a: 'NeuralOS integrates natively with Salesforce, ServiceNow, SAP, Microsoft 365, Google Workspace, Slack, Teams, Jira, Zendesk, and 50+ others via pre-built connectors. For custom systems, our REST API and webhooks enable integration with any platform.' },
    { q: 'How is pricing calculated for high-volume usage?', a: "All plans include a generous baseline of document processing capacity. Above plan limits, additional processing is billed per thousand documents at transparent overage rates. Enterprise plans have unlimited capacity with no per-document charges — contact sales for custom pricing." },
  ];

  toggle(i: number) { this.open.set(this.open() === i ? -1 : i); }

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.faq-intro');
      this.anim.observeStagger('.faq-list', '.faq-item', 60);
    }, 300);
  }
}
