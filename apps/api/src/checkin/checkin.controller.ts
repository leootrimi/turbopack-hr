import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';

@Controller('api/checkin')
@UseGuards(JwtAuthGuard)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  create(@Body() createCheckinDto: CreateCheckinDto) {
    return this.checkinService.create(createCheckinDto);
  }

  @Get('dashboard')
  findTodayDashboard(
    @Query('date') date?: string,
    @Query('filterAbsent') filterAbsent?: string,
  ) {
    return this.checkinService.findTodayDashboard(
      date,
      filterAbsent === 'true',
    );
  }

  @Get()
  findAll() {
    return this.checkinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckinDto: UpdateCheckinDto) {
    return this.checkinService.update(+id, updateCheckinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkinService.remove(+id);
  }
}
