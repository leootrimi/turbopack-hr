import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeOffService } from './time-off.service';

@Controller('time-off')
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: any,
    @Body() createTimeOffDto: CreateTimeOffDto,
  ) {
    const userId = req.user.id;
    return this.timeOffService.create(userId, createTimeOffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.timeOffService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Approved' | 'Rejected',
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.timeOffService.updateStatus(parseInt(id, 10), userId, status);
  }
}
