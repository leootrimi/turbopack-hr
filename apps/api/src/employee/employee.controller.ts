import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from '@repo/types';

@Controller('api/employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('org-chart')
  getOrgChart() {
    return this.employeeService.getOrgChart();
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Get(':id/team')
  getTeam(@Param('id') id: string) {
    return this.employeeService.getEmployeeTeam(+id);
  }

  @Patch(':id/team')
  updateTeam(@Param('id') id: string, @Body() body: { teamId: number | null }) {
    return this.employeeService.updateEmployeeTeam(+id, body.teamId);
  }
}
