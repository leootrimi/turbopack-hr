'use client';

import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Users, AlertCircle } from 'lucide-react';
import ParticipantAvatars from './components-ParticipantAvatars';
import StatusBadge from './components-StatusBadge';
import { Meeting } from '../types';
import { formatDate } from '@/lib/utils';

interface MeetingTableProps {
  onView: (meeting: Meeting) => void;
  onEdit: (meeting: Meeting) => void;
  onDelete: (meetingId: number) => void;
}

const MeetingTable = ({ onView, onEdit, onDelete }: MeetingTableProps) => {
  const [meetings] = useState([
    {
      id: 1,
      title: 'Q1 Planning Session',
      date: '2024-04-15',
      time: '10:00 AM',
      status: 'upcoming',
      participants: [
        { name: 'Sarah Chen', initial: 'SC' },
        { name: 'Mike Johnson', initial: 'MJ' },
        { name: 'Emma Wilson', initial: 'EW' },
      ],
      hasConflict: false,
    },
    {
      id: 2,
      title: 'Team Sync - Engineering',
      date: '2024-04-16',
      time: '2:00 PM',
      status: 'upcoming',
      participants: [
        { name: 'Alex Kumar', initial: 'AK' },
        { name: 'Jessica Lee', initial: 'JL' },
      ],
      hasConflict: true,
    },
    {
      id: 3,
      title: 'Client Presentation - Acme Corp',
      date: '2024-04-10',
      time: '3:30 PM',
      status: 'completed',
      participants: [
        { name: 'Robert Brown', initial: 'RB' },
        { name: 'Lisa Garcia', initial: 'LG' },
        { name: 'Tom White', initial: 'TW' },
        { name: 'Anna Davis', initial: 'AD' },
      ],
      hasConflict: false,
    },
    {
      id: 4,
      title: 'Budget Review',
      date: '2024-04-05',
      time: '11:00 AM',
      status: 'canceled',
      participants: [
        { name: 'David Park', initial: 'DP' },
        { name: 'Nina Patel', initial: 'NP' },
      ],
      hasConflict: false,
    },
    {
      id: 5,
      title: 'Design Sprint Kickoff',
      date: '2024-04-18',
      time: '9:00 AM',
      status: 'upcoming',
      participants: [
        { name: 'Sophie Turner', initial: 'ST' },
        { name: 'Mark Hansen', initial: 'MH' },
      ],
      hasConflict: false,
    },
  ]);


  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
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
            {meetings.map((meeting, index) => (
              <tr
                key={meeting.id}
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
                      onClick={() => onView(meeting as Meeting)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(meeting as Meeting)}
                      className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title="Edit meeting"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(meeting.id)}
                      className="p-2 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
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
