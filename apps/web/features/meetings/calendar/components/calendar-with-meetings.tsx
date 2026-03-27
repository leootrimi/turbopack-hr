// components/CalendarWithMeetings.tsx
'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  MapPin,
  Video,
} from 'lucide-react';

// Types
interface Participant {
  id: string;
  name: string;
  initial: string;
  email?: string;
  status?: 'confirmed' | 'pending' | 'declined';
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  duration?: number;
  status: 'upcoming' | 'completed' | 'canceled';
  participants: Participant[];
  location?: string;
  meetingLink?: { url: string; provider?: string };
  isPriority?: boolean;
}

interface CalendarWithMeetingsProps {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
  onDateClick?: (date: Date) => void;
  currentDate?: Date;
}

const CalendarWithMeetings: React.FC<CalendarWithMeetingsProps> = ({
  meetings,
  onMeetingClick,
  onDateClick,
  currentDate: externalDate,
}) => {
  const [internalDate, setInternalDate] = useState(new Date());
  const [hoveredMeeting, setHoveredMeeting] = useState<Meeting | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const currentDate = externalDate || internalDate;

  const goToPreviousMonth = () => {
    setInternalDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setInternalDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setInternalDate(new Date());
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get meetings for a specific date
  const getMeetingsForDate = (date: Date): Meeting[] => {
    const dateString = date.toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.date === dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-emerald-500';
      case 'canceled':
        return 'bg-slate-400';
      default:
        return 'bg-indigo-500';
    }
  };

  const handleMouseEnter = (meeting: Meeting, event: React.MouseEvent) => {
    setHoveredMeeting(meeting);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredMeeting(null);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-slate-50">
        <div className="flex items-center gap-3">
          <button onClick={goToPreviousMonth} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <ChevronLeft size={18} />
          </button>

          <button onClick={goToToday} className="text-xs px-3 py-1.5 bg-slate-100 rounded-lg">
            Today
          </button>

          <button onClick={goToNextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <ChevronRight size={18} />
          </button>

          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 bg-slate-50 border-b">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold py-3">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">

        {daysInMonth.map((day, index) => {
          const isToday = day && day.toDateString() === today.toDateString();
          const dayMeetings = day ? getMeetingsForDate(day) : [];

          return (
            <div
              key={index}
              onClick={() => day && onDateClick?.(day)}
              className={`border-r border-b p-2 transition ${
                !day
                  ? 'bg-slate-50'
                  : 'bg-white hover:bg-slate-50 cursor-pointer'
              }`}
            >

              {/* Day number */}
              <div className="flex justify-between mb-2">
                <span
                  className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-indigo-500 text-white' : ''
                  }`}
                >
                  {day ? day.getDate() : ''}
                </span>

                {dayMeetings.length > 0 && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 rounded-full">
                    {dayMeetings.length}
                  </span>
                )}
              </div>

              {/* ALL Meetings (NO LIMIT) */}
              {day && (
                <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">

                  {dayMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMeetingClick?.(meeting);
                      }}
                      onMouseEnter={(e) => handleMouseEnter(meeting, e)}
                      onMouseLeave={handleMouseLeave}
                      className={`text-xs p-1.5 rounded-lg border-l-2 cursor-pointer transition ${
                        meeting.status === 'upcoming'
                          ? 'bg-indigo-50 border-indigo-400 hover:bg-indigo-100'
                          : meeting.status === 'completed'
                          ? 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100'
                          : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(meeting.status)}`} />
                        <span className="truncate">{meeting.title}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock size={10} />
                        {meeting.time}
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredMeeting && (
        <div
          className="fixed z-50 bg-white shadow-xl border rounded-xl p-3 w-72"
          style={{
            top: hoverPosition.y + 10,
            left: hoverPosition.x + 10,
          }}
        >
          <div className="text-sm font-semibold">
            {hoveredMeeting.title}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <Clock size={12} />
            {hoveredMeeting.time}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWithMeetings;