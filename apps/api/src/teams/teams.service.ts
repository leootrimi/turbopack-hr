import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { DrizzleService } from 'src/database/drizzle.provider';
import { teams } from 'src/database/schema';

@Injectable()
export class TeamsService {
  constructor(private readonly drizzle: DrizzleService) {}
  create(createTeamDto: CreateTeamDto) {
    return 'This action adds a new team';
  }

  async findAll() {
    return await this.drizzle.db.select().from(teams);
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
