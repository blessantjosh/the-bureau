import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({ selector: 'app-trusted-by', standalone: true, imports: [CommonModule], templateUrl: './trusted-by.component.html', styleUrls: ['./trusted-by.component.scss'] })
export class TrustedByComponent {
  logos = [
    { name: 'Meridian Financial', abbr: 'MF', color: '#3B82F6' },
    { name: 'Apex Insurance', abbr: 'AI', color: '#8B5CF6' },
    { name: 'GlobalTrade Corp', abbr: 'GT', color: '#06B6D4' },
    { name: 'NovaTech', abbr: 'NT', color: '#10B981' },
    { name: 'Horizon Health', abbr: 'HH', color: '#F59E0B' },
    { name: 'Stellar Dynamics', abbr: 'SD', color: '#EF4444' },
    { name: 'Arcadia Labs', abbr: 'AL', color: '#A78BFA' },
    { name: 'Vantage Group', abbr: 'VG', color: '#34D399' },
  ];

  get doubled() { return [...this.logos, ...this.logos]; }
}
