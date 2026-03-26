import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from '@repo/types';

@Controller('api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
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
