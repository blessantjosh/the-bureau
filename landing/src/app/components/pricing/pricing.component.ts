import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-pricing', standalone: true, imports: [CommonModule], templateUrl: './pricing.component.html', styleUrls: ['./pricing.component.scss'] })
export class PricingComponent implements AfterViewInit {
  annual = signal(true);

  plans = [
    {
      name: 'Starter', desc: 'Perfect for teams exploring AI automation',
      monthly: 299, annual: 249, popular: false, color: '#3B82F6',
      features: ['Up to 5 AI Agents','100K documents/month','Basic RAG pipeline','GPT-4 + Gemini access','Email & chat support','99.5% SLA','Basic audit logging','REST API access'],
      cta: 'Start Free Trial',
    },
    {
      name: 'Professional', desc: 'For growing enterprises with serious AI needs',
      monthly: 899, annual: 749, popular: true, color: '#8B5CF6',
      features: ['Up to 25 AI Agents','1M documents/month','Advanced RAG + hybrid search','All AI models included','Priority 24/7 support','99.9% SLA','Full audit trail','Advanced analytics','Custom workflows','SSO / SAML'],
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise', desc: 'Mission-critical deployments at any scale',
      monthly: 0, annual: 0, popular: false, color: '#10B981',
      features: ['Unlimited AI Agents','Unlimited documents','Custom RAG architecture','Dedicated GPU clusters','Dedicated CSM + SLA','99.99% SLA','Immutable compliance logs','Air-gapped deployment','Custom integrations','HIPAA/SOC2/GDPR','On-premise option'],
      cta: 'Contact Sales',
    },
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.pricing-intro');
      this.anim.observeStagger('.pricing-grid', '.plan-card', 100);
      this.anim.initTiltEffect('.plan-card:not(.popular)');
    }, 300);
  }

  toggleAnnual() { this.annual.update(v => !v); }

  getPrice(plan: typeof this.plans[0]) {
    if (plan.monthly === 0) return 'Custom';
    return this.annual() ? '$' + plan.annual : '$' + plan.monthly;
  }
}
