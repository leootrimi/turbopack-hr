import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [UploadController],
})
export class UploadModule {}
