import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss']
})
export class ArchitectureComponent implements AfterViewInit {
  nodes = [
    { label: 'Angular 19', sub: 'Frontend SPA', icon: '▲', color: '#EF4444', grad: 'linear-gradient(135deg,#EF4444,#F97316)' },
    { label: 'NestJS', sub: 'API Gateway', icon: '⬡', color: '#EF4444', grad: 'linear-gradient(135deg,#DC2626,#EF4444)' },
    { label: 'LangGraph', sub: 'Agent Orchestration', icon: '🧠', color: '#8B5CF6', grad: 'linear-gradient(135deg,#8B5CF6,#A78BFA)' },
    { label: 'Advanced RAG', sub: 'Knowledge Engine', icon: '⚡', color: '#3B82F6', grad: 'linear-gradient(135deg,#3B82F6,#60A5FA)' },
    { label: 'Qdrant', sub: 'Vector Database', icon: '◈', color: '#06B6D4', grad: 'linear-gradient(135deg,#06B6D4,#22D3EE)' },
    { label: 'PostgreSQL', sub: 'Relational Store', icon: '🐘', color: '#336791', grad: 'linear-gradient(135deg,#336791,#4A90D9)' },
    { label: 'Elasticsearch', sub: 'Full-Text Search', icon: '🔍', color: '#F5A623', grad: 'linear-gradient(135deg,#F5A623,#FBBF24)' },
    { label: 'OpenAI / Gemini / Ollama', sub: 'AI Model Layer', icon: '🚀', color: '#10B981', grad: 'linear-gradient(135deg,#10B981,#34D399)' },
  ];

  metrics = [
    { label: 'Requests/sec', value: '12,847', color: '#3B82F6' },
    { label: 'P99 Latency', value: '98ms', color: '#10B981' },
    { label: 'Active Agents', value: '342', color: '#8B5CF6' },
    { label: 'Docs/hour', value: '8,491', color: '#F59E0B' },
  ];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.arch-intro');
      this.anim.observeStagger('.arch-flow', '.arch-node', 130);
    }, 300);
  }
}
