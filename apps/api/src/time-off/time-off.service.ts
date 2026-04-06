import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import {
  leaveRequests,
  users,
  employee,
  timeOffBalance,
  timeOffTypes,
} from '../database/schema';
import { desc, eq, sql, and, gte, lte } from 'drizzle-orm';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { TimeOffTypesService } from './time-off-types.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class TimeOffService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly timeOffTypesService: TimeOffTypesService,
    private readonly emailService: EmailService,
  ) {}

  async getDashboardRequests(
    userId: number,
    role: string,
    page: number = 1,
    perPage: number = 10,
    status: 'Pending' | 'Approved' | 'Rejected' = 'Pending',
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
      .where(and(whereClause, eq(leaveRequests.status, status)))
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

  /**
   * Approved leave overlapping [from, to] (inclusive calendar days), all employees.
   * Used by the "Who's out" calendar.
   */
  async getCalendarLeaves(fromStr: string, toStr: string) {
    const from = new Date(fromStr);
    const to = new Date(toStr);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('Invalid from/to date');
    }
    if (from > to) {
      throw new BadRequestException('"from" must be before or equal to "to"');
    }

    const fromStart = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate(),
      0,
      0,
      0,
      0,
    );
    const toEnd = new Date(
      to.getFullYear(),
      to.getMonth(),
      to.getDate(),
      23,
      59,
      59,
      999,
    );

    const rows = await this.drizzle.db
      .select({
        id: leaveRequests.id,
        employeeId: leaveRequests.employeeId,
        type: leaveRequests.type,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        days: leaveRequests.days,
        status: leaveRequests.status,
        firstName: employee.firstName,
        lastName: employee.lastName,
      })
      .from(leaveRequests)
      .innerJoin(employee, eq(leaveRequests.employeeId, employee.id))
      .where(
        and(
          eq(leaveRequests.status, 'Approved'),
          lte(leaveRequests.startDate, toEnd),
          gte(leaveRequests.endDate, fromStart),
        ),
      )
      .orderBy(leaveRequests.startDate);

    return rows.map((r) => ({
      id: r.id.toString(),
      employeeId: r.employeeId,
      firstName: r.firstName,
      lastName: r.lastName,
      type: r.type,
      startDate: r.startDate,
      endDate: r.endDate,
      days: parseFloat(String(r.days)),
      status: r.status,
    }));
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

    const types = await this.drizzle.db
      .select()
      .from(timeOffTypes)
      .where(eq(timeOffTypes.enabled, true));

    const rows = await this.drizzle.db
      .select()
      .from(timeOffBalance)
      .where(eq(timeOffBalance.employeeId, user.employeeId));

    return types.map(t => {
      const b = rows.find(r => r.timeOffTypeId === t.id);
      return {
        timeOffTypeId: t.id,
        typeName: t.name,
        total: String(b ? b.total : t.defaultValue),
        used: String(b ? b.used : '0.0'),
      };
    });
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
    const result = await this.drizzle.db.transaction(async (tx) => {
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

      const employeeRecords = await tx
        .select({
          email: users.email,
          firstName: employee.firstName,
        })
        .from(users)
        .innerJoin(employee, eq(employee.id, users.employeeId))
        .where(eq(users.employeeId, request.employeeId))
        .limit(1);

      // 3. Update the balance if approved
      if (status === 'Approved') {
        const typeRecord = await tx
          .select({ id: timeOffTypes.id, defaultValue: timeOffTypes.defaultValue })
          .from(timeOffTypes)
          .where(eq(timeOffTypes.name, request.type))
          .limit(1);

        if (typeRecord[0]) {
          const typeId = typeRecord[0].id;
          const existing = await tx.select().from(timeOffBalance)
            .where(and(eq(timeOffBalance.employeeId, request.employeeId), eq(timeOffBalance.timeOffTypeId, typeId))).limit(1);
          
          if (existing[0]) {
            await tx
              .update(timeOffBalance)
              .set({
                used: sql`${timeOffBalance.used} + ${request.days}`,
                updatedAt: new Date(),
              })
              .where(eq(timeOffBalance.id, existing[0].id));
          } else {
            await tx
              .insert(timeOffBalance)
              .values({
                employeeId: request.employeeId,
                timeOffTypeId: typeId,
                total: typeRecord[0].defaultValue,
                used: request.days.toString(),
              });
          }
        }
      }

      return {
        updatedRequest,
        employeeEmail: employeeRecords[0]?.email,
        employeeFirstName: employeeRecords[0]?.firstName ?? 'there',
        requestType: request.type,
        requestStartDate: request.startDate,
        requestEndDate: request.endDate,
      };
    });

    if (result.employeeEmail) {
      this.emailService.enqueueTimeOffStatusEmail({
        toEmail: result.employeeEmail,
        firstName: result.employeeFirstName,
        leaveType: result.requestType,
        startDate: result.requestStartDate,
        endDate: result.requestEndDate,
        status,
      });
    }

    return result.updatedRequest;
  }
}
