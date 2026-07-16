import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <div class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon" style="background: linear-gradient(135deg, var(--accent), #457B9D)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Research Library</h1>
            <p class="page-subtitle">Medical Literature search, clinical trial indexing, and PICO syntheses</p>
          </div>
        </div>
      </div>

      <div class="stub-card glass">
        <h3 class="stub-title">Module Under Construction</h3>
        <p class="stub-body">
          The Research Library is currently being integrated with the clinical knowledge base. 
          Once active, it will allow clinicians to query indexed journals, match trials by patient criteria, and verify evidence grades directly.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .stub-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 40px;
      text-align: center;
      box-shadow: var(--shadow);
      max-width: 580px;
      margin: 40px auto;
    }
    .stub-title {
      font-family: var(--font-display);
      font-size: 1.5rem;
      color: var(--text);
      margin: 0 0 12px;
    }
    .stub-body {
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin: 0;
    }
  `]
})
export class ResearchComponent {}
