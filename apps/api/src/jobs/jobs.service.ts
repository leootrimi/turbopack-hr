import { Injectable } from '@nestjs/common';
import { desc } from 'drizzle-orm';
import { DrizzleService } from '../database/drizzle.provider';
import { jobs } from '../database/schema';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll() {
    return this.drizzle.db.select().from(jobs).orderBy(desc(jobs.postedAt));
  }

  async create(dto: CreateJobDto) {
    const [createdJob] = await this.drizzle.db
      .insert(jobs)
      .values({
        title: dto.title,
        department: dto.department,
        location: dto.location,
        locationType: dto.locationType,
        type: dto.type,
        salary: dto.salary ?? '',
        status: dto.status,
        description: dto.description,
        responsibilities: dto.responsibilities ?? [],
        requirements: dto.requirements ?? [],
        niceToHave: dto.niceToHave ?? [],
        closedAt: dto.status === 'Closed' ? new Date() : null,
      })
      .returning();

    return createdJob;
  }
}
