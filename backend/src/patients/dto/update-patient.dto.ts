import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

/**
 * All fields from CreatePatientDto become optional for partial updates.
 * class-validator decorators are inherited and applied only when the field
 * is present in the request body.
 */
export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
