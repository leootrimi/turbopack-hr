import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { DrizzleModule } from '../database/drizzle.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [DrizzleModule, EmailModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
