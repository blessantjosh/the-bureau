import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feature-page">
      <div class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon" style="background: linear-gradient(135deg, var(--accent), #E76F51)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
              <line x1="2"  y1="20" x2="22" y2="20"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Performance Analytics</h1>
            <p class="page-subtitle">Clinical query audits, system latency, and model accuracy logs</p>
          </div>
        </div>
      </div>

      <div class="stub-card glass">
        <h3 class="stub-title">Analytics Dashboard Under Construction</h3>
        <p class="stub-body">
          This dashboard will monitor query throughput, verify LangGraph decision logs against doctor overrides, and audit safety alerts over time.
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
export class AnalyticsComponent {}
