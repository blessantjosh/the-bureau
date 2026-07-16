import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isScrolled = signal(false);
  isMobileOpen = signal(false);

  navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Solutions', href: '#architecture' },
    { label: 'Platform', href: '#tech-stack' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#testimonials' },
  ];

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 20); }

  toggleMobile() { this.isMobileOpen.update(v => !v); }

  scrollTo(href: string) {
    this.isMobileOpen.set(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get navClass() { return this.isScrolled() ? 'navbar scrolled' : 'navbar'; }
}
