import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private readonly API_BASE = 'http://localhost:3000/api';

  @ViewChild('routeView') routeView?: ElementRef<HTMLDivElement>;

  currentTheme: 'light' | 'dark' = 'light';
  healthOk = false;
  sidebarOpen = false;

  islandState: 'boot' | 'idle' | 'compact' | 'expanded' | 'thinking' = 'boot';
  islandStatus = 'Connecting';
  private islandTimer: ReturnType<typeof setTimeout> | null = null;
  private particleAnimationId: number | null = null;

  readonly navItems: NavItem[] = [
    { path: '/dashboard',      label: 'Dashboard',       icon: 'grid' },
    { path: '/patients',       label: 'Patients',         icon: 'users' },
    { path: '/clinical-notes', label: 'Clinical Notes',   icon: 'file-text' },
    { path: '/ai-assistant',   label: 'AI Assistant',     icon: 'cpu' },
    { path: '/research',       label: 'Research',         icon: 'book-open' },
    { path: '/analytics',      label: 'Analytics',        icon: 'bar-chart' },
  ];

  ngOnInit(): void {
    this.initTheme();
    this.checkHealth();
  }

  ngAfterViewInit(): void {
    this.initParticles();
  }

  ngOnDestroy(): void {
    if (this.particleAnimationId !== null) {
      cancelAnimationFrame(this.particleAnimationId);
    }
    if (this.islandTimer !== null) {
      clearTimeout(this.islandTimer);
    }
  }

  private initTheme(): void {
    const saved = localStorage.getItem('clinical:theme') as 'light' | 'dark' | null;
    this.applyTheme(saved ?? 'light');
  }

  toggleTheme(): void {
    this.applyTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('clinical:theme', theme);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  /**
   * Every route swap is otherwise instant/abrupt. This retriggers a CSS
   * entrance animation (defined in app.scss) on the wrapper around
   * <router-outlet> each time a new page component activates, so
   * navigating between Dashboard / Patients / AI Assistant / etc. feels
   * like a soft fade+lift instead of a hard snap.
   */
  onRouteActivate(): void {
    const el = this.routeView?.nativeElement;
    if (!el) return;
    el.classList.remove('route-anim');
    // force reflow so the animation restarts even if the class name is unchanged
    void el.offsetWidth;
    el.classList.add('route-anim');
  }

  private async checkHealth(): Promise<void> {
    this.islandStatus = 'Connecting…';
    this.islandState = 'boot';
    try {
      const res = await fetch(`${this.API_BASE}/health`);
      const data = await res.json();
      this.healthOk = data.ok ?? true;
      this.islandStatus = 'System Online';
      this.islandState = 'expanded';
      this.collapseIsland(3000);
    } catch {
      this.healthOk = false;
      this.islandStatus = 'Backend Offline';
      this.islandState = 'compact';
    } finally {
      const splash = document.getElementById('splash');
      if (splash) {
        setTimeout(() => splash.classList.add('hidden'), 800);
      }
    }
  }

  toggleIsland(): void {
    if (this.islandState === 'compact') {
      this.islandState = 'expanded';
      this.collapseIsland(4000);
    } else {
      this.islandState = 'compact';
    }
  }

  private collapseIsland(delay: number): void {
    if (this.islandTimer !== null) clearTimeout(this.islandTimer);
    this.islandTimer = setTimeout(() => {
      if (this.islandState === 'expanded') this.islandState = 'compact';
    }, delay);
  }

  private initParticles(): void {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];

    const resize = (): void => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = (): void => {
      const count = Math.min(50, Math.floor((w * h) / 20000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      }));
    };

    const draw = (): void => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.07 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });
      if (!reduced) {
        this.particleAnimationId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reduced) draw();
  }
}
