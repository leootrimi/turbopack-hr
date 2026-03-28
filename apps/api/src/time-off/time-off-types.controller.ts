import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  assertHrOrAdmin,
  TimeOffTypesService,
} from './time-off-types.service';
import { CreateTimeOffTypeDto } from './dto/create-time-off-type.dto';
import { UpdateTimeOffTypeDto } from './dto/update-time-off-type.dto';

@Controller('time-off/types')
@UseGuards(JwtAuthGuard)
export class TimeOffTypesController {
  constructor(private readonly timeOffTypesService: TimeOffTypesService) {}

  @Get()
  findAll(
    @Request() req: { user: { role?: string } },
    @Query('all') all?: string,
  ) {
    const includeAll = all === 'true' || all === '1';
    if (includeAll) {
      assertHrOrAdmin(req.user?.role);
      return this.timeOffTypesService.findMany(true);
    }
    return this.timeOffTypesService.findMany(false);
  }

  @Post()
  create(
    @Request() req: { user: { role?: string } },
    @Body() dto: CreateTimeOffTypeDto,
  ) {
    assertHrOrAdmin(req.user?.role);
    return this.timeOffTypesService.create(dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { role?: string } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTimeOffTypeDto,
  ) {
    assertHrOrAdmin(req.user?.role);
    return this.timeOffTypesService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Request() req: { user: { role?: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    assertHrOrAdmin(req.user?.role);
    return this.timeOffTypesService.remove(id);
  }
}
