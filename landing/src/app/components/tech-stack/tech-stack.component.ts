import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-tech-stack', standalone: true, imports: [CommonModule], templateUrl: './tech-stack.component.html', styleUrls: ['./tech-stack.component.scss'] })
export class TechStackComponent implements AfterViewInit {
  hovered = signal(-1);

  techs = [
    { name: 'Angular', abbr: 'Ng', color: '#EF4444', bg: 'linear-gradient(135deg,#EF4444,#F97316)' },
    { name: 'NestJS', abbr: 'Ns', color: '#EF4444', bg: 'linear-gradient(135deg,#DC2626,#EF4444)' },
    { name: 'TypeScript', abbr: 'TS', color: '#3178C6', bg: 'linear-gradient(135deg,#3178C6,#60A5FA)' },
    { name: 'PostgreSQL', abbr: 'PG', color: '#336791', bg: 'linear-gradient(135deg,#336791,#4A90D9)' },
    { name: 'Qdrant', abbr: 'Qd', color: '#06B6D4', bg: 'linear-gradient(135deg,#06B6D4,#22D3EE)' },
    { name: 'Redis', abbr: 'Re', color: '#EF4444', bg: 'linear-gradient(135deg,#EF4444,#F87171)' },
    { name: 'Docker', abbr: 'Dk', color: '#2496ED', bg: 'linear-gradient(135deg,#2496ED,#60A5FA)' },
    { name: 'Kubernetes', abbr: 'K8s', color: '#326CE5', bg: 'linear-gradient(135deg,#326CE5,#6366F1)' },
    { name: 'OpenAI', abbr: 'OA', color: '#10A37F', bg: 'linear-gradient(135deg,#10A37F,#34D399)' },
    { name: 'Anthropic', abbr: 'An', color: '#CC785C', bg: 'linear-gradient(135deg,#CC785C,#F59E0B)' },
    { name: 'LangGraph', abbr: 'LG', color: '#8B5CF6', bg: 'linear-gradient(135deg,#8B5CF6,#A78BFA)' },
    { name: 'Elasticsearch', abbr: 'ES', color: '#F5A623', bg: 'linear-gradient(135deg,#F5A623,#FBBF24)' },
    { name: 'Prisma', abbr: 'Pr', color: '#2D3748', bg: 'linear-gradient(135deg,#2D3748,#4A5568)' },
    { name: 'GraphQL', abbr: 'GQL', color: '#E535AB', bg: 'linear-gradient(135deg,#E535AB,#F472B6)' },
    { name: 'RxJS', abbr: 'Rx', color: '#B7178C', bg: 'linear-gradient(135deg,#B7178C,#E535AB)' },
    { name: 'Jest', abbr: 'Jt', color: '#C21325', bg: 'linear-gradient(135deg,#C21325,#EF4444)' },
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.tech-intro');
      this.anim.observeStagger('.tech-grid', '.tech-card', 50);
    }, 300);
  }
}
