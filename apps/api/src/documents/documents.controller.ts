import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('employees/:employeeId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: any = 'other',
  ) {
    return this.documentsService.upload(employeeId, file, category);
  }

  @Get()
  async findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('category') category?: string,
  ) {
    return this.documentsService.findByEmployee(employeeId, category);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }
}
