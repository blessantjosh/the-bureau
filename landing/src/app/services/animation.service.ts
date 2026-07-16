import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private observers: IntersectionObserver[] = [];

  constructor(private ngZone: NgZone) {}

  /**
   * Observes elements matching the given selector and adds a 'visible'
   * class when they enter the viewport. Supports IntersectionObserver options.
   */
  observeElements(selector: string, options?: IntersectionObserverInit): void {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.ngZone.run(() => {
            entry.target.classList.add('visible');
          });
        }
      });
    }, { threshold: 0.15, ...options });

    elements.forEach(el => observer.observe(el));
    this.observers.push(observer);
  }

  /**
   * Adds staggered transition delays to child elements then observes them.
   */
  observeStagger(
    containerSelector: string,
    childSelector: string,
    delayStep = 100
  ): void {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      const children = container.querySelectorAll(childSelector);
      children.forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${i * delayStep}ms`;
      });
    });
    this.observeElements(`${containerSelector} ${childSelector}`);
  }

  /**
   * Adds a magnetic hover effect to buttons — they subtly follow the cursor.
   */
  initMagneticButtons(selector = '.btn-magnetic'): void {
    const buttons = document.querySelectorAll<HTMLElement>(selector);
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
      });
    });
  }

  /**
   * Adds a 3D tilt effect to cards based on mouse position.
   */
  initTiltEffect(selector = '.tilt-card'): void {
    const cards = document.querySelectorAll<HTMLElement>(selector);
    cards.forEach(card => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * 12;
        const tiltY = (x - 0.5) * -12;
        card.style.transform =
          `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform =
          'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition =
          'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }

  /**
   * Creates and animates a glowing cursor follower element (desktop only).
   */
  initCursorFollower(): void {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.innerHTML = '<div class="cursor-dot"></div>';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Grow cursor on interactive elements
    const interactives = document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], input, textarea'
    );
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transition = 'transform 0.3s ease';
      });
    });
  }

  /**
   * Animates a counter from 0 to the given target value using easing.
   */
  animateCounter(
    element: HTMLElement,
    target: number,
    duration = 2000,
    suffix = '',
    prefix = ''
  ): void {
    const start = performance.now();
    const update = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Quartic ease-out
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(eased * target);
      element.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = prefix + target.toLocaleString() + suffix;
    };
    requestAnimationFrame(update);
  }

  /**
   * Looping typewriter effect cycling through an array of strings.
   */
  typewriterEffect(
    element: HTMLElement,
    texts: string[],
    speed = 80,
    pauseDuration = 2000
  ): void {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = texts[textIndex];
      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? speed / 2 : speed;

      if (!isDeleting && charIndex === currentText.length) {
        delay = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        delay = 500;
      }

      setTimeout(type, delay);
    };

    type();
  }

  /**
   * Applies a parallax translateY effect to elements with `data-parallax` attribute.
   * The attribute value controls the speed multiplier (default 0.3).
   */
  initParallax(selector = '[data-parallax]'): void {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          elements.forEach(el => {
            const speed = parseFloat(el.dataset['parallax'] ?? '0.3');
            el.style.transform = `translateY(${scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Animates SVG path stroke-dashoffset to create a "drawing" effect.
   */
  animateSvgPath(
    path: SVGPathElement,
    duration = 1500,
    delay = 0
  ): void {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transition = 'none';

    setTimeout(() => {
      path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      path.style.strokeDashoffset = '0';
    }, delay);
  }

  /**
   * Disconnects all IntersectionObservers and cleans up.
   */
  destroy(): void {
    this.observers.forEach(obs => obs.disconnect());
    this.observers = [];
  }
}
