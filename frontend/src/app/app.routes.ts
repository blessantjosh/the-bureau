import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./features/patients/patients-list.component').then(m => m.PatientsListComponent),
  },
  {
    path: 'patients/:id',
    loadComponent: () =>
      import('./features/patients/patient-detail.component').then(m => m.PatientDetailComponent),
  },
  {
    path: 'clinical-notes',
    loadComponent: () =>
      import('./features/clinical-notes/clinical-notes.component').then(m => m.ClinicalNotesComponent),
  },
  {
    path: 'ai-assistant',
    loadComponent: () =>
      import('./features/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent),
  },
  {
    path: 'research',
    loadComponent: () =>
      import('./features/research/research.component').then(m => m.ResearchComponent),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
