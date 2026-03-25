import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import { leaveRequests, users } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateTimeOffDto } from './dto/create-time-off.dto';

@Injectable()
export class TimeOffService {
  constructor(private readonly drizzle: DrizzleService) {}

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
