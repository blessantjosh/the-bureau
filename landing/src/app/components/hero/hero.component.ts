import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string;
  pulse: number; pulseSpeed: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typeEl') typeRef!: ElementRef<HTMLSpanElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private rafId = 0;
  private mouseX = 0;
  private mouseY = 0;
  private boundMouseMove!: (e: MouseEvent) => void;

  visible = signal(false);
  nodeColors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];
  pipelineNodes = ['Ingest', 'RAG', 'Agent', 'Decide', 'Execute'];

  private colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'];
  private typeTexts = [
    'Autonomous AI Agents',
    'Intelligent Document Processing',
    'Real-Time Decision Intelligence',
    'Multi-Model AI Orchestration',
    'Enterprise RAG Pipelines',
  ];

  constructor(private anim: AnimationService) {}

  ngOnInit() { setTimeout(() => this.visible.set(true), 80); }

  ngAfterViewInit() {
    this.initCanvas();
    this.initTypewriter();
    this.boundMouseMove = (e: MouseEvent) => { this.mouseX = e.clientX; this.mouseY = e.clientY; };
    document.addEventListener('mousemove', this.boundMouseMove);
    setTimeout(() => this.anim.initTiltEffect('.hero-card'), 600);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    this.ctx = ctx;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 16000));
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.2,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.018 + Math.random() * 0.018,
    }));
    this.animate();
  }

  private animate() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      const dx = p.x - this.mouseX, dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) { const f = (100 - dist) / 100; p.x += dx * f * 0.012; p.y += dy * f * 0.012; }
      const op = Math.max(0, Math.min(1, p.opacity + Math.sin(p.pulse) * 0.18));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(op * 255).toString(16).padStart(2, '0');
      ctx.fill();
      this.particles.forEach(q => {
        if (q === p) return;
        const dx2 = p.x - q.x, dy2 = p.y - q.y;
        const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color + Math.floor((1 - d / 90) * 0.25 * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 0.4; ctx.stroke();
        }
      });
    });
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  private initTypewriter() {
    const el = this.typeRef?.nativeElement;
    if (el) this.anim.typewriterEffect(el, this.typeTexts, 62);
  }

  scrollDown() { document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }); }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
    document.removeEventListener('mousemove', this.boundMouseMove);
  }
}
