"use client";

import React, { useMemo, useState } from "react";
import { Users, CheckCircle, CalendarDays, Plus } from "lucide-react";
import { AttendanceTracking } from "./components/attendance-tracking";
import { FilterBar } from "./components/filter-bar";
import { Header } from "./components/header";
import { NotificationsPanel } from "./components/notification-panel";
import { ParticipantCard } from "./components/participant-card";
import { QuickStats } from "./components/quick-stats";
import { SimpleCalendar } from "./components/simple-calendar";
import { useMeetings } from "../hooks/queries";
import {
  mapMeetingApiToStatsCalendarMeeting,
  type StatsCalendarMeeting,
} from "../lib/map-meeting";

interface Notification {
  id: string;
  meetingId: string;
  type: "upcoming" | "reminder" | "rescheduled" | "canceled";
  minutesBefore?: number;
  message: string;
  sent: boolean;
  createdAt: string;
}

function startOfWeekSunday(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  x.setDate(x.getDate() - day);
  return x;
}

function endOfWeekSaturday(d: Date): Date {
  const s = startOfWeekSunday(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}

function computeQuickStats(meetings: StatsCalendarMeeting[]) {
  const now = new Date();
  const w0 = startOfWeekSunday(now);
  const w1 = endOfWeekSaturday(now);

  const thisWeek = meetings.filter((m) => {
    const mid = new Date(`${m.date}T12:00:00`);
    return mid >= w0 && mid <= w1;
  }).length;

  const totalMeetings = meetings.length;
  const avgAttendees =
    totalMeetings === 0
      ? 0
      : Math.round(
          meetings.reduce((s, m) => s + m.participants.length, 0) /
            totalMeetings,
        );
  const completed = meetings.filter((m) => m.status === "completed").length;
  const completionRate =
    totalMeetings === 0 ? 0 : Math.round((completed / totalMeetings) * 100);

  return { totalMeetings, thisWeek, avgAttendees, completionRate };
}

function attendancePlaceholder(m: StatsCalendarMeeting): {
  total: number;
  attended: number;
  absent: number;
  percentage: number;
} {
  const total = m.participants.length;
  if (total === 0) {
    return { total: 0, attended: 0, absent: 0, percentage: 0 };
  }
  if (m.status === "canceled") {
    return { total, attended: 0, absent: total, percentage: 0 };
  }
  const confirmed = m.participants.filter(
    (p) => p.status === "confirmed" || p.status === undefined,
  ).length;
  const declined = m.participants.filter((p) => p.status === "declined").length;
  if (m.status === "completed") {
    const attended = confirmed;
    const absent = declined + Math.max(0, total - confirmed - declined);
    const percentage = Math.round((attended / total) * 100);
    return { total, attended, absent, percentage };
  }
  return { total, attended: 0, absent: total, percentage: 0 };
}

export default function CalendarStatsPage() {
  const { data: meetingRows, isLoading } = useMeetings();

  const meetings = useMemo(
    () => (meetingRows ?? []).map(mapMeetingApiToStatsCalendarMeeting),
    [meetingRows],
  );

  const meetingDates = useMemo(
    () => meetings.map((m) => m.date),
    [meetings],
  );

  const quickStats = useMemo(() => computeQuickStats(meetings), [meetings]);

  const attendanceById = useMemo(() => {
    const o: Record<
      string,
      { total: number; attended: number; absent: number; percentage: number }
    > = {};
    for (const m of meetings) {
      o[m.id] = attendancePlaceholder(m);
    }
    return o;
  }, [meetings]);

  const notifications: Notification[] = [];

  const [meetingType, setMeetingType] = useState<"personal" | "team">("personal");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchesSearch = m.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || m.status === statusFilter;
      const matchesTeam = teamFilter === "all" || teamFilter === "all teams";
      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [meetings, searchQuery, statusFilter, teamFilter]);

  const handleRSVPChange = (
    meetingId: string,
    participantId: string,
    status: string,
  ) => {
    console.log("RSVP changed:", { meetingId, participantId, status });
  };

  const handleInviteClick = (meetingId: string) => {
    console.log("Invite clicked for meeting:", meetingId);
  };

  const handleDateClick = (date: Date) => {
    console.log("Date clicked:", date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6">
        <div className="max-w-7xl mx-auto text-sm text-slate-500">
          Loading meetings…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          meetingType={meetingType}
          onMeetingTypeChange={setMeetingType}
        />

        <FilterBar
          onStatusFilterChange={setStatusFilter}
          onTeamFilterChange={setTeamFilter}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-indigo-500" />
                Participants & Invitations
              </h2>
              <button
                type="button"
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus size={12} /> New Meeting
              </button>
            </div>
            {filteredMeetings.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">
                No meetings match your filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredMeetings.map((meeting) => (
                  <ParticipantCard
                    key={meeting.id}
                    meeting={meeting}
                    onInviteClick={handleInviteClick}
                    onRSVPChange={handleRSVPChange}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <NotificationsPanel
              notifications={notifications}
              remindersEnabled={remindersEnabled}
              onRemindersToggle={() => setRemindersEnabled(!remindersEnabled)}
            />

            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CalendarDays size={16} className="text-indigo-500" />
                Calendar
              </h2>
              <SimpleCalendar
                meetingDates={meetingDates}
                onDateClick={handleDateClick}
              />
            </div>

            <QuickStats
              totalMeetings={quickStats.totalMeetings}
              thisWeek={quickStats.thisWeek}
              avgAttendees={quickStats.avgAttendees}
              completionRate={quickStats.completionRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
