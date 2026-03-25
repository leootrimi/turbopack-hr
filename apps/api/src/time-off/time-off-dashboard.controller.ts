import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeOffService } from './time-off.service';

@Controller('dashboard/timeoff/requests')
export class TimeOffDashboardController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDashboardRequests(
    @Request() req: any,
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
  ) {
    const userId = req.user.id;
    const role = req.user.role;
    
    return this.timeOffService.getDashboardRequests(
      userId,
      role,
      parseInt(page, 10) || 1,
      parseInt(perPage, 10) || 10,
    );
  }
}
