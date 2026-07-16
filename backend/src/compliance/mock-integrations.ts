// mock-integrations.ts
// Stubbed implementations for external action services.
// Replace the implementations below with real API calls once you have credentials.

import { Logger } from '@nestjs/common';

const logger = new Logger('MockIntegrations');

export async function createJiraTicket(opts: {
  title: string;
  description: string;
  priority: string;
  assignee: string;
}): Promise<string> {
  const ticketId = `COMP-${Math.floor(Math.random() * 9000) + 1000}`;
  logger.log(`[MOCK JIRA] Would create ticket: ${ticketId} — "${opts.title}" (${opts.priority})`);
  return ticketId;
}

export async function sendSlackAlert(opts: {
  channel: string;
  message: string;
}): Promise<string> {
  const msgId = `slack-${Date.now()}`;
  logger.log(`[MOCK SLACK] Would post to ${opts.channel}: ${opts.message.slice(0, 80)}`);
  return msgId;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  body: string;
}): Promise<string> {
  const emailId = `email-${opts.to}-${Date.now()}`;
  logger.log(`[MOCK EMAIL] Would send to ${opts.to}: "${opts.subject}"`);
  return emailId;
}

export async function blockDocument(documentId: string): Promise<void> {
  logger.log(`[MOCK BLOCK] Would mark document ${documentId} as BLOCKED`);
}
