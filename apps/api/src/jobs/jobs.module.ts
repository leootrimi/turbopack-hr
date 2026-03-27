import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [DrizzleModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
