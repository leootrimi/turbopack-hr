import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get()
  findAll() {
    return this.announcementService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.announcementService.create({
      ...data,
      authorId: req.user.id,
    });
  }
}
