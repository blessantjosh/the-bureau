import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Health check controller — exposes liveness and readiness probes
 * for infrastructure monitoring and the Angular frontend status panel.
 */
@Controller('health')
export class HealthController {
  private readonly startedAt = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHealth(): Record<string, unknown> {
    return {
      ok: true,
      platform: 'Clinical AI Platform',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - this.startedAt) / 1000),
      database: this.prisma.isConnected ? 'connected' : 'disconnected',
      provider: process.env.PROVIDER ?? 'nvidia',
      model: process.env.NVIDIA_MODEL ?? 'meta/llama-3.1-8b-instruct',
      timestamp: new Date().toISOString(),
    };
  }
}
