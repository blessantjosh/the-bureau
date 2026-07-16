import { Component, AfterViewInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-doc-intelligence', standalone: true, imports: [CommonModule], templateUrl: './doc-intelligence.component.html', styleUrls: ['./doc-intelligence.component.scss'] })
export class DocIntelligenceComponent implements AfterViewInit, OnDestroy {
  currentStep = signal(0);
  isDragging = signal(false);
  private timer: any;

  steps = [
    { icon: '📄', label: 'Upload', desc: 'PDF, DOCX, XLSX, images accepted', color: '#3B82F6', done: false },
    { icon: '🔍', label: 'Extract', desc: 'OCR + layout analysis', color: '#8B5CF6', done: false },
    { icon: '⚡', label: 'Embed', desc: 'Vector embeddings generated', color: '#06B6D4', done: false },
    { icon: '📦', label: 'Index', desc: 'Stored in Qdrant + Elastic', color: '#10B981', done: false },
    { icon: '🎯', label: 'Query', desc: 'Semantic retrieval ready', color: '#F59E0B', done: false },
  ];

  docTypes = ['PDF', 'DOCX', 'XLSX', 'PNG', 'CSV'];

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.doc-intro');
      this.anim.observeElements('.doc-layout');
      this.startAnimation();
    }, 300);
  }

  private startAnimation() {
    this.timer = setInterval(() => {
      const next = (this.currentStep() + 1) % this.steps.length;
      this.currentStep.set(next);
    }, 1800);
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging.set(true); }
  onDragLeave() { this.isDragging.set(false); }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging.set(false); }

  dots = Array.from({ length: 36 }, (_, i) => ({ x: (i % 6) * 44 + 20, y: Math.floor(i / 6) * 30 + 20, active: Math.random() > 0.5 }));

  ngOnDestroy() { clearInterval(this.timer); }
}
