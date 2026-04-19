import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DrizzleService } from '../database/drizzle.provider';
import { reviewCycles, selfReviews, managerReviews, type ReviewCycleQuestionJson } from '../database/schema';
import { eq, desc, and, or, isNotNull } from 'drizzle-orm';

function parseQuestions(input: unknown): ReviewCycleQuestionJson[] | null {
  if (input === undefined || input === null) return null;
  if (!Array.isArray(input)) return null;
  const out: ReviewCycleQuestionJson[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const o = raw as Record<string, unknown>;
    const idRaw = typeof o.id === 'string' ? o.id.trim() : '';
    const label = typeof o.label === 'string' ? o.label.trim() : '';
    const prompt = typeof o.prompt === 'string' ? o.prompt.trim() : '';
    if (!label || !prompt) continue;
    const placeholder =
      typeof o.placeholder === 'string' && o.placeholder.trim()
        ? o.placeholder.trim()
        : undefined;
    const tip = typeof o.tip === 'string' && o.tip.trim() ? o.tip.trim() : undefined;
    const id = idRaw || `q_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    out.push({ id, label, prompt, placeholder, tip });
  }
  return out.length ? out : null;
}

export interface CreateReviewCycleDto {
  title: string;
  description?: string;
  enabled?: boolean;
  startDate?: string;
  endDate?: string;
  selfReviewQuestions?: ReviewCycleQuestionJson[] | null;
  managerReviewQuestions?: ReviewCycleQuestionJson[] | null;
}

export interface UpdateReviewCycleDto {
  title?: string;
  description?: string;
  enabled?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  selfReviewQuestions?: ReviewCycleQuestionJson[] | null;
  managerReviewQuestions?: ReviewCycleQuestionJson[] | null;
}

export interface SubmitSelfReviewDto {
  employeeId: number;
  reviewCycleId: number;
  answers: Record<string, string>;
  status?: 'draft' | 'submitted';
}

export interface SubmitManagerReviewDto {
  employeeId: number;
  managerId: number;
  reviewCycleId: number;
  answers: Record<string, any>;
  status?: 'draft' | 'submitted';
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
        selfReviewQuestions: parseQuestions(dto.selfReviewQuestions),
        managerReviewQuestions: parseQuestions(dto.managerReviewQuestions),
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
    if ('selfReviewQuestions' in dto)
      values.selfReviewQuestions = parseQuestions(dto.selfReviewQuestions);
    if ('managerReviewQuestions' in dto)
      values.managerReviewQuestions = parseQuestions(dto.managerReviewQuestions);

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

  // --- Submissions ---

  async submitSelfReview(dto: SubmitSelfReviewDto) {
    const [existing] = await this.drizzle.db
      .select()
      .from(selfReviews)
      .where(
        and(
          eq(selfReviews.employeeId, dto.employeeId),
          eq(selfReviews.reviewCycleId, dto.reviewCycleId),
        ),
      )
      .limit(1);

    if (existing) {
      const [updated] = await this.drizzle.db
        .update(selfReviews)
        .set({
          answers: dto.answers,
          status: dto.status ?? 'submitted',
          updatedAt: new Date(),
        })
        .where(eq(selfReviews.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.drizzle.db
      .insert(selfReviews)
      .values({
        employeeId: dto.employeeId,
        reviewCycleId: dto.reviewCycleId,
        answers: dto.answers,
        status: dto.status ?? 'submitted',
      })
      .returning();
    return created;
  }

  async submitManagerReview(dto: SubmitManagerReviewDto) {
    const [existing] = await this.drizzle.db
      .select()
      .from(managerReviews)
      .where(
        and(
          eq(managerReviews.employeeId, dto.employeeId),
          eq(managerReviews.managerId, dto.managerId),
          eq(managerReviews.reviewCycleId, dto.reviewCycleId),
        ),
      )
      .limit(1);

    if (existing) {
      const [updated] = await this.drizzle.db
        .update(managerReviews)
        .set({
          answers: dto.answers,
          status: dto.status ?? 'submitted',
          updatedAt: new Date(),
        })
        .where(eq(managerReviews.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.drizzle.db
      .insert(managerReviews)
      .values({
        employeeId: dto.employeeId,
        managerId: dto.managerId,
        reviewCycleId: dto.reviewCycleId,
        answers: dto.answers,
        status: dto.status ?? 'submitted',
      })
      .returning();
    return created;
  }

  async getSelfReviewSubmission(cycleId: number, employeeId: number) {
    const [result] = await this.drizzle.db
      .select()
      .from(selfReviews)
      .where(
        and(
          eq(selfReviews.reviewCycleId, cycleId),
          eq(selfReviews.employeeId, employeeId),
        ),
      )
      .limit(1);
    return result ?? null;
  }

  async getManagerReviewSubmission(cycleId: number, employeeId: number) {
    const [result] = await this.drizzle.db
      .select()
      .from(managerReviews)
      .where(
        and(
          eq(managerReviews.reviewCycleId, cycleId),
          eq(managerReviews.employeeId, employeeId),
        ),
      )
      .limit(1);
    return result ?? null;
  }

  async getReviewHistory(employeeId: number) {
    const history = await this.drizzle.db
      .select({
        cycleId: reviewCycles.id,
        title: reviewCycles.title,
        startDate: reviewCycles.startDate,
        endDate: reviewCycles.endDate,
        selfStatus: selfReviews.status,
        managerStatus: managerReviews.status,
      })
      .from(reviewCycles)
      .leftJoin(
        selfReviews,
        and(
          eq(selfReviews.reviewCycleId, reviewCycles.id),
          eq(selfReviews.employeeId, employeeId),
        ),
      )
      .leftJoin(
        managerReviews,
        and(
          eq(managerReviews.reviewCycleId, reviewCycles.id),
          eq(managerReviews.employeeId, employeeId),
        ),
      )
      .where(
        or(isNotNull(selfReviews.id), isNotNull(managerReviews.id)),
      )
      .orderBy(desc(reviewCycles.endDate));

    return history;
  }
}
