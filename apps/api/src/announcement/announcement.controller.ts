import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnnouncementService } from './announcement.service';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  findAll() {
    return this.announcementService.findAll();
  }

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.announcementService.create({
      ...data,
      authorId: req.user.id,
    });
  }
}
