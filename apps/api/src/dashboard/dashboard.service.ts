import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import * as schema from '../database/schema';
import { sql, eq, and, gte, lte, desc } from 'drizzle-orm';

@Injectable()
export class DashboardService {
  constructor(private readonly drizzleService: DrizzleService) {}
  
  private get db() {
    return this.drizzleService.db;
  }

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total Employees
    const totalEmployees = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.employee);

    // 2. Working Today (Check-ins)
    const workingToday = await this.db
      .select({ count: sql<number>`count(distinct employee_id)` })
      .from(schema.checkinLogs)
      .where(
        and(
          gte(schema.checkinLogs.checkinTime, today),
          lte(schema.checkinLogs.checkinTime, tomorrow),
        ),
      );

    // 3. Pending Requests
    const pendingRequests = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.leaveRequests)
      .where(eq(schema.leaveRequests.status, 'Pending'));

    // 4. On Leave/Absent Today (Simulated for now based on approved leave requests covering today)
    const onLeaveToday = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.leaveRequests)
      .where(
        and(
          eq(schema.leaveRequests.status, 'Approved'),
          lte(schema.leaveRequests.startDate, today),
          gte(schema.leaveRequests.endDate, today),
        ),
      );

    // 5. Recent Announcements
    const recentAnnouncements = await this.db
      .select()
      .from(schema.announcements)
      .orderBy(desc(schema.announcements.createdAt))
      .limit(5);

    // 6. Recent Requests (for the list)
    const recentRequests = await this.db
      .select({
        id: schema.leaveRequests.id,
        employeeId: schema.leaveRequests.employeeId,
        type: schema.leaveRequests.type,
        status: schema.leaveRequests.status,
        startDate: schema.leaveRequests.startDate,
        endDate: schema.leaveRequests.endDate,
        reason: schema.leaveRequests.reason,
        employeeName: sql<string>`concat(${schema.employee.firstName}, ' ', ${schema.employee.lastName})`,
      })
      .from(schema.leaveRequests)
      .leftJoin(schema.employee, eq(schema.leaveRequests.employeeId, schema.employee.id))
      .orderBy(desc(schema.leaveRequests.createdAt))
      .limit(10);

    // 7. Upcoming Leaves (Approved leaves starting from tomorrow)
    const upcomingLeaves = await this.db
      .select({
        id: schema.leaveRequests.id,
        employeeName: sql<string>`concat(${schema.employee.firstName}, ' ', ${schema.employee.lastName})`,
        type: schema.leaveRequests.type,
        startDate: schema.leaveRequests.startDate,
        endDate: schema.leaveRequests.endDate,
      })
      .from(schema.leaveRequests)
      .leftJoin(schema.employee, eq(schema.leaveRequests.employeeId, schema.employee.id))
      .where(
        and(
          eq(schema.leaveRequests.status, 'Approved'),
          gte(schema.leaveRequests.startDate, tomorrow),
        ),
      )
      .orderBy(schema.leaveRequests.startDate)
      .limit(10);

    return {
      stats: {
        totalEmployees: Number(totalEmployees[0].count),
        workingToday: Number(workingToday[0].count),
        pendingRequests: Number(pendingRequests[0].count),
        onLeaveToday: Number(onLeaveToday[0].count),
      },
      recentAnnouncements,
      recentRequests,
      upcomingLeaves,
    };
  }
}
