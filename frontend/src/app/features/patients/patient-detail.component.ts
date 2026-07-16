import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="feature-page">

      <div class="page-header">
        <div class="page-header-content">
          <a routerLink="/patients" class="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Patients
          </a>
          <div class="page-header-icon" style="background:linear-gradient(135deg,#0ea5e9,#0369a1)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Patient Detail</h1>
            <p class="page-subtitle">{{ patientId }}</p>
          </div>
        </div>
        <div class="page-header-actions">
          <button class="btn-ghost-sm">📝 Add Note</button>
          <button class="btn-primary-sm">Edit Record</button>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="detail-grid">
        <div class="detail-profile glass">
          <div class="profile-avatar">SM</div>
          <h2 class="profile-name">Sarah Mitchell</h2>
          <p class="profile-id">{{ patientId }}</p>
          <span class="status-badge status-stable">Stable</span>
          <div class="profile-stats">
            <div class="pstat"><div class="pstat-val">52</div><div class="pstat-lbl">Age</div></div>
            <div class="pstat"><div class="pstat-val">F</div><div class="pstat-lbl">Gender</div></div>
            <div class="pstat"><div class="pstat-val">O+</div><div class="pstat-lbl">Blood</div></div>
          </div>
        </div>

        <div class="detail-info-col">
          <!-- Vitals -->
          <div class="info-card glass">
            <div class="info-card-title">Latest Vitals</div>
            <div class="vitals-grid">
              <div class="vital-item" *ngFor="let v of vitals">
                <div class="vital-label">{{ v.label }}</div>
                <div class="vital-value" [class.vital-alert]="v.alert">{{ v.value }}</div>
                <div class="vital-unit">{{ v.unit }}</div>
              </div>
            </div>
          </div>

          <!-- Medications -->
          <div class="info-card glass">
            <div class="info-card-title">Current Medications</div>
            <div class="med-list">
              <div class="med-item" *ngFor="let m of medications">
                <div class="med-dot" [class]="m.type"></div>
                <div class="med-body">
                  <div class="med-name">{{ m.name }}</div>
                  <div class="med-dose">{{ m.dose }} — {{ m.freq }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Preview -->
        <div class="info-card glass">
          <div class="info-card-title">Recent Clinical Notes</div>
          <div class="notes-list">
            <div class="note-item" *ngFor="let n of notes">
              <div class="note-header">
                <span class="note-type">{{ n.type }}</span>
                <span class="note-date">{{ n.date }}</span>
              </div>
              <p class="note-excerpt">{{ n.excerpt }}</p>
              <span class="note-author">Dr. {{ n.author }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .back-btn {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.83rem; color: var(--text-muted); text-decoration: none;
      padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg-glass); transition: all 0.15s ease;
      &:hover { background: var(--bg-glass-hover); color: var(--text); }
    }
    .btn-primary-sm {
      padding: 7px 16px; border-radius: 10px; border: none;
      background: linear-gradient(135deg,#0ea5e9,#0284c7); color: white;
      font-size: 0.83rem; font-weight: 600; cursor: pointer;
      transition: opacity 0.15s ease;
      &:hover { opacity: 0.88; }
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 220px 1fr;
      grid-template-rows: auto auto;
      gap: 16px;
    }
    @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }

    .detail-profile {
      grid-row: 1 / 3;
      display: flex; flex-direction: column; align-items: center;
      padding: 28px 20px; border-radius: 20px;
      border: 1px solid var(--border); background: var(--bg-panel); backdrop-filter: blur(16px);
      text-align: center;
    }
    .profile-avatar {
      width: 72px; height: 72px; border-radius: 50%; margin-bottom: 14px;
      background: linear-gradient(135deg,#0ea5e9,#0284c7);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; font-weight: 700; color: white;
    }
    .profile-name { font-size: 1rem; font-weight: 700; color: var(--text); margin: 0 0 4px; }
    .profile-id   { font-size: 0.75rem; color: var(--text-dim); margin: 0 0 12px; }
    .profile-stats { display: flex; gap: 20px; margin-top: 20px; }
    .pstat { text-align: center; }
    .pstat-val { font-size: 1.1rem; font-weight: 700; color: var(--text); }
    .pstat-lbl { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

    .detail-info-col { display: flex; flex-direction: column; gap: 16px; }
    .info-card {
      border-radius: 20px; border: 1px solid var(--border); padding: 20px;
      background: var(--bg-panel); backdrop-filter: blur(16px);
    }
    .info-card-title {
      font-size: 0.75rem; font-weight: 700; letter-spacing: 0.07em;
      text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px;
    }
    .vitals-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(100px,1fr)); gap: 12px;
    }
    .vital-item { text-align: center; padding: 12px 8px; background: var(--bg-glass); border-radius: 12px; }
    .vital-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .vital-value { font-size: 1.15rem; font-weight: 700; color: var(--text); }
    .vital-value.vital-alert { color: #ef4444; }
    .vital-unit  { font-size: 0.65rem; color: var(--text-dim); margin-top: 2px; }

    .med-list { display: flex; flex-direction: column; gap: 10px; }
    .med-item { display: flex; align-items: center; gap: 12px; }
    .med-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .med-dot.primary   { background: #0ea5e9; }
    .med-dot.secondary { background: #8b5cf6; }
    .med-dot.tertiary  { background: #10b981; }
    .med-name { font-size: 0.875rem; font-weight: 600; color: var(--text); }
    .med-dose { font-size: 0.75rem; color: var(--text-muted); }

    .notes-list { display: flex; flex-direction: column; gap: 14px; }
    .note-item { padding: 14px; background: var(--bg-glass); border-radius: 12px; border: 1px solid var(--border); }
    .note-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .note-type { font-size: 0.68rem; font-weight: 700; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.05em; }
    .note-date { font-size: 0.68rem; color: var(--text-dim); }
    .note-excerpt { font-size: 0.83rem; color: var(--text-muted); margin: 0 0 8px; line-height: 1.5; }
    .note-author { font-size: 0.7rem; color: var(--text-dim); }

    .status-badge { padding: 4px 12px; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .status-stable { background: rgba(16,185,129,0.12); color: #10b981; }
  `],
})
export class PatientDetailComponent implements OnInit {
  patientId = '';

  readonly vitals = [
    { label: 'Heart Rate',   value: '78',  unit: 'bpm',    alert: false },
    { label: 'BP',           value: '148', unit: 'mmHg',   alert: true  },
    { label: 'SpO₂',         value: '97%', unit: '',       alert: false },
    { label: 'Temperature',  value: '36.8',unit: '°C',     alert: false },
    { label: 'Weight',       value: '68',  unit: 'kg',     alert: false },
    { label: 'HbA1c',        value: '5.4', unit: '%',      alert: false },
  ];

  readonly medications = [
    { name: 'Lisinopril',   dose: '10 mg',  freq: 'Once daily',   type: 'primary'   },
    { name: 'Metformin',    dose: '500 mg', freq: 'Twice daily',  type: 'secondary' },
    { name: 'Atorvastatin', dose: '20 mg',  freq: 'Once at night',type: 'tertiary'  },
  ];

  readonly notes = [
    { type: 'Progress Note', date: 'Today, 09:14',       excerpt: 'BP remains elevated. Increased lisinopril dose. Patient reports mild dizziness. Continue monitoring.',            author: 'Chen, K.' },
    { type: 'Assessment',    date: 'Yesterday, 14:00',   excerpt: 'Routine cardiology follow-up. ECG within normal limits. Lipid panel improved vs last quarter.',                 author: 'Patel, R.' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') ?? 'Unknown';
  }
}
