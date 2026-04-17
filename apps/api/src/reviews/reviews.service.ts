import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import { reviewCycles } from '../database/schema';
import { eq, desc } from 'drizzle-orm';

export interface CreateReviewCycleDto {
  title: string;
  description?: string;
  enabled?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateReviewCycleDto {
  title?: string;
  description?: string;
  enabled?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

@Injectable()
export class ReviewsService {
  constructor(private readonly drizzle: DrizzleService) {}

  /** Return all cycles ordered newest first */
  async findAll() {
    return this.drizzle.db
      .select()
      .from(reviewCycles)
      .orderBy(desc(reviewCycles.createdAt));
  }

  /** Return the first enabled cycle (there should be at most one) */
  async findActive() {
    const result = await this.drizzle.db
      .select()
      .from(reviewCycles)
      .where(eq(reviewCycles.enabled, true))
      .limit(1);
    return result[0] ?? null;
  }

  async create(dto: CreateReviewCycleDto, createdById?: number) {
    // If creating as enabled, disable all others first
    if (dto.enabled) {
      await this.drizzle.db
        .update(reviewCycles)
        .set({ enabled: false, updatedAt: new Date() });
    }

    const [created] = await this.drizzle.db
      .insert(reviewCycles)
      .values({
        title: dto.title,
        description: dto.description,
        enabled: dto.enabled ?? false,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        createdById: createdById ?? null,
      })
      .returning();

    return created;
  }

  async update(id: number, dto: UpdateReviewCycleDto) {
    const existing = await this.drizzle.db
      .select()
      .from(reviewCycles)
      .where(eq(reviewCycles.id, id))
      .limit(1);

    if (!existing[0]) throw new NotFoundException(`Review cycle ${id} not found`);

    // Enabling this cycle → disable all others
    if (dto.enabled === true) {
      await this.drizzle.db
        .update(reviewCycles)
        .set({ enabled: false, updatedAt: new Date() });
    }

    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (dto.title !== undefined) values.title = dto.title;
    if (dto.description !== undefined) values.description = dto.description;
    if (dto.enabled !== undefined) values.enabled = dto.enabled;
    if ('startDate' in dto) values.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if ('endDate' in dto) values.endDate = dto.endDate ? new Date(dto.endDate) : null;

    const [updated] = await this.drizzle.db
      .update(reviewCycles)
      .set(values as any)
      .where(eq(reviewCycles.id, id))
      .returning();

    return updated;
  }

  async remove(id: number) {
    const [deleted] = await this.drizzle.db
      .delete(reviewCycles)
      .where(eq(reviewCycles.id, id))
      .returning();

    if (!deleted) throw new NotFoundException(`Review cycle ${id} not found`);
    return deleted;
  }
}
