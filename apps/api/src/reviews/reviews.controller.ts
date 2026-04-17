import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService, CreateReviewCycleDto, UpdateReviewCycleDto } from './reviews.service';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** GET /api/reviews/cycles — list all cycles */
  @Get('cycles')
  findAll() {
    return this.reviewsService.findAll();
  }

  /** GET /api/reviews/cycles/active — get the currently enabled cycle */
  @Get('cycles/active')
  findActive() {
    return this.reviewsService.findActive();
  }

  /** POST /api/reviews/cycles — create a new cycle */
  @Post('cycles')
  create(@Body() dto: CreateReviewCycleDto) {
    return this.reviewsService.create(dto);
  }

  /** PATCH /api/reviews/cycles/:id — update (including toggle enabled) */
  @Patch('cycles/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewCycleDto,
  ) {
    return this.reviewsService.update(id, dto);
  }

  /** DELETE /api/reviews/cycles/:id */
  @Delete('cycles/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
