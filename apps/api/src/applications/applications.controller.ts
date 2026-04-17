import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationsService } from './applications.service';

@Controller('api/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.applicationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/stage')
  async updateStage(@Param('id') id: string, @Body('stage') stage: string) {
    return this.applicationsService.updateStage(+id, stage as any);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  async rejectApplication(@Param('id') id: string) {
    return this.applicationsService.rejectApplication(+id);
  }
}
