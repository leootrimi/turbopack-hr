import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/database/drizzle.module';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [DrizzleModule],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
