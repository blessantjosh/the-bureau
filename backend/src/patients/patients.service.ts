import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Patient, Prisma } from '@prisma/client';

import { PrismaService } from '../database/prisma.service';
import { PaginatedResult } from '../common/types/pagination.types';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Patient record.
   * Throws ConflictException if the MRN is already taken.
   */
  async create(dto: CreatePatientDto): Promise<Patient> {
    // Guard: MRN uniqueness (Prisma will throw P2002, but a friendly error is nicer)
    const existing = await this.prisma.patient.findUnique({
      where: { mrn: dto.mrn },
    });

    if (existing) {
      throw new ConflictException(
        `A patient with MRN "${dto.mrn}" already exists.`,
      );
    }

    const data: Prisma.PatientCreateInput = {
      mrn: dto.mrn,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: new Date(dto.dateOfBirth),
      gender: dto.gender,
      bloodGroup: dto.bloodGroup ?? null,
      allergies: dto.allergies ?? [],
      chronicConditions: dto.chronicConditions ?? [],
      emergencyContact: dto.emergencyContact
        ? (dto.emergencyContact as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      user: dto.userId
        ? { connect: { id: dto.userId } }
        : undefined,
    };

    const patient = await this.prisma.patient.create({ data });
    this.logger.log(`Patient created: id=${patient.id} mrn=${patient.mrn}`);
    return patient;
  }

  // ---------------------------------------------------------------------------
  // READ — paginated list
  // ---------------------------------------------------------------------------

  /**
   * Returns a paginated list of active patients.
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<Patient>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.patient.findMany({
        where: { isActive: true },
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where: { isActive: true } }),
    ]);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  // ---------------------------------------------------------------------------
  // READ — single by id
  // ---------------------------------------------------------------------------

  /**
   * Finds a Patient by its primary-key UUID.
   * Throws NotFoundException when the record does not exist.
   */
  async findOne(id: string): Promise<Patient> {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with id "${id}" not found.`);
    }
    return patient;
  }

  // ---------------------------------------------------------------------------
  // READ — single by MRN
  // ---------------------------------------------------------------------------

  /**
   * Finds a Patient by Medical Record Number.
   * Returns null when no record is found (allows callers to decide).
   */
  async findByMrn(mrn: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { mrn } });
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Partially updates a Patient record.
   * Throws NotFoundException when the record does not exist.
   * Throws ConflictException when the new MRN is already taken by another patient.
   */
  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    // Verify patient exists
    await this.findOne(id);

    // Guard: if MRN is changing, ensure no collision
    if (dto.mrn !== undefined) {
      const collision = await this.prisma.patient.findFirst({
        where: { mrn: dto.mrn, NOT: { id } },
      });
      if (collision) {
        throw new ConflictException(
          `MRN "${dto.mrn}" is already in use by another patient.`,
        );
      }
    }

    const data: Prisma.PatientUpdateInput = {
      ...(dto.mrn !== undefined && { mrn: dto.mrn }),
      ...(dto.firstName !== undefined && { firstName: dto.firstName }),
      ...(dto.lastName !== undefined && { lastName: dto.lastName }),
      ...(dto.dateOfBirth !== undefined && {
        dateOfBirth: new Date(dto.dateOfBirth),
      }),
      ...(dto.gender !== undefined && { gender: dto.gender }),
      ...(dto.bloodGroup !== undefined && { bloodGroup: dto.bloodGroup }),
      ...(dto.allergies !== undefined && { allergies: dto.allergies }),
      ...(dto.chronicConditions !== undefined && {
        chronicConditions: dto.chronicConditions,
      }),
      ...(dto.emergencyContact !== undefined && {
        emergencyContact: dto.emergencyContact
          ? (dto.emergencyContact as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      }),
      ...(dto.userId !== undefined && {
        user: dto.userId ? { connect: { id: dto.userId } } : { disconnect: true },
      }),
    };

    const updated = await this.prisma.patient.update({ where: { id }, data });
    this.logger.log(`Patient updated: id=${updated.id}`);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // SOFT DELETE
  // ---------------------------------------------------------------------------

  /**
   * Soft-deletes a Patient by setting isActive = false.
   * Throws NotFoundException when the record does not exist.
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // ensures record exists
    await this.prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });
    this.logger.log(`Patient soft-deleted: id=${id}`);
  }

  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  /**
   * Full-text search across firstName, lastName, and MRN.
   * Returns up to 50 active patients matching the query.
   */
  async search(query: string): Promise<Patient[]> {
    const trimmed = query.trim();

    return this.prisma.patient.findMany({
      where: {
        isActive: true,
        OR: [
          { firstName: { contains: trimmed, mode: 'insensitive' } },
          { lastName: { contains: trimmed, mode: 'insensitive' } },
          { mrn: { contains: trimmed, mode: 'insensitive' } },
        ],
      },
      orderBy: { lastName: 'asc' },
      take: 50,
    });
  }
}
