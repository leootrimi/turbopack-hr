import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('time-off')
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createTimeOffDto: CreateTimeOffDto) {
    const userId = req.user.id;
    return this.timeOffService.create(userId, createTimeOffDto);
  }
}
