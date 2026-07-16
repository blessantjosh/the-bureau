import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from './services/animation.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { TrustedByComponent } from './components/trusted-by/trusted-by.component';
import { FeaturesComponent } from './components/features/features.component';
import { ArchitectureComponent } from './components/architecture/architecture.component';
import { AgentShowcaseComponent } from './components/agent-showcase/agent-showcase.component';
import { DocIntelligenceComponent } from './components/doc-intelligence/doc-intelligence.component';
import { TechStackComponent } from './components/tech-stack/tech-stack.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { FaqComponent } from './components/faq/faq.component';
import { CtaComponent } from './components/cta/cta.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    TrustedByComponent,
    FeaturesComponent,
    ArchitectureComponent,
    AgentShowcaseComponent,
    DocIntelligenceComponent,
    TechStackComponent,
    MetricsComponent,
    WorkflowComponent,
    TestimonialsComponent,
    PricingComponent,
    FaqComponent,
    CtaComponent,
    FooterComponent,
  ],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>
      <app-hero></app-hero>
      <app-trusted-by></app-trusted-by>
      <app-features></app-features>
      <app-architecture></app-architecture>
      <app-agent-showcase></app-agent-showcase>
      <app-doc-intelligence></app-doc-intelligence>
      <app-tech-stack></app-tech-stack>
      <app-metrics></app-metrics>
      <app-workflow></app-workflow>
      <app-testimonials></app-testimonials>
      <app-pricing></app-pricing>
      <app-faq></app-faq>
      <app-cta></app-cta>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background: #050816;
      overflow-x: hidden;
    }
  `]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private animService: AnimationService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.animService.initCursorFollower();
      this.animService.initMagneticButtons('.btn-magnetic');
      this.animService.observeElements('.fade-in-up');
      this.animService.observeElements('.fade-in-left');
      this.animService.observeElements('.fade-in-right');
      this.animService.observeElements('.scale-in');
      this.animService.initParallax('[data-parallax]');
    }, 500);
  }

  ngOnDestroy() {
    this.animService.destroy();
  }
}
