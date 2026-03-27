// app/calendar/page.tsx
'use client';

import React, { useState } from 'react';
import CalendarWithMeetings, { Meeting } from './calendar-with-meetings';

// Mock meetings data
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q1 Planning Session',
    description: 'Review Q1 goals, objectives, and key results. Discuss team capacity and resource allocation.',
    date: '2026-03-25',
    time: '10:00 AM',
    endTime: '11:30 AM',
    duration: 90,
    status: 'upcoming',
    participants: [
      { id: 'p1', name: 'Sarah Chen', initial: 'SC', email: 'sarah@example.com', status: 'confirmed' },
      { id: 'p2', name: 'Michael Rodriguez', initial: 'MR', email: 'michael@example.com', status: 'pending' },
      { id: 'p3', name: 'Emma Watson', initial: 'EW', email: 'emma@example.com', status: 'confirmed' },
      { id: 'p4', name: 'James Wilson', initial: 'JW', email: 'james@example.com', status: 'confirmed' },
    ],
    location: 'Conference Room A',
    isPriority: true,
  },
  {
    id: '2',
    title: 'Weekly Design Review',
    description: 'Review latest designs for the dashboard project. Get feedback from stakeholders.',
    date: '2026-03-26',
    time: '2:30 PM',
    endTime: '3:30 PM',
    duration: 60,
    status: 'upcoming',
    participants: [
      { id: 'p5', name: 'Olivia Parker', initial: 'OP', email: 'olivia@example.com', status: 'confirmed' },
      { id: 'p6', name: 'Liam Nguyen', initial: 'LN', email: 'liam@example.com', status: 'pending' },
      { id: 'p7', name: 'Sophia Martinez', initial: 'SM', email: 'sophia@example.com', status: 'confirmed' },
    ],
    meetingLink: { url: 'https://meet.google.com/abc-defg-hij', provider: 'google-meet' },
  },
  {
    id: '3',
    title: 'HR Sync: Performance Reviews',
    description: 'Discuss performance review process, timelines, and calibration sessions.',
    date: '2026-03-27',
    time: '11:00 AM',
    endTime: '12:00 PM',
    duration: 60,
    status: 'upcoming',
    participants: [
      { id: 'p8', name: 'David Kim', initial: 'DK', email: 'david@example.com', status: 'confirmed' },
      { id: 'p9', name: 'Aisha Patel', initial: 'AP', email: 'aisha@example.com', status: 'confirmed' },
    ],
    location: 'Virtual - Zoom',
    meetingLink: { url: 'https://zoom.us/j/123456789', provider: 'zoom' },
  },
  {
    id: '4',
    title: 'Product Roadmap Review',
    description: 'Review and align on product roadmap for next quarter. Prioritize features and timeline.',
    date: '2026-03-20',
    time: '3:00 PM',
    endTime: '4:30 PM',
    duration: 90,
    status: 'completed',
    participants: [
      { id: 'p10', name: 'Alex Turner', initial: 'AT', email: 'alex@example.com', status: 'confirmed' },
      { id: 'p11', name: 'Nina Kapoor', initial: 'NK', email: 'nina@example.com', status: 'confirmed' },
    ],
    meetingLink: { url: 'https://teams.microsoft.com/l/meetup-join/123', provider: 'teams' },
  },
  {
    id: '5',
    title: 'Technical Architecture Review',
    date: '2026-03-28',
    time: '1:00 PM',
    endTime: '2:00 PM',
    duration: 60,
    status: 'upcoming',
    participants: [
      { id: 'p12', name: 'Chris Evans', initial: 'CE', email: 'chris@example.com', status: 'confirmed' },
      { id: 'p13', name: 'Natasha Romanoff', initial: 'NR', email: 'natasha@example.com', status: 'pending' },
    ],
    location: 'Conference Room B',
  },
  {
    id: '6',
    title: 'Daily Standup',
    date: '2026-03-28',
    time: '9:30 AM',
    endTime: '9:45 AM',
    duration: 15,
    status: 'upcoming',
    participants: [
      { id: 'p14', name: 'Team Alpha', initial: 'TA', email: 'team@example.com', status: 'confirmed' },
    ],
    meetingLink: { url: 'https://meet.google.com/xyz-abcd-efg', provider: 'google-meet' },
  },
  {
    id: '61',
    title: 'Daily Standup',
    date: '2026-03-28',
    time: '9:30 AM',
    endTime: '9:45 AM',
    duration: 15,
    status: 'upcoming',
    participants: [
      { id: 'p14', name: 'Team Alpha', initial: 'TA', email: 'team@example.com', status: 'confirmed' },
    ],
    meetingLink: { url: 'https://meet.google.com/xyz-abcd-efg', provider: 'google-meet' },
  },
  {
    id: '613',
    title: 'Daily Standup',
    date: '2026-03-28',
    time: '9:30 AM',
    endTime: '9:45 AM',
    duration: 15,
    status: 'upcoming',
    participants: [
      { id: 'p14', name: 'Team Alpha', initial: 'TA', email: 'team@example.com', status: 'confirmed' },
    ],
    meetingLink: { url: 'https://meet.google.com/xyz-abcd-efg', provider: 'google-meet' },
  },
  {
    id: '612',
    title: 'Daily Standup',
    date: '2026-03-28',
    time: '9:30 AM',
    endTime: '9:45 AM',
    duration: 15,
    status: 'upcoming',
    participants: [
      { id: 'p14', name: 'Team Alpha', initial: 'TA', email: 'team@example.com', status: 'confirmed' },
    ],
    meetingLink: { url: 'https://meet.google.com/xyz-abcd-efg', provider: 'google-meet' },
  },
  {
    id: '7',
    title: 'Client Presentation',
    date: '2026-03-29',
    time: '10:00 AM',
    endTime: '11:00 AM',
    duration: 60,
    status: 'upcoming',
    participants: [
      { id: 'p15', name: 'John Smith', initial: 'JS', email: 'john@example.com', status: 'confirmed' },
      { id: 'p16', name: 'Jane Doe', initial: 'JD', email: 'jane@example.com', status: 'confirmed' },
    ],
    location: 'Client Site',
  },
];

export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    // You can open a modal or navigate to meeting details
    console.log('Meeting clicked:', meeting);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('Date clicked:', date);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Meeting Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all your meetings across the month
          </p>
        </div>

        {/* Calendar Component */}
        <CalendarWithMeetings
          meetings={mockMeetings}
          onMeetingClick={handleMeetingClick}
          onDateClick={handleDateClick}
        />

        {/* Optional: Selected Meeting Details */}
        {selectedMeeting && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Selected Meeting</h3>
            <p className="text-sm text-slate-600">{selectedMeeting.title}</p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedMeeting.date} at {selectedMeeting.time}
            </p>
          </div>
        )}

        {/* Optional: Selected Date Info */}
        {selectedDate && (
          <div className="mt-4 text-xs text-slate-500">
            Selected date: {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}