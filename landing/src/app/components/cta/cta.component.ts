import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({ selector: 'app-cta', standalone: true, imports: [CommonModule], templateUrl: './cta.component.html', styleUrls: ['./cta.component.scss'] })
export class CtaComponent implements AfterViewInit {
  constructor(private anim: AnimationService) {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.cta-inner');
      this.anim.initMagneticButtons('.cta-mag');
    }, 300);
  }
  scrollTo(id: string) { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }); }
}
