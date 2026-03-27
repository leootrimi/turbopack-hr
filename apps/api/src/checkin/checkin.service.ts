import { Injectable } from '@nestjs/common';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { DrizzleService } from 'src/database/drizzle.provider';
import { checkinLogs, employee, jobInfo, teams } from 'src/database/schema';
import { and, eq, gte, lte } from 'drizzle-orm';

@Injectable()
export class CheckinService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createCheckinDto: CreateCheckinDto) {
    return await this.drizzle.db
      .insert(checkinLogs)
      .values(createCheckinDto)
      .returning();
  }

  findAll() {
    return `This action returns all checkin`;
  }

  async findTodayDashboard(dateStr?: string, filterAbsent: boolean = false) {
    const startOfDay = dateStr ? new Date(dateStr) : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const employees = await this.drizzle.db
      .select({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        teamName: teams.name,
        checkinTime: checkinLogs.checkinTime,
        workLocation: jobInfo.workLocation,
      })
      .from(employee)
      .leftJoin(jobInfo, eq(employee.id, jobInfo.employeeId))
      .leftJoin(teams, eq(jobInfo.teamId, teams.id))
      .leftJoin(
        checkinLogs,
        and(
          eq(checkinLogs.employeeId, employee.id),
          gte(checkinLogs.checkinTime, startOfDay),
          lte(checkinLogs.checkinTime, endOfDay),
        ),
      );

    const result = employees.map((emp) => {
      let status = 'absent';
      let timeStr: string | null = null;

      if (emp.id % 5 === 0) {
        status = 'leave';
      } else if (emp.checkinTime) {
        const checkinDate = new Date(emp.checkinTime);
        timeStr = checkinDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const nineAM = new Date(checkinDate);
        nineAM.setHours(9, 0, 0, 0);

        if (checkinDate > nineAM) {
          status = 'late';
        } else {
          status = 'in';
        }
      }

      return {
        id: emp.id.toString(),
        name: `${emp.firstName} ${emp.lastName}`,
        initials: `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase(),
        team: emp.teamName || 'Unassigned',
        status,
        time: timeStr,
        location: emp.workLocation ? emp.workLocation.toLowerCase() : 'office',
      };
    });

    return filterAbsent
      ? result.filter((emp) => emp.status !== 'absent')
      : result;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkin`;
  }

  update(id: number, updateCheckinDto: UpdateCheckinDto) {
    return `This action updates a #${id} checkin`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkin`;
  }
}
