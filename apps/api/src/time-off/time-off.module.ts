import { Module } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { TimeOffController } from './time-off.controller';
import { TimeOffDashboardController } from './time-off-dashboard.controller';
import { DrizzleModule } from 'src/database/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [TimeOffController, TimeOffDashboardController],
  providers: [TimeOffService],
  exports: [TimeOffService],
})
export class TimeOffModule {}

