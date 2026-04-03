import { Meeting, MeetingStatus, Participant } from "@repo/types";
import type { MeetingApi } from "../api";
import type { Meeting as CalendarGridMeeting } from "../calendar/components/calendar-with-meetings";

function initials(first: string, last: string): string {
  const a = first?.trim()?.[0] ?? "";
  const b = last?.trim()?.[0] ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}

export function combineDateAndTimeToIso(dateStr: string, timeStr: string): string {
  const datePart = dateStr.slice(0, 10);
  const trimmed = timeStr.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    const fallback = new Date(`${datePart}T09:00:00`);
    return fallback.toISOString();
  }
  let h = parseInt(match[1] ?? "", 10);
  const m = parseInt(match[2] ?? "", 10);
  const ap = match[3] ?? "".toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  const d = new Date(
    `${datePart}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
  );
  return d.toISOString();
}

export function mapMeetingApiToMeeting(m: MeetingApi): Meeting {
  const start = new Date(m.startsAt);
  const endMs = start.getTime() + m.durationMinutes * 60 * 1000;

  let status: MeetingStatus = "upcoming";
  if (m.status === "canceled") status = "canceled";
  else if (endMs < Date.now()) status = "completed";
  else status = "upcoming";

  const timeStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;

  const participants: Participant[] = m.participants.map((p) => ({
    id: String(p.employeeId),
    name: `${p.firstName} ${p.lastName}`.trim(),
    initial: initials(p.firstName, p.lastName),
    email: p.email,
  }));

  const organizer = m.organizer
    ? {
        id: String(m.organizer.id),
        name: `${m.organizer.firstName} ${m.organizer.lastName}`.trim(),
        initial: initials(m.organizer.firstName, m.organizer.lastName),
        email: m.organizer.email,
      }
    : undefined;

  return {
    id: m.id,
    title: m.title,
    description: m.description ?? undefined,
    date: dateStr,
    time: timeStr,
    duration: m.durationMinutes,
    timezone: m.timezone,
    status,
    participants,
    organizer,
    hasConflict: false,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

/** Shape expected by `CalendarWithMeetings` (month grid). */
export function mapMeetingApiToCalendarGridMeeting(api: MeetingApi): CalendarGridMeeting {
  const base = mapMeetingApiToMeeting(api);
  const start = new Date(api.startsAt);
  const end = new Date(start.getTime() + api.durationMinutes * 60 * 1000);
  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return {
    id: String(api.id),
    title: base.title,
    description: base.description,
    date: base.date,
    time: base.time,
    endTime,
    duration: base.duration,
    status: base.status,
    participants: base.participants.map((p) => ({
      id: String(p.id),
      name: p.name,
      initial: p.initial,
      email: p.email,
      status: "confirmed" as const,
    })),
    isPriority: false,
  };
}

/** Rich stats / participants calendar (`calendar-page-stats`). */
export type StatsCalendarMeeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "canceled";
  participants: {
    id: string;
    name: string;
    initial: string;
    email?: string;
    status?: "confirmed" | "pending" | "declined";
  }[];
  recurrence?: { isRecurring: boolean };
  location?: string;
};

export function mapMeetingApiToStatsCalendarMeeting(api: MeetingApi): StatsCalendarMeeting {
  const base = mapMeetingApiToMeeting(api);
  return {
    id: String(api.id),
    title: base.title,
    date: base.date,
    time: base.time,
    status: base.status,
    participants: base.participants.map((p) => ({
      id: String(p.id),
      name: p.name,
      initial: p.initial,
      email: p.email,
      status: "confirmed" as const,
    })),
    recurrence: { isRecurring: false },
  };
}
