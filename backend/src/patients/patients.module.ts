import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

/**
 * PatientsModule encapsulates all patient-domain functionality:
 * - PatientsController   → REST endpoints under /patients
 * - PatientsService      → business logic + Prisma queries
 *
 * DatabaseModule is @Global, so PrismaService is already available in the DI
 * container; importing it here is explicit documentation of the dependency.
 */
@Module({
  imports: [DatabaseModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
