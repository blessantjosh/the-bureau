import { Component, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-testimonials', standalone: true, imports: [CommonModule], templateUrl: './testimonials.component.html', styleUrls: ['./testimonials.component.scss'] })
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  current = signal(0);
  private timer: any;

  items = [
    { quote: "NeuralOS cut our compliance review time from 3 days to under 4 hours. The autonomous agents handle regulatory cross-referencing with an accuracy we simply couldn't achieve manually.", name: 'Sarah Chen', role: 'Chief Risk Officer', company: 'Meridian Financial Group', initials: 'SC', rating: 5, color: '#3B82F6' },
    { quote: "We process 50,000 insurance claims monthly. NeuralOS handles 94% fully autonomously with 99.7% accuracy. The ROI in the first 6 months exceeded our entire year-one projection.", name: 'James Okafor', role: 'VP of Operations', company: 'Apex Insurance Partners', initials: 'JO', rating: 5, color: '#8B5CF6' },
    { quote: "The RAG pipeline is exceptional. We embedded 10 years of trade documentation and NeuralOS can retrieve and reason over any of it in under 200ms. It's transformed how our analysts work.", name: 'Mei Lin Zhang', role: 'Head of Trade Intelligence', company: 'GlobalTrade Corp', initials: 'MZ', rating: 5, color: '#10B981' },
    { quote: "Security was our top concern. NeuralOS's SOC2 Type II certification, air-gapped deployment option, and immutable audit trails gave our board full confidence. Worth every cent.", name: 'David Harrington', role: 'CISO', company: 'NovaTech Enterprises', initials: 'DH', rating: 5, color: '#06B6D4' },
    { quote: "What impressed us most was the multi-model orchestration. NeuralOS automatically routes to the right AI model for each task type, optimizing both cost and quality without any manual tuning.", name: 'Priya Sharma', role: 'Director of AI Strategy', company: 'Horizon Health Systems', initials: 'PS', rating: 5, color: '#F59E0B' },
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.testimonials-intro');
      this.timer = setInterval(() => this.current.update(v => (v + 1) % this.items.length), 5000);
    }, 300);
  }

  prev() { this.current.update(v => (v - 1 + this.items.length) % this.items.length); }
  next() { this.current.update(v => (v + 1) % this.items.length); }
  goto(i: number) { this.current.set(i); }
  ngOnDestroy() { clearInterval(this.timer); }
}
