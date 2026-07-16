import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private lenis: any;

  /**
   * Initialises Lenis smooth scroll if the package is available.
   * Falls back silently to native CSS `scroll-behavior: smooth`.
   */
  async init(): Promise<void> {
    try {
      const { default: Lenis } = await import('@studio-freight/lenis' as any);
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      });

      const raf = (time: number) => {
        this.lenis?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } catch {
      // Lenis not available — native smooth scroll is already enabled via CSS
    }
  }

  /**
   * Scrolls to a CSS selector, element, or numeric pixel offset.
   * Uses Lenis if available, otherwise falls back to native scrollIntoView.
   */
  scrollTo(target: string | number | HTMLElement, offset = 0): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else if (target instanceof HTMLElement) {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }

  /**
   * Pauses / resumes Lenis scroll (e.g. when a modal is open).
   */
  pause(): void {
    this.lenis?.stop();
  }

  resume(): void {
    this.lenis?.start();
  }

  /**
   * Returns the current vertical scroll position in pixels.
   */
  get scrollY(): number {
    return window.scrollY;
  }

  /**
   * Returns true if the page has been scrolled past the given threshold.
   */
  isPastThreshold(px: number): boolean {
    return window.scrollY > px;
  }

  /**
   * Cleans up Lenis instance.
   */
  destroy(): void {
    this.lenis?.destroy();
    this.lenis = null;
  }
}
