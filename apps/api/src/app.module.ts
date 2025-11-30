import { Module } from '@nestjs/common';
import { TeamsModule } from './teams/teams.module';
import { EmployeeModule } from './employee/employee.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { CheckinModule } from './checkin/checkin.module';

@Module({
  imports: [CheckinModule ,EmployeeModule, EquipmentsModule, TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
