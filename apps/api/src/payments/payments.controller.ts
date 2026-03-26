import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    // Note: Multer handles multipart/form-data. 
    // JSON data in the body might need parsing if sent as a string field in FormData.
    return this.paymentsService.create({
      ...body,
      file,
    });
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.paymentsService.findAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }
}
