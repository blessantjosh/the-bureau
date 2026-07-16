import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-metrics', standalone: true, imports: [CommonModule], templateUrl: './metrics.component.html', styleUrls: ['./metrics.component.scss'] })
export class MetricsComponent implements AfterViewInit {
  @ViewChildren('counterEl') counterEls!: QueryList<ElementRef<HTMLElement>>;

  stats = [
    { value: 500, suffix: '+', label: 'Enterprise Clients', desc: 'Fortune 500s trust NeuralOS for mission-critical AI workloads', color: '#3B82F6', progress: 85 },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', desc: 'Enterprise-grade reliability with automatic failover and redundancy', color: '#10B981', progress: 100 },
    { value: 142, suffix: 'ms', label: 'Avg Decision Latency', desc: 'Subsecond AI decisions even under peak enterprise load conditions', color: '#8B5CF6', progress: 72 },
    { value: 2.4, suffix: 'M', label: 'Tokens Per Second', desc: 'Massively parallel AI inference across dedicated GPU clusters', color: '#06B6D4', progress: 90 },
    { value: 10, suffix: 'B+', label: 'Documents Processed', desc: 'Over 10 billion pages analyzed, extracted, and indexed since launch', color: '#F59E0B', progress: 78 },
    { value: 50, suffix: '+', label: 'AI Models Supported', desc: 'OpenAI, Anthropic, Google, Mistral, Llama, and 45+ others', color: '#EF4444', progress: 65 },
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.metrics-intro');
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset['idx'] ?? '0');
            const stat = this.stats[idx];
            this.anim.animateCounter(entry.target as HTMLElement, stat.value, 2200, stat.suffix);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      this.counterEls.forEach(el => obs.observe(el.nativeElement));
    }, 400);
  }
}
