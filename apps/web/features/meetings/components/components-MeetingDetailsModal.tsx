'use client';

import React from 'react';
import { X, Calendar, Clock, Users, AlertCircle, Edit2, Copy } from 'lucide-react';
import StatusBadge from './components-StatusBadge';
import { formatDate } from '@/lib/utils';
import { Meeting } from '@repo/types';

interface MeetingDetailsModalProps {
  meeting: Meeting;
  onClose: () => void;
}

const MeetingDetailsModal = ({ meeting, onClose }: MeetingDetailsModalProps) => {

  const participantColors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-rose-500',
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200/50 bg-linear-to-r from-slate-50 to-blue-50">
          <h2 className="text-lg font-semibold text-slate-900">Meeting Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{meeting.title}</h3>
                {meeting.availability?.hasConflict && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-amber-50 border border-amber-200/50 rounded-lg">
                    <AlertCircle size={16} className="text-amber-600" />
                    <p className="text-xs text-amber-700 font-medium">
                      Scheduling conflict detected with another meeting
                    </p>
                  </div>
                )}
              </div>
              <StatusBadge status={meeting.status} />
            </div>
          </div>

          {/* Meeting Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date & Time */}
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-600" />
                <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                  Date & Time
                </p>
              </div>
              <p className="text-sm font-medium text-slate-900">{formatDate(meeting.date)}</p>
              <p className="text-sm text-slate-700 mt-1">{meeting.time}</p>
            </div>

            {/* Duration */}
            <div className="bg-linear-to-br from-indigo-50 to-violet-50 border border-indigo-200/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-indigo-600" />
                <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">
                  Duration
                </p>
              </div>
              <p className="text-sm font-medium text-slate-900">1 hour</p>
              <p className="text-xs text-slate-600 mt-1">3:00 PM - 4:00 PM</p>
            </div>
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-slate-600" />
              <h4 className="text-sm font-semibold text-slate-900">
                Participants ({meeting.participants.length})
              </h4>
            </div>
            <div className="space-y-2">
              {meeting.participants.map((participant: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${participantColors[index % participantColors.length]} text-white flex items-center justify-center text-xs font-semibold`}
                  >
                    {participant.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {participant.name}
                    </p>
                    <p className="text-xs text-slate-500">Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Link Section */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Meeting Link</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://meet.company.com/q1-planning-session"
                readOnly
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono"
              />
              <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2">
                <Copy size={16} />
                <span className="text-xs font-medium">Copy</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200/50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2.5 bg-linear-to-r from-indigo-100 to-blue-100 text-indigo-700 font-medium rounded-xl hover:from-indigo-200 hover:to-blue-200 transition-all text-sm flex items-center justify-center gap-2">
              <Edit2 size={16} />
              Edit Meeting
            </button>
            <button className="flex-1 px-4 py-2.5 bg-linear-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg shadow-indigo-500/20 text-sm">
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsModal;
