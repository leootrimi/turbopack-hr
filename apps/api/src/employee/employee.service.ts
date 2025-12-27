import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DrizzleService } from 'src/database/drizzle.provider';
import { employee } from 'src/database/schema';

@Injectable()
export class EmployeeService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.drizzle.db.insert(employee).values(createEmployeeDto).returning();
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
