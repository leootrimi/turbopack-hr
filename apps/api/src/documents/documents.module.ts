import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DrizzleModule } from '../database/drizzle.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [DrizzleModule, AwsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
