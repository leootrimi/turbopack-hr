import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import { compensation, employee, jobInfo } from 'src/database/schema';
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

}
