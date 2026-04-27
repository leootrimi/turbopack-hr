import { Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../database/drizzle.provider';
import { jobApplications, applicationTimelines, jobs } from '../database/schema';

@Injectable()
export class ApplicationsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll() {
    const apps = await this.drizzle.db
      .select({
        app: jobApplications,
        jobTitle: jobs.title,
        jobDepartment: jobs.department,
      })
      .from(jobApplications)
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .orderBy(desc(jobApplications.createdAt));

    const timelines = await this.drizzle.db
      .select()
      .from(applicationTimelines)
      .orderBy(desc(applicationTimelines.date));

    // Grouping
    return apps.map(({ app, jobTitle, jobDepartment }) => {
      const timelineInfo = timelines
        .filter((t) => t.applicationId === app.id)
        .map((t) => ({
          action: t.action,
          date: t.date.toISOString().split('T')[0],
        }));

      return {
        id: app.id.toString(),
        name: app.name,
        position: jobTitle || 'Unknown Position',
        department: jobDepartment || 'Unknown Department',
        stage: app.stage,
        appliedDate: app.appliedDate.toISOString().split('T')[0],
        email: app.email,
        phone: app.phone || '',
        location: app.location || '',
        cvUrl: app.cvUrl || '',
        notes: app.notes || '',
        timeline:
          timelineInfo.length > 0
            ? timelineInfo.reverse()
            : [
                {
                  action: 'Application submitted',
                  date: app.appliedDate.toISOString().split('T')[0],
                },
              ],
      };
    });
  }

  async create(data: {
    jobId: number;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    notes?: string;
    cvUrl?: string;
  }) {
    const [app] = await this.drizzle.db
      .insert(jobApplications)
      .values({
        jobId: data.jobId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        notes: data.notes,
        cvUrl: data.cvUrl,
        stage: 'Applied',
      })
      .returning();

    await this.drizzle.db.insert(applicationTimelines).values({
      applicationId: app.id,
      action: 'Application submitted',
      date: new Date(),
    });

    // Increment applicants count
    await this.drizzle.db
      .update(jobs)
      .set({ applicants: sql`${jobs.applicants} + 1` })
      .where(eq(jobs.id, data.jobId));

    return app;
  }

  async updateStage(
    id: number,
    stage:
      | 'Applied'
      | 'Screening'
      | 'Interview'
      | 'Offer'
      | 'Hired'
      | 'Rejected',
  ) {
    const [updated] = await this.drizzle.db
      .update(jobApplications)
      .set({ stage })
      .where(eq(jobApplications.id, id))
      .returning();

    if (!updated) throw new NotFoundException('Application not found');

    await this.drizzle.db.insert(applicationTimelines).values({
      applicationId: id,
      action: `Moved to ${stage}`,
      date: new Date(),
    });

    return updated;
  }

  async rejectApplication(id: number) {
    const [updated] = await this.drizzle.db
      .update(jobApplications)
      .set({ stage: 'Rejected' })
      .where(eq(jobApplications.id, id))
      .returning();

    if (!updated) throw new NotFoundException('Application not found');

    await this.drizzle.db.insert(applicationTimelines).values({
      applicationId: id,
      action: 'Application rejected',
      date: new Date(),
    });

    return updated;
  }
}
