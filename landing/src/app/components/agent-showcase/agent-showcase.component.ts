import { Component, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-agent-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-showcase.component.html',
  styleUrls: ['./agent-showcase.component.scss']
})
export class AgentShowcaseComponent implements AfterViewInit {
  expanded = signal(-1);

  agents = [
    { name: 'Compliance Agent', role: 'Risk & Regulatory', color: '#3B82F6', status: 'Active', docs: '2.4M', decisions: '142ms', accuracy: '99.2%', capabilities: ['Policy document analysis','Regulatory cross-referencing','Automated risk scoring','Audit trail generation','Escalation routing','Compliance reporting'] },
    { name: 'Research Agent', role: 'Knowledge Discovery', color: '#8B5CF6', status: 'Active', docs: '890K', decisions: '380ms', accuracy: '97.8%', capabilities: ['Multi-source web research','Citation verification','Hypothesis validation','Trend analysis','Insight summarization','Export to reports'] },
    { name: 'Finance Agent', role: 'Financial Intelligence', color: '#10B981', status: 'Active', docs: '1.1M', decisions: '95ms', accuracy: '99.7%', capabilities: ['Invoice extraction & matching','Fraud pattern detection','Cash flow forecasting','Contract term analysis','Tax compliance checks','Anomaly detection'] },
    { name: 'Support Agent', role: 'Customer Operations', color: '#F59E0B', status: 'Standby', docs: '5.2M', decisions: '210ms', accuracy: '96.5%', capabilities: ['Ticket classification','Sentiment analysis','Escalation prediction','Knowledge base search','Response drafting','SLA monitoring'] },
  ];

  toggle(i: number) { this.expanded.set(this.expanded() === i ? -1 : i); }

  constructor(private anim: AnimationService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.anim.observeElements('.showcase-intro');
      this.anim.observeStagger('.agents-grid', '.agent-card', 90);
    }, 300);
  }
}
