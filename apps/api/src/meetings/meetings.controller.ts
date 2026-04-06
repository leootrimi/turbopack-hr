import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: { user: { id: number } }) {
    return this.meetingsService.findAllForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: number } },
    @Body() dto: CreateMeetingDto,
  ) {
    return this.meetingsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Request() req: { user: { id: number } },
    @Param('id') id: string,
  ) {
    return this.meetingsService.remove(req.user.id, parseInt(id, 10));
  }
}
