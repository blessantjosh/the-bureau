import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService }    from './compliance.service';
import { DatabaseModule }       from '../database/database.module';

@Module({
  imports:     [DatabaseModule],
  controllers: [ComplianceController],
  providers:   [ComplianceService],
  exports:     [ComplianceService],
})
export class ComplianceModule {}
