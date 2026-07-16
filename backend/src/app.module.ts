import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { RagModule } from './rag/rag.module';
import { AgentModule } from './agent/agent.module';
import { ChatModule } from './chat/chat.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';
import { ComplianceModule } from './compliance/compliance.module';
import { PatientsModule } from './patients/patients.module';

/**
 * Root application module for the Clinical AI Platform.
 * Orchestrates all domain modules following Clean Architecture principles.
 */
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    RagModule,
    AgentModule,
    ChatModule,
    HealthModule,
    UploadModule,
    ComplianceModule,
    PatientsModule,
  ],
})
export class AppModule {}
