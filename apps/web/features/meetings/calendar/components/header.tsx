// components/participants-calendar/Header.tsx
import React from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  meetingType: 'personal' | 'team';
  onMeetingTypeChange: (type: 'personal' | 'team') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  meetingType,
  onMeetingTypeChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Participants & Calendar</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage meetings, track attendance, and stay notified
        </p>
      </div>
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
          <button
            onClick={() => onMeetingTypeChange('personal')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              meetingType === 'personal'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Personal Meetings
          </button>
          <button
            onClick={() => onMeetingTypeChange('team')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
              meetingType === 'team'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Team Meetings
          </button>
        </div>
      </div>
    </div>
  );
};