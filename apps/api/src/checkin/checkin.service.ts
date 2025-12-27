import { Injectable } from '@nestjs/common';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { DrizzleService } from 'src/database/drizzle.provider';
import { checkinLogs } from 'src/database/schema';

@Injectable()
export class CheckinService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createCheckinDto: CreateCheckinDto) {
    return await this.drizzle.db.insert(checkinLogs).values(createCheckinDto).returning();
  }

  findAll() {
    return `This action returns all checkin`;
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
