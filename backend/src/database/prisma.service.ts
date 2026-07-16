import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;

  async onModuleInit() {
    // Attempt database connection in the background so it doesn't block server bootstrap
    this.connectDatabase();
  }

  private async connectDatabase() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Connected to PostgreSQL successfully.');
    } catch (err) {
      this.isConnected = false;
      this.logger.warn('PostgreSQL is offline. Running application in database fallback/mock mode.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

