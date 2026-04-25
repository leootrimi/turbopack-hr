import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';

@Controller('api/applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  async findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  async create(@Body() data: any) {
    return this.applicationsService.create({
      jobId: +data.jobId,
      name: data.name,
      email: data.email,
      notes: data.notes,
    });
  }

  @Patch(':id/stage')
  async updateStage(@Param('id') id: string, @Body('stage') stage: string) {
    return this.applicationsService.updateStage(+id, stage as any);
  }

  @Patch(':id/reject')
  async rejectApplication(@Param('id') id: string) {
    return this.applicationsService.rejectApplication(+id);
  }
}
