'use client';

import React from 'react';
import { Participant } from '../types';

const ParticipantAvatars = ({ participants }: { participants: Participant[] }) => {
  const displayLimit = 3;
  const displayed = participants.slice(0, displayLimit);
  const remaining = participants.length - displayLimit;

  const colors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-rose-500',
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {displayed.map((participant, index) => (
          <div
            key={participant.id ?? `${participant.name}-${index}`}
            className={`w-7 h-7 rounded-full ${colors[index % colors.length]} text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow-sm`}
            title={participant.name}
          >
            {participant.initial}
          </div>
        ))}
      </div>
      <span className="text-xs text-slate-600">
        {displayed.length} {displayed.length === 1 ? 'person' : 'people'}
        {remaining > 0 && ` +${remaining}`}
      </span>
    </div>
  );
};

export default ParticipantAvatars;
