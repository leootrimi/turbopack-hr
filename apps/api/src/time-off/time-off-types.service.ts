import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import { leaveRequests, timeOffTypes } from 'src/database/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import { CreateTimeOffTypeDto } from './dto/create-time-off-type.dto';
import { UpdateTimeOffTypeDto } from './dto/update-time-off-type.dto';

function rowToDto(row: typeof timeOffTypes.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    defaultValue: parseFloat(String(row.defaultValue ?? '0')) || 0,
    enabled: row.enabled,
    createdAt: row.createdAt,
  };
}

@Injectable()
export class TimeOffTypesService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findMany(includeDisabled: boolean) {
    const rows = includeDisabled
      ? await this.drizzle.db
          .select()
          .from(timeOffTypes)
          .orderBy(asc(timeOffTypes.name))
      : await this.drizzle.db
          .select()
          .from(timeOffTypes)
          .where(eq(timeOffTypes.enabled, true))
          .orderBy(asc(timeOffTypes.name));

    return rows.map(rowToDto);
  }

  async create(dto: CreateTimeOffTypeDto) {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const [existing] = await this.drizzle.db
      .select({ id: timeOffTypes.id })
      .from(timeOffTypes)
      .where(eq(timeOffTypes.name, name))
      .limit(1);

    if (existing) {
      throw new ConflictException('A time off type with this name already exists');
    }

    const [row] = await this.drizzle.db
      .insert(timeOffTypes)
      .values({
        name,
        defaultValue: String(dto.defaultValue ?? 0),
        enabled: dto.enabled ?? true,
      })
      .returning();

    return rowToDto(row);
  }

  async update(id: number, dto: UpdateTimeOffTypeDto) {
    const [current] = await this.drizzle.db
      .select()
      .from(timeOffTypes)
      .where(eq(timeOffTypes.id, id))
      .limit(1);

    if (!current) {
      throw new NotFoundException('Time off type not found');
    }

    const newName =
      dto.name !== undefined ? dto.name.trim() : current.name;
    if (dto.name !== undefined && !newName) {
      throw new BadRequestException('Name cannot be empty');
    }

    if (newName !== current.name) {
      const [nameConflict] = await this.drizzle.db
        .select({ id: timeOffTypes.id })
        .from(timeOffTypes)
        .where(eq(timeOffTypes.name, newName))
        .limit(1);

      if (nameConflict && nameConflict.id !== id) {
        throw new ConflictException('A time off type with this name already exists');
      }
    }

    return await this.drizzle.db.transaction(async (tx) => {
      if (newName !== current.name) {
        await tx
          .update(leaveRequests)
          .set({ type: newName })
          .where(eq(leaveRequests.type, current.name));
      }

      const [row] = await tx
        .update(timeOffTypes)
        .set({
          ...(dto.name !== undefined ? { name: newName } : {}),
          ...(dto.defaultValue !== undefined
            ? { defaultValue: String(dto.defaultValue) }
            : {}),
          ...(dto.enabled !== undefined ? { enabled: dto.enabled } : {}),
        })
        .where(eq(timeOffTypes.id, id))
        .returning();

      return rowToDto(row!);
    });
  }

  async remove(id: number) {
    const [current] = await this.drizzle.db
      .select()
      .from(timeOffTypes)
      .where(eq(timeOffTypes.id, id))
      .limit(1);

    if (!current) {
      throw new NotFoundException('Time off type not found');
    }

    const [{ c }] = await this.drizzle.db
      .select({ c: sql<number>`cast(count(*) as int)` })
      .from(leaveRequests)
      .where(eq(leaveRequests.type, current.name));

    if (c > 0) {
      throw new ConflictException(
        'Cannot delete a time off type that is used by existing requests',
      );
    }

    await this.drizzle.db
      .delete(timeOffTypes)
      .where(eq(timeOffTypes.id, id));
  }

  /** Ensure leave request creation uses a valid enabled type name. */
  async assertTypeAllowedForRequest(typeName: string) {
    const [row] = await this.drizzle.db
      .select()
      .from(timeOffTypes)
      .where(and(eq(timeOffTypes.name, typeName), eq(timeOffTypes.enabled, true)))
      .limit(1);

    if (!row) {
      throw new BadRequestException('Invalid or disabled time off type');
    }
  }
}

export function assertHrOrAdmin(role: string | undefined) {
  if (role !== 'admin' && role !== 'hr') {
    throw new ForbiddenException('Insufficient permissions');
  }
}
