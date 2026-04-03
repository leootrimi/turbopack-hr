import { Module } from '@nestjs/common';
import { TimeOffService } from './time-off.service';
import { TimeOffController } from './time-off.controller';
import { TimeOffDashboardController } from './time-off-dashboard.controller';
import { TimeOffTypesController } from './time-off-types.controller';
import { TimeOffTypesService } from './time-off-types.service';
import { DrizzleModule } from 'src/database/drizzle.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DrizzleModule, EmailModule],
  controllers: [
    TimeOffController,
    TimeOffDashboardController,
    TimeOffTypesController,
  ],
  providers: [TimeOffService, TimeOffTypesService],
  exports: [TimeOffService, TimeOffTypesService],
})
export class TimeOffModule {}
