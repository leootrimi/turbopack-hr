import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.provider';
import { announcements, employee } from 'src/database/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class AnnouncementService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll() {
    const list = await this.drizzle.db
      .select({
        id: announcements.id,
        title: announcements.title,
        body: announcements.body,
        tag: announcements.tag,
        pinned: announcements.pinned,
        authorId: announcements.authorId,
        createdAt: announcements.createdAt,
        firstName: employee.firstName,
        lastName: employee.lastName,
      })
      .from(announcements)
      .leftJoin(employee, eq(announcements.authorId, employee.id))
      .orderBy(desc(announcements.createdAt));

    return list.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      body: item.body,
      tag: item.tag,
      pinned: item.pinned,
      author: `${item.firstName} ${item.lastName}`,
      authorInitials: `${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`,
      createdAt: item.createdAt,
    }));
  }

  async create(data: { title: string; body: string; tag: any; pinned: boolean; authorId: number }) {
    const result = await this.drizzle.db.insert(announcements).values(data).returning();
    return result[0];
  }
}
