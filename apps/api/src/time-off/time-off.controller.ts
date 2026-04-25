import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeOffService } from './time-off.service';

@Controller('time-off')
@UseGuards(JwtAuthGuard)
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @Post()
  async create(
    @Request() req: any,
    @Body() createTimeOffDto: CreateTimeOffDto,
  ) {
    const userId = req.user.id;
    return this.timeOffService.create(userId, createTimeOffDto);
  }

  @Get('balance')
  async getBalance(@Request() req: { user: { id: number } }) {
    return this.timeOffService.getBalance(req.user.id);
  }

  @Get('calendar')
  async getCalendar(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.timeOffService.getCalendarLeaves(from, to);
  }

  @Get()
  async findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.timeOffService.findAll(userId);
  }

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
