import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { DrizzleService } from 'src/database/drizzle.provider';
import { employee, jobInfo, teams } from 'src/database/schema';
import { eq, sql } from 'drizzle-orm';
import { TeamCard } from '@repo/types';

@Injectable()
export class TeamsService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(createTeamDto: CreateTeamDto) {
    return 'This action adds a new team';
  }

  async findAllTeams() {
    const result = await this.drizzle.db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        leaderId: teams.leaderId,
        leaderFirstName: employee.firstName,
        leaderLastName: employee.lastName,
      })
      .from(teams)
      .leftJoin(employee, eq(employee.id, teams.leaderId));

    return result.map((row) => ({
      teamId: row.teamId,
      teamName: row.teamName,
      leaderId: row.leaderId,
      leaderName: row.leaderId
        ? `${row.leaderFirstName} ${row.leaderLastName}`
        : null,
    }));
  }

  async getTeamsOverview(): Promise<TeamCard[]> {
    const result = await this.drizzle.db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        createdAt: teams.createdAt,
        teamType: teams.team_type,

        leaderName: sql<string>`
          CONCAT(${employee.firstName}, ' ', ${employee.lastName})
        `,

        teamMemberCount: sql<number>`
          COUNT(${jobInfo.employeeId})
        `,
      })
      .from(teams)
      .leftJoin(employee, eq(employee.id, teams.leaderId))
      .leftJoin(jobInfo, eq(jobInfo.teamId, teams.id))
      .groupBy(
        teams.id,
        teams.name,
        teams.createdAt,
        teams.team_type,
        employee.firstName,
        employee.lastName,
      );
      console.log(result)
    return result;
  }

  async getTeamForEmployee(employeeId: number): Promise<TeamCard> {
    const result = await this.drizzle.db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        createdAt: teams.createdAt,
        teamType: teams.team_type,

        leaderName: sql<string>`
          CONCAT(${employee.firstName}, ' ', ${employee.lastName})
        `,

        teamMemberCount: sql<number>`
          COUNT(${jobInfo.employeeId})
        `,
      })
      .from(teams)
      .leftJoin(employee, eq(employee.id, teams.leaderId))
      .leftJoin(jobInfo, eq(jobInfo.teamId, teams.id))
      .groupBy(
        teams.id,
        teams.name,
        teams.createdAt,
        teams.team_type,
        employee.firstName,
        employee.lastName,
      )
        .where(eq(employee.id, employeeId))
  
      return result[0];
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
