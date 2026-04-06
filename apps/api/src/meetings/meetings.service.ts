import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.provider';
import {
  employee,
  meetingParticipants,
  meetings,
  users,
} from '../database/schema';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { desc, eq, inArray } from 'drizzle-orm';

@Injectable()
export class MeetingsService {
  constructor(private readonly drizzle: DrizzleService) {}

  private async getEmployeeIdForUser(userId: number): Promise<number> {
    const rows = await this.drizzle.db
      .select({ employeeId: users.employeeId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const row = rows[0];
    if (!row) throw new NotFoundException('User not found');
    return row.employeeId;
  }

  async create(userId: number, dto: CreateMeetingDto) {
    const organizerId = await this.getEmployeeIdForUser(userId);
    const startsAt = new Date(dto.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException('Invalid startsAt');
    }
    const duration = Math.max(1, Math.floor(Number(dto.durationMinutes) || 30));

    const participantIds = new Set<number>([
      organizerId,
      ...(dto.participantEmployeeIds ?? []).map((id) => Number(id)),
    ]);

    return this.drizzle.db.transaction(async (tx) => {
      const [meeting] = await tx
        .insert(meetings)
        .values({
          title: dto.title,
          description: dto.description ?? null,
          organizerId,
          startsAt,
          durationMinutes: duration,
          timezone: dto.timezone ?? 'UTC',
          status: 'scheduled',
        })
        .returning();

      if (!meeting) throw new NotFoundException('Failed to create meeting');

      for (const empId of participantIds) {
        await tx.insert(meetingParticipants).values({
          meetingId: meeting.id,
          employeeId: empId,
        });
      }

      return this.findOneWithParticipants(meeting.id);
    });
  }

  async findAllForUser(userId: number) {
    const employeeId = await this.getEmployeeIdForUser(userId);

    const asParticipant = await this.drizzle.db
      .select({ meetingId: meetingParticipants.meetingId })
      .from(meetingParticipants)
      .where(eq(meetingParticipants.employeeId, employeeId));

    const asOrganizer = await this.drizzle.db
      .select({ id: meetings.id })
      .from(meetings)
      .where(eq(meetings.organizerId, employeeId));

    const idSet = new Set<number>();
    asParticipant.forEach((r) => idSet.add(r.meetingId));
    asOrganizer.forEach((r) => idSet.add(r.id));

    const allIds = [...idSet];
    if (allIds.length === 0) return [];

    const meetingRows = await this.drizzle.db
      .select()
      .from(meetings)
      .where(inArray(meetings.id, allIds))
      .orderBy(desc(meetings.startsAt));

    if (meetingRows.length === 0) return [];

    const allParticipants = await this.drizzle.db
      .select({
        meetingId: meetingParticipants.meetingId,
        employeeId: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
      })
      .from(meetingParticipants)
      .innerJoin(employee, eq(meetingParticipants.employeeId, employee.id))
      .where(inArray(meetingParticipants.meetingId, allIds));

    const participantsByMeeting = new Map<
      number,
      {
        employeeId: number;
        firstName: string;
        lastName: string;
        email: string;
      }[]
    >();
    for (const p of allParticipants) {
      const list = participantsByMeeting.get(p.meetingId) ?? [];
      list.push({
        employeeId: p.employeeId,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
      });
      participantsByMeeting.set(p.meetingId, list);
    }

    const organizerIds = [...new Set(meetingRows.map((m) => m.organizerId))];
    const organizerRows = await this.drizzle.db
      .select({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
      })
      .from(employee)
      .where(inArray(employee.id, organizerIds));

    const organizerById = new Map(organizerRows.map((o) => [o.id, o]));

    return meetingRows.map((m) => ({
      ...m,
      organizer: organizerById.get(m.organizerId) ?? null,
      participants: participantsByMeeting.get(m.id) ?? [],
    }));
  }

  async findOneWithParticipants(meetingId: number) {
    const [meeting] = await this.drizzle.db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId))
      .limit(1);

    if (!meeting) return null;

    const parts = await this.drizzle.db
      .select({
        employeeId: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
      })
      .from(meetingParticipants)
      .innerJoin(employee, eq(meetingParticipants.employeeId, employee.id))
      .where(eq(meetingParticipants.meetingId, meetingId));

    const [organizer] = await this.drizzle.db
      .select({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
      })
      .from(employee)
      .where(eq(employee.id, meeting.organizerId))
      .limit(1);

    return {
      ...meeting,
      organizer,
      participants: parts,
    };
  }

  async remove(userId: number, meetingId: number) {
    const employeeId = await this.getEmployeeIdForUser(userId);
    const [row] = await this.drizzle.db
      .select()
      .from(meetings)
      .where(eq(meetings.id, meetingId))
      .limit(1);

    if (!row) throw new NotFoundException('Meeting not found');
    if (row.organizerId !== employeeId) {
      throw new ForbiddenException('Only the organizer can delete this meeting');
    }

    await this.drizzle.db
      .delete(meetings)
      .where(eq(meetings.id, meetingId));

    return { success: true };
  }
}
