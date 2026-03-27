// app/participants-calendar/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, CheckCircle, CalendarDays, Plus } from 'lucide-react';
import { AttendanceTracking } from './components/attendance-tracking';
import { FilterBar } from './components/filter-bar';
import { Header } from './components/header';
import { NotificationsPanel } from './components/notification-panel';
import { ParticipantCard } from './components/participant-card';
import { QuickStats } from './components/quick-stats';
import { SimpleCalendar } from './components/simple-calendar';

// Types and Mock Data (same as before)
type MeetingStatus = 'upcoming' | 'completed' | 'canceled';

interface Participant {
  id: string;
  name: string;
  initial: string;
  email?: string;
  status?: 'confirmed' | 'pending' | 'declined';
  isOptional?: boolean;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  status: MeetingStatus;
  participants: Participant[];
  recurrence?: { isRecurring: boolean };
  location?: string;
}

interface Notification {
  id: string;
  meetingId: string;
  type: 'upcoming' | 'reminder' | 'rescheduled' | 'canceled';
  minutesBefore?: number;
  message: string;
  sent: boolean;
  createdAt: string;
}

// Mock Data
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q1 Planning Session',
    date: '2024-03-25',
    time: '10:00 AM',
    status: 'upcoming',
    participants: [
      { id: 'p1', name: 'Sarah Chen', initial: 'SC', email: 'sarah@example.com', status: 'confirmed' },
      { id: 'p2', name: 'Michael Rodriguez', initial: 'MR', email: 'michael@example.com', status: 'pending' },
      { id: 'p3', name: 'Emma Watson', initial: 'EW', email: 'emma@example.com', status: 'declined' },
      { id: 'p4', name: 'James Wilson', initial: 'JW', email: 'james@example.com', status: 'confirmed' },
    ],
    recurrence: { isRecurring: false },
  },
  {
    id: '2',
    title: 'Weekly Design Review',
    date: '2024-03-26',
    time: '2:30 PM',
    status: 'upcoming',
    participants: [
      { id: 'p5', name: 'Olivia Parker', initial: 'OP', email: 'olivia@example.com', status: 'confirmed' },
      { id: 'p6', name: 'Liam Nguyen', initial: 'LN', email: 'liam@example.com', status: 'pending' },
      { id: 'p7', name: 'Sophia Martinez', initial: 'SM', email: 'sophia@example.com', status: 'confirmed' },
    ],
    recurrence: { isRecurring: true },
  },
  {
    id: '3',
    title: 'HR Sync: Performance Reviews',
    date: '2024-03-27',
    time: '11:00 AM',
    status: 'upcoming',
    participants: [
      { id: 'p8', name: 'David Kim', initial: 'DK', email: 'david@example.com', status: 'confirmed' },
      { id: 'p9', name: 'Aisha Patel', initial: 'AP', email: 'aisha@example.com', status: 'confirmed' },
    ],
    recurrence: { isRecurring: false },
  },
  {
    id: '4',
    title: 'Product Roadmap Review',
    date: '2024-03-20',
    time: '3:00 PM',
    status: 'completed',
    participants: [
      { id: 'p10', name: 'Alex Turner', initial: 'AT', email: 'alex@example.com', status: 'confirmed' },
      { id: 'p11', name: 'Nina Kapoor', initial: 'NK', email: 'nina@example.com', status: 'confirmed' },
    ],
    recurrence: { isRecurring: false },
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    meetingId: '1',
    type: 'upcoming',
    minutesBefore: 30,
    message: 'Meeting "Q1 Planning Session" starts in 30 minutes',
    sent: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'n2',
    meetingId: '2',
    type: 'reminder',
    minutesBefore: 60,
    message: 'Reminder: Weekly Design Review tomorrow at 2:30 PM',
    sent: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'n3',
    meetingId: '1',
    type: 'rescheduled',
    message: 'Q1 Planning Session rescheduled to 10:00 AM',
    sent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'n4',
    meetingId: '3',
    type: 'canceled',
    message: 'HR Sync meeting canceled due to conflict',
    sent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

// Mock attendance data
const attendanceData = {
  '1': { total: 4, attended: 2, absent: 2, percentage: 50 },
  '2': { total: 3, attended: 2, absent: 1, percentage: 67 },
  '3': { total: 2, attended: 1, absent: 1, percentage: 50 },
  '4': { total: 2, attended: 2, absent: 0, percentage: 100 },
};

// Get meeting dates for calendar
const meetingDates = mockMeetings.map(m => m.date);

export default function ParticipantsCalendarPage() {
  const [meetingType, setMeetingType] = useState<'personal' | 'team'>('personal');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const filteredMeetings = mockMeetings.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    // Add team filter logic based on your requirements
    const matchesTeam = teamFilter === 'all' || teamFilter === 'all teams';
    return matchesSearch && matchesStatus && matchesTeam;
  });

  const handleRSVPChange = (meetingId: string, participantId: string, status: string) => {
    console.log('RSVP changed:', { meetingId, participantId, status });
    // In real app, update the data
  };

  const handleInviteClick = (meetingId: string) => {
    console.log('Invite clicked for meeting:', meetingId);
    // In real app, open invite modal
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // In real app, filter meetings by date or open modal
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          meetingType={meetingType}
          onMeetingTypeChange={setMeetingType}
        />

        {/* Filter Bar */}
        <FilterBar
          onStatusFilterChange={setStatusFilter}
          onTeamFilterChange={setTeamFilter}
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Participants & Invitations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Users size={16} className="text-indigo-500" />
                Participants & Invitations
              </h2>
              <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                <Plus size={12} /> New Meeting
              </button>
            </div>
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

            {/* Attendance Tracking Section */}
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                Attendance Tracking
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {filteredMeetings.map((meeting) => (
                  <AttendanceTracking
                    key={meeting.id}
                    meeting={meeting}
                    stats={attendanceData[meeting.id as keyof typeof attendanceData] || {
                      total: 0,
                      attended: 0,
                      absent: 0,
                      percentage: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Notifications & Calendar */}
          <div className="space-y-6">
            {/* Notifications Panel */}
            <NotificationsPanel
              notifications={mockNotifications}
              remindersEnabled={remindersEnabled}
              onRemindersToggle={() => setRemindersEnabled(!remindersEnabled)}
            />

            {/* Calendar Section */}
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CalendarDays size={16} className="text-indigo-500" />
                Calendar
              </h2>
              <SimpleCalendar meetingDates={meetingDates} onDateClick={handleDateClick} />
            </div>

            {/* Quick Stats */}
            <QuickStats
              totalMeetings={12}
              thisWeek={4}
              avgAttendees={6}
              completionRate={85}
            />
          </div>
        </div>
      </div>
    </div>
  );
}