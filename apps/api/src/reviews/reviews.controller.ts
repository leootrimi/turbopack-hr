import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ReviewsService,
  CreateReviewCycleDto,
  UpdateReviewCycleDto,
  SubmitSelfReviewDto,
  SubmitManagerReviewDto,
} from './reviews.service';

@Controller('api/reviews')
@UseGuards(JwtAuthGuard)
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

  // --- Submissions ---

  @Post('submissions/self')
  submitSelf(@Body() dto: SubmitSelfReviewDto) {
    return this.reviewsService.submitSelfReview(dto);
  }

  @Post('submissions/manager')
  submitManager(@Body() dto: SubmitManagerReviewDto) {
    return this.reviewsService.submitManagerReview(dto);
  }

  @Get('submissions/self/:cycleId/:employeeId')
  getSelfSubmission(
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.reviewsService.getSelfReviewSubmission(cycleId, employeeId);
  }

  @Get('submissions/manager/:cycleId/:employeeId')
  getManagerSubmission(
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.reviewsService.getManagerReviewSubmission(cycleId, employeeId);
  }

  @Get('history/:employeeId')
  getHistory(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.reviewsService.getReviewHistory(employeeId);
  }
}
