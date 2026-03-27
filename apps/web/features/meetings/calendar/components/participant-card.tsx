// components/participants-calendar/ParticipantCard.tsx
import React from 'react';
import { Calendar, Clock, UserPlus } from 'lucide-react';
import { ParticipantAvatar } from './particpant-avatar';
import { RSVPButtons } from './rsvp-button';

interface Participant {
  id: string;
  name: string;
  initial: string;
  email?: string;
  status?: 'confirmed' | 'pending' | 'declined';
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: Participant[];
  recurrence?: { isRecurring: boolean };
}

interface ParticipantCardProps {
  meeting: Meeting;
  onInviteClick?: (meetingId: string) => void;
  onRSVPChange?: (meetingId: string, participantId: string, status: string) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  meeting,
  onInviteClick,
  onRSVPChange,
}) => {
  const confirmed = meeting.participants.filter((p) => p.status === 'confirmed').length;
  const total = meeting.participants.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-slate-800">{meeting.title}</h4>
            {meeting.recurrence?.isRecurring && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                Recurring
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {meeting.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {meeting.time}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-1">
              {meeting.participants.slice(0, 4).map((p, idx) => (
                <ParticipantAvatar
                  key={p.id}
                  initial={p.initial}
                  name={p.name}
                  colorIndex={idx}
                  size="md"
                />
              ))}
              {meeting.participants.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-medium border border-white">
                  +{meeting.participants.length - 4}
                </div>
              )}
            </div>
            <button
              onClick={() => onInviteClick?.(meeting.id)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <UserPlus size={12} /> + Invite
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">RSVP Status</span>
          <span className="text-xs text-slate-500">
            {confirmed}/{total} confirmed
          </span>
        </div>
        <div className="space-y-2">
          {meeting.participants.map((p, idx) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ParticipantAvatar initial={p.initial} name={p.name} colorIndex={idx} size="sm" />
                <span className="text-xs text-slate-700">{p.name}</span>
              </div>
              <RSVPButtons
                participantId={p.id}
                currentStatus={p.status}
                onStatusChange={(id, status) => onRSVPChange?.(meeting.id, id, status)}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};