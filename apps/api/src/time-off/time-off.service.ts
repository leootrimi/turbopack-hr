import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import {
  leaveRequests,
  users,
  employee,
  timeOffBalance,
} from 'src/database/schema';
import { desc, eq, sql, and } from 'drizzle-orm';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { TimeOffTypesService } from './time-off-types.service';

@Injectable()
export class TimeOffService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly timeOffTypesService: TimeOffTypesService,
  ) {}

  async getDashboardRequests(
    userId: number,
    role: string,
    page: number = 1,
    perPage: number = 10,
  ) {
    const offset = (page - 1) * perPage;

    // 1. Get employee data for the current user to double check
    const userRecords = await this.drizzle.db
      .select({
        employeeId: users.employeeId,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const currentUser = userRecords[0];
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    // 2. Build where clause based on role
    // Admin and HR can see all requests
    const isAdminOrHR = role === 'admin' || role === 'hr';
    const whereClause = isAdminOrHR
      ? undefined
      : eq(leaveRequests.employeeId, currentUser.employeeId);

    // 3. Perform Aggregations
    const summaryResult = await this.drizzle.db
      .select({
        totalRequests: sql<number>`cast(count(*) as int)`,
        newRequests: sql<number>`cast(count(*) filter (where ${leaveRequests.createdAt} > now() - interval '7 days') as int)`,
        approved: sql<number>`cast(count(*) filter (where ${leaveRequests.status} = 'Approved') as int)`,
        rejected: sql<number>`cast(count(*) filter (where ${leaveRequests.status} = 'Rejected') as int)`,
        pending: sql<number>`cast(count(*) filter (where ${leaveRequests.status} = 'Pending') as int)`,
      })
      .from(leaveRequests)
      .where(whereClause);

    const summary = summaryResult[0] || {
      totalRequests: 0,
      newRequests: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
    };

    // 4. Fetch Paginated Items
    const items = await this.drizzle.db
      .select({
        id: leaveRequests.id,
        employeeName: sql<string>`concat(${employee.firstName}, ' ', ${employee.lastName})`,
        type: leaveRequests.type,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        status: leaveRequests.status,
        createdAt: leaveRequests.createdAt,
      })
      .from(leaveRequests)
      .innerJoin(employee, eq(leaveRequests.employeeId, employee.id))
      .where(and(whereClause, eq(leaveRequests.status, 'Pending')))
      .orderBy(desc(leaveRequests.createdAt))
      .limit(perPage)
      .offset(offset);

    return {
      summary,
      page,
      perPage,
      items: items.map((item) => ({
        ...item,
        id: item.id.toString(),
        status: item.status.toLowerCase(),
      })),
    };
  }

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
        reviewedBy: employee.firstName,
        managerNote: leaveRequests.managerNote,
        createdAt: leaveRequests.createdAt,
      })
      .from(leaveRequests)
      .leftJoin(employee, eq(leaveRequests.reviewedById, employee.id))
      .where(eq(leaveRequests.employeeId, user.employeeId))
      .orderBy(desc(leaveRequests.createdAt));

    return results.map((req) => ({
      ...req,
      id: req.id.toString(),
      days: parseFloat(req.days),
      submittedAt: req.createdAt,
    }));
  }

  async getBalance(userId: number) {
    const userRecords = await this.drizzle.db
      .select({ employeeId: users.employeeId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRecords[0];
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const rows = await this.drizzle.db
      .select({
        vacationTotal: timeOffBalance.vacationTotal,
        vacationUsed: timeOffBalance.vacationUsed,
        sickTotal: timeOffBalance.sickTotal,
        sickUsed: timeOffBalance.sickUsed,
        personalTotal: timeOffBalance.personalTotal,
        personalUsed: timeOffBalance.personalUsed,
      })
      .from(timeOffBalance)
      .where(eq(timeOffBalance.employeeId, user.employeeId))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return {
        vacationTotal: '20.0',
        vacationUsed: '0.0',
        sickTotal: '10.0',
        sickUsed: '0.0',
        personalTotal: '5.0',
        personalUsed: '0.0',
      };
    }

    return {
      vacationTotal: String(row.vacationTotal),
      vacationUsed: String(row.vacationUsed),
      sickTotal: String(row.sickTotal),
      sickUsed: String(row.sickUsed),
      personalTotal: String(row.personalTotal),
      personalUsed: String(row.personalUsed),
    };
  }

  async create(userId: number, dto: CreateTimeOffDto) {
    const userRecords = await this.drizzle.db
      .select({ employeeId: users.employeeId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userRecords[0];
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.timeOffTypesService.assertTypeAllowedForRequest(dto.type);

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

  async updateStatus(
    id: number,
    userId: number,
    status: 'Approved' | 'Rejected',
  ) {
    return await this.drizzle.db.transaction(async (tx) => {
      // 1. Get employeeId of the reviewer (current user)
      const userRecords = await tx
        .select({ employeeId: users.employeeId })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const reviewer = userRecords[0];
      if (!reviewer) {
        throw new NotFoundException('Reviewer not found');
      }

      // 2. Fetch the request to get employeeId, days, and type
      const requestRecords = await tx
        .select()
        .from(leaveRequests)
        .where(eq(leaveRequests.id, id))
        .limit(1);

      const request = requestRecords[0];
      if (!request) {
        throw new NotFoundException(`Leave request with ID ${id} not found`);
      }

      // 2. Update the leave request
      const [updatedRequest] = await tx
        .update(leaveRequests)
        .set({
          status,
          reviewedById: reviewer.employeeId,
        })
        .where(eq(leaveRequests.id, id))
        .returning();

      if (!updatedRequest) {
        throw new NotFoundException(`Leave request with ID ${id} not found`);
      }

      // 3. Update the balance if approved
      if (status === 'Approved') {
        let balanceField: keyof typeof timeOffBalance.$inferInsert | null =
          null;
        if (request.type === 'Vacation') balanceField = 'vacationUsed';
        else if (request.type === 'Sick Leave') balanceField = 'sickUsed';
        else if (request.type === 'Personal Day') balanceField = 'personalUsed';

        if (balanceField) {
          await tx
            .update(timeOffBalance)
            .set({
              [balanceField as string]: sql`${timeOffBalance[balanceField as any]} + ${request.days}`,
              updatedAt: new Date(),
            })
            .where(eq(timeOffBalance.employeeId, request.employeeId));
        }
      }

      return updatedRequest;
    });
  }
}
