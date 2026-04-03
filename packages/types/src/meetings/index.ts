import { z } from "zod";

export const RecurrenceConfigSchema = z.object({
  isRecurring: z.boolean(),
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "yearly"]).optional(),
  daysOfWeek: z
    .array(
      z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
    )
    .optional(),
  endDate: z.string().optional(),
  occurrences: z.number().optional(),
});

export const ParticipantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  initial: z.string().min(1),
  email: z.string().email().optional(),
  status: z.enum(["confirmed", "pending", "declined"]).optional(),
  isOptional: z.boolean().optional(),
});

export const CreateMeetingFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.string().min(1),
  timezone: z.string().min(1),
  recurring: z.boolean(),
  recurrenceConfig: RecurrenceConfigSchema.optional(),
  participants: z.array(ParticipantSchema).optional(),
  participantEmployeeIds: z.array(z.number()).optional(),
  location: z.string().optional(),
});

export const MeetingSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
  duration: z.number().optional(),
  endTime: z.string().optional(),
  status: z.any(),
  participants: z.array(ParticipantSchema),
  organizer: ParticipantSchema.optional(),
  location: z.string().optional(),
  meetingLink: z.any().optional(),
  timezone: z.string().optional(),
  recurrence: RecurrenceConfigSchema.optional(),
  availability: z.any().optional(),
  hasConflict: z.boolean().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  isPriority: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  seriesId: z.string().optional(),
});

export const MeetingStatsSchema = z.object({
  totalMeetings: z.number(),
  upcomingMeetings: z.number(),
  completedMeetings: z.number(),
  canceledMeetings: z.number(),
  averageDuration: z.number().optional(),
  totalHours: z.number().optional(),
  peakHour: z.string().optional(),
});

export const MeetingStatusSchema = z.enum([
  "upcoming",
  "completed",
  "canceled",
]);

export type CreateMeetingForm = z.infer<typeof CreateMeetingFormSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type RecurrenceConfig = z.infer<typeof RecurrenceConfigSchema>;
export type Meeting = z.infer<typeof MeetingSchema>;
export type MeetingStats = z.infer<typeof MeetingStatsSchema>;
export type MeetingStatus = z.infer<typeof MeetingStatusSchema>;