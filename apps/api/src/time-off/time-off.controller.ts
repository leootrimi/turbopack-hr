import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  Query,
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
  @Get('balance')
  async getBalance(@Request() req: { user: { id: number } }) {
    return this.timeOffService.getBalance(req.user.id);
  }

  /** Approved leave for all employees in a date range (Who's out calendar). */
  @UseGuards(JwtAuthGuard)
  @Get('calendar')
  async getCalendar(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.timeOffService.getCalendarLeaves(from, to);
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
