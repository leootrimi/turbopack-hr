import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import {
  compensation,
  employee,
  jobInfo,
  teams,
  users,
  timeOffBalance,
  leaveRequests,
  timeOffTypes,
} from 'src/database/schema';
import * as bcrypt from 'bcrypt';
import { EmployeeWithJob } from './dto/find-employee.dto';
import { eq, sql } from 'drizzle-orm';
import { EmailService } from 'src/email/email.service';
import { CreateEmployeeDto } from '@repo/types';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const tempPassword =
      process.env.DEFAULT_EMPLOYEE_PASSWORD?.trim() || 'password';

    const createdEmployee = await this.drizzle.db.transaction(async (tx) => {
      const personalEmail =
        dto.personal.personalEmail && dto.personal.personalEmail.trim()
          ? dto.personal.personalEmail.trim()
          : dto.personal.email;

      const [newEmployee] = await tx
        .insert(employee)
        .values({
          firstName: dto.personal.firstName,
          lastName: dto.personal.lastName,
          email: dto.personal.email,
          personalEmail,
          phone: dto.personal.phone,
          dateOfBirth: dto.personal.dateOfBirth
            ? new Date(dto.personal.dateOfBirth)
            : null,
          personalNumber: dto.personal.personalNumber,
          address: dto.personal.address,
          emergencyContact: dto.personal.emergencyContact,
        })
        .returning();

      await tx.insert(jobInfo).values({
        employeeId: newEmployee.id,
        jobTitle: dto.job.jobTitle,
        department: dto.job.department,
        teamId: dto.job.teamId,
        managerId: dto.job.managerId ?? null,
        employmentType: dto.job.employmentType,
        startDate: new Date(dto.job.startDate),
        endDate: dto.job.endDate ? new Date(dto.job.endDate) : null,
        workLocation: dto.job.workLocation,
      });

      await tx.insert(compensation).values({
        employeeId: newEmployee.id,
        salaryAmount: dto.compensation.salaryAmount,
        salaryType: dto.compensation.salaryType,
        currency: dto.compensation.currency,
        paymentFrequency: dto.compensation.paymentFrequency,
        bankAccount: dto.compensation.bankAccount,
        bonusEligible: dto.compensation.bonusEligible,
      });

      const defaultPasswordHash = await bcrypt.hash(tempPassword, 10);
      await tx.insert(users).values({
        employeeId: newEmployee.id,
        email: dto.personal.email,
        passwordHash: defaultPasswordHash,
        role: 'employee',
        isActive: true,
      });

      const allTypes = await tx.select().from(timeOffTypes).where(eq(timeOffTypes.enabled, true));
      if (allTypes.length > 0) {
        await tx.insert(timeOffBalance).values(
          allTypes.map(t => ({
            employeeId: newEmployee.id,
            timeOffTypeId: t.id,
            total: t.defaultValue,
            used: '0.0',
          }))
        );
      }

      return newEmployee;
    });

    // Fire-and-forget so we do not extend request latency.
    this.emailService.enqueueAccountCreatedEmail({
      toEmail: createdEmployee.personalEmail || createdEmployee.email,
      firstName: createdEmployee.firstName,
      lastName: createdEmployee.lastName,
      accountEmail: createdEmployee.email,
      tempPassword,
    });

    return createdEmployee;
  }

  async findAll(page = 1, pageSize = 10): Promise<EmployeeWithJob[]> {
    const offset = (page - 1) * pageSize;

    const results = await this.drizzle.db
      .select({
        id: employee.id,
        fullName: sql<string>`${employee.firstName} || ' ' || ${employee.lastName}`, // Combine first + last
        email: employee.email,
        jobTitle: jobInfo.jobTitle,
        department: jobInfo.department,
      })
      .from(employee)
      .leftJoin(jobInfo, eq(jobInfo.employeeId, employee.id))
      .limit(pageSize)
      .offset(offset);

    return results;
  }

  async findOne(id: number) {
    const result = await this.drizzle.db
      .select({
        personal: {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          personalEmail: employee.personalEmail,
          phone: employee.phone,
          dateOfBirth: employee.dateOfBirth,
          personalNumber: employee.personalNumber,
          address: employee.address,
          emergencyContact: employee.emergencyContact,
          createdAt: employee.createdAt,
        },
        job: {
          jobTitle: jobInfo.jobTitle,
          department: jobInfo.department,
          employmentType: jobInfo.employmentType,
          startDate: jobInfo.startDate,
          endDate: jobInfo.endDate,
          workLocation: jobInfo.workLocation,
        },
        compensation: {
          salaryAmount: compensation.salaryAmount,
          salaryType: compensation.salaryType,
          currency: compensation.currency,
          paymentFrequency: compensation.paymentFrequency,
          bankAccount: compensation.bankAccount,
          bonusEligible: compensation.bonusEligible,
        },
      })
      .from(employee)
      .leftJoin(jobInfo, eq(jobInfo.employeeId, employee.id))
      .leftJoin(compensation, eq(compensation.employeeId, employee.id))
      .where(eq(employee.id, id))
      .limit(1);

    if (!result[0]) return null;

    const timeOffBalanceResult = await this.drizzle.db
      .select({
        timeOffTypeId: timeOffBalance.timeOffTypeId,
        typeName: timeOffTypes.name,
        total: timeOffBalance.total,
        used: timeOffBalance.used,
      })
      .from(timeOffBalance)
      .innerJoin(timeOffTypes, eq(timeOffBalance.timeOffTypeId, timeOffTypes.id))
      .where(eq(timeOffBalance.employeeId, id));

    const leaveRequestsResult = await this.drizzle.db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.employeeId, id));

    return {
      ...result[0],
      timeOffBalance: timeOffBalanceResult,
      leaveRequests: leaveRequestsResult,
    };
  }

  async getEmployeeTeam(employeeId: number) {
    const result = await this.drizzle.db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        teamType: teams.team_type,
        leaderName: sql<string>`CONCAT(${employee.firstName}, ' ', ${employee.lastName})`,
        teamMemberCount: sql<number>`(
        SELECT COUNT(*) FROM job_info ji2 WHERE ji2.team_id = ${teams.id}
      )`,
      })
      .from(jobInfo)
      .leftJoin(teams, eq(teams.id, jobInfo.teamId))
      .leftJoin(employee, eq(employee.id, teams.leaderId))
      .where(eq(jobInfo.employeeId, employeeId))
      .limit(1);

    if (!result[0] || !result[0].teamId) return null;
    return result[0];
  }

  async updateEmployeeTeam(employeeId: number, teamId: number | null) {
    const existing = await this.drizzle.db
      .select({ id: jobInfo.id })
      .from(jobInfo)
      .where(eq(jobInfo.employeeId, employeeId))
      .limit(1);

    if (!existing[0])
      throw new NotFoundException(
        `No job info found for employee ${employeeId}`,
      );

    await this.drizzle.db
      .update(jobInfo)
      .set({ teamId })
      .where(eq(jobInfo.employeeId, employeeId));

    return this.getEmployeeTeam(employeeId);
  }
}
