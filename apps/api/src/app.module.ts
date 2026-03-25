import { Module } from '@nestjs/common';
import { TeamsModule } from './teams/teams.module';
import { EmployeeModule } from './employee/employee.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { CheckinModule } from './checkin/checkin.module';
import { DrizzleModule } from './database/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [CheckinModule, EmployeeModule, EquipmentsModule, DrizzleModule, TeamsModule, AuthModule, AnnouncementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
