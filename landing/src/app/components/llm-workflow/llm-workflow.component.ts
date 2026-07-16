import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-llm-workflow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './llm-workflow.component.html',
  styleUrls: ['./llm-workflow.component.scss']
})
export class LlmWorkflowComponent {
  query = signal('');
  loading = signal(false);
  results: any = null;

  sources = signal({ qdrant: true, elastic: true, postgres: true });

  async submit() {
    const q = this.query();
    if (!q || q.trim().length === 0) return;
    this.loading.set(true);
    this.results = null;

    try {
      const res = await fetch('/api/llm/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, sources: Object.keys(this.sources()).filter(k => (this.sources() as any)[k]) })
      });
      this.results = await res.json();
    } catch (err) {
      this.results = { error: (err as Error).message };
    } finally {
      this.loading.set(false);
    }
  }
}
