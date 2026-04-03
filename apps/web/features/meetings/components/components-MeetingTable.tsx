'use client';

import React from 'react';
import { Eye, Edit2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import ParticipantAvatars from './components-ParticipantAvatars';
import StatusBadge from './components-StatusBadge';
import { formatDate } from '@/lib/utils';
import { Meeting } from '@repo/types';

interface MeetingTableProps {
  meetings: Meeting[];
  isLoading?: boolean;
  isDeleting?: boolean;
  onView: (meeting: Meeting) => void;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: number) => void;
}

const MeetingTable = ({
  meetings,
  isLoading,
  isDeleting,
  onView,
  onEdit,
  onDelete,
}: MeetingTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
        <p className="text-sm text-slate-500">Loading meetings…</p>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-12 text-center text-sm text-slate-500">
        No meetings yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-blue-50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Meeting
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Participants
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {meetings.map((meeting) => (
              <tr
                key={String(meeting.id)}
                className="hover:bg-slate-50/50 transition-colors duration-150 group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {meeting.title}
                      </p>
                      {meeting.hasConflict && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <AlertCircle size={14} className="text-amber-500" />
                          <p className="text-xs text-amber-600">
                            Scheduling conflict detected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    {formatDate(meeting.date)}
                  </p>
                  <p className="text-xs text-slate-500">{meeting.time}</p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={meeting.status} />
                </td>
                <td className="px-6 py-4">
                  <ParticipantAvatars participants={meeting.participants} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => onView(meeting)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(meeting)}
                      className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="Edit meeting"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(Number(meeting.id))}
                      disabled={isDeleting}
                      className="p-2 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors disabled:opacity-50"
                      title="Delete meeting"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingTable;
