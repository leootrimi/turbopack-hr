"use client";

import React, { useMemo, useState } from "react";
import CalendarWithMeetings, { Meeting } from "./calendar-with-meetings";
import { useMeetings } from "../../hooks/queries";
import { mapMeetingApiToCalendarGridMeeting } from "../../lib/map-meeting";

export default function ParticipantsCalendarPage() {
  const { data: meetingRows, isLoading } = useMeetings();
  const meetings = useMemo(
    () => (meetingRows ?? []).map(mapMeetingApiToCalendarGridMeeting),
    [meetingRows],
  );

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    console.log("Meeting clicked:", meeting);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log("Date clicked:", date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto text-sm text-slate-500">
          Loading meetings…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Meeting Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all your meetings across the month
          </p>
        </div>

        <CalendarWithMeetings
          meetings={meetings}
          onMeetingClick={handleMeetingClick}
          onDateClick={handleDateClick}
        />

        {selectedMeeting && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Selected Meeting
            </h3>
            <p className="text-sm text-slate-600">{selectedMeeting.title}</p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedMeeting.date} at {selectedMeeting.time}
            </p>
          </div>
        )}

        {selectedDate && (
          <div className="mt-4 text-xs text-slate-500">
            Selected date: {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
