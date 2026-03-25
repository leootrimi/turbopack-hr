import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import { compensation, employee, jobInfo, users } from 'src/database/schema';
import * as bcrypt from 'bcrypt';
import { EmployeeWithJob } from './dto/find-employee.dto';
import { eq, sql } from 'drizzle-orm';
import { CreateEmployeeDto } from '@repo/types';

@Injectable()
export class EmployeeService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(dto: CreateEmployeeDto) {
    return await this.drizzle.db.transaction(async (tx) => {
      const [newEmployee] = await tx
        .insert(employee)
        .values({
          firstName: dto.personal.firstName,
          lastName: dto.personal.lastName,
          email: dto.personal.email,
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

      const defaultPasswordHash = await bcrypt.hash('password', 10);
      await tx.insert(users).values({
        employeeId: newEmployee.id,
        email: dto.personal.email,
        passwordHash: defaultPasswordHash,
        role: 'employee',
        isActive: true,
      });

      return newEmployee;
    });
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

  return result[0];
}

}
