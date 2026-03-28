export class CreateMeetingDto {
  title: string;
  description?: string;
  /** ISO 8601 start instant */
  startsAt: string;
  durationMinutes: number;
  timezone?: string;
  /** Other attendees (organizer is always added automatically). */
  participantEmployeeIds?: number[];
}
