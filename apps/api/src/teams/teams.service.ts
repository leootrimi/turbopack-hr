import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { DrizzleService } from 'src/database/drizzle.provider';
import { employee, teams } from 'src/database/schema';
import { eq } from 'drizzle-orm';

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
