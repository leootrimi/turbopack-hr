// components/participants-calendar/AttendanceTracking.tsx
import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface Participant {
  id: string;
  name: string;
  status?: 'confirmed' | 'pending' | 'declined';
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'canceled';
  participants: Participant[];
}

interface AttendanceStats {
  total: number;
  attended: number;
  absent: number;
  percentage: number;
}

interface AttendanceTrackingProps {
  meeting: Meeting;
  stats: AttendanceStats;
}

export const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({ meeting, stats }) => {
  const attendedParticipants = meeting.participants.filter((p) => p.status === 'confirmed');
  const absentParticipants = meeting.participants.filter((p) => p.status === 'declined');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-800">{meeting.title}</h4>
        <StatusBadge status={meeting.status} size="sm" />
      </div>
      <div className="flex items-center gap-3 mb-3 text-xs">
        <span className="flex items-center gap-1 text-slate-500">
          <Calendar size={12} /> {meeting.date}
        </span>
        <span className="flex items-center gap-1 text-slate-500">
          <Clock size={12} /> {meeting.time}
        </span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-600">Attendance</span>
          <span className="text-slate-600">
            {stats.attended}/{stats.total} · {stats.percentage}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-emerald-600" />
            <span className="text-slate-600">Attended</span>
          </div>
          <span className="text-slate-700 font-medium">{attendedParticipants.length}</span>
        </div>
        {attendedParticipants.slice(0, 2).map((p) => (
          <div key={p.id} className="flex items-center gap-2 pl-5 text-xs text-slate-500">
            <span>•</span> {p.name}
          </div>
        ))}
        {attendedParticipants.length > 2 && (
          <div className="pl-5 text-xs text-slate-400">
            +{attendedParticipants.length - 2} more
          </div>
        )}
        <div className="flex items-center justify-between text-xs mt-1">
          <div className="flex items-center gap-2">
            <XCircle size={12} className="text-rose-500" />
            <span className="text-slate-600">Absent</span>
          </div>
          <span className="text-slate-700 font-medium">{absentParticipants.length}</span>
        </div>
      </div>
    </div>
  );
};