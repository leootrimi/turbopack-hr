import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import { leaveRequests, users, employee } from 'src/database/schema';
import { desc, eq } from 'drizzle-orm';
import { CreateTimeOffDto } from './dto/create-time-off.dto';

@Injectable()
export class TimeOffService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(userId: number) {
    const userRecords = await this.drizzle.db
      .select({ employeeId: users.employeeId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRecords[0];
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reviewerAlias = employee; // In a more complex join we might need an alias, but for now this is fine if we only join once

    const results = await this.drizzle.db
      .select({
        id: leaveRequests.id,
        type: leaveRequests.type,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        days: leaveRequests.days,
        reason: leaveRequests.reason,
        status: leaveRequests.status,
        attachmentName: leaveRequests.attachmentName,
        reviewedBy: employee.firstName, // Simple for now
        managerNote: leaveRequests.managerNote,
        createdAt: leaveRequests.createdAt,
      })
      .from(leaveRequests)
      .leftJoin(employee, eq(leaveRequests.reviewedById, employee.id))
      .where(eq(leaveRequests.employeeId, user.employeeId))
      .orderBy(desc(leaveRequests.createdAt));

    return results.map(req => ({
      ...req,
      id: req.id.toString(),
      days: parseFloat(req.days as string),
      submittedAt: req.createdAt,
    }));
  }

  async create(userId: number, dto: CreateTimeOffDto) {
    // 1. Map userId to employeeId
    const userRecords = await this.drizzle.db
      .select({ employeeId: users.employeeId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRecords[0];
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Insert leave request
    const [newRequest] = await this.drizzle.db
      .insert(leaveRequests)
      .values({
        employeeId: user.employeeId,
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        days: dto.days.toString(),
        reason: dto.reason,
        attachmentName: dto.attachmentName,
      })
      .returning();

    return newRequest;
  }
}
