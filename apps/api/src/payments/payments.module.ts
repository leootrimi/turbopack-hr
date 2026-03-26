import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DrizzleModule } from '../database/drizzle.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [DrizzleModule, AwsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
