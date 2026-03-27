// components/participants-calendar/QuickStats.tsx
import React from 'react';
import { Zap } from 'lucide-react';

interface QuickStatsProps {
  totalMeetings: number;
  thisWeek: number;
  avgAttendees: number;
  completionRate: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  totalMeetings,
  thisWeek,
  avgAttendees,
  completionRate,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-xl border border-indigo-100 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Zap size={16} className="text-indigo-600" />
        <span className="text-xs font-medium text-indigo-800">Quick Stats</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-slate-500">Total Meetings</p>
          <p className="text-lg font-semibold text-slate-800">{totalMeetings}</p>
        </div>
        <div>
          <p className="text-slate-500">This Week</p>
          <p className="text-lg font-semibold text-slate-800">{thisWeek}</p>
        </div>
        <div>
          <p className="text-slate-500">Avg. Attendees</p>
          <p className="text-lg font-semibold text-slate-800">{avgAttendees}</p>
        </div>
        <div>
          <p className="text-slate-500">Completion Rate</p>
          <p className="text-lg font-semibold text-slate-800">{completionRate}%</p>
        </div>
      </div>
    </div>
  );
};