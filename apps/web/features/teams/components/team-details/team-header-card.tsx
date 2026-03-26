'use client';

import React from 'react';
import { Crown, Mail, Briefcase } from 'lucide-react';

interface TeamHeaderCardProps {
  teamName: string;
  teamType: string | null;
  leaderName: string;
  leaderEmail?: string;
  description?: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TeamHeaderCard({
  teamName,
  teamType,
  leaderName,
  leaderEmail,
  description,
}: TeamHeaderCardProps) {
  return (
    <div className="bg-linear-to-br from-indigo-50 via-blue-50 to-slate-50 rounded-2xl border border-blue-100/60 p-6 shadow-xs">
      {/* Team name + badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {teamName}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xs">
              {description}
            </p>
          )}
        </div>
        {teamType && (
          <span className="flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-widest">
            {teamType}
          </span>
        )}
      </div>

      {/* Leader section */}
      <div className="flex items-center gap-3 pt-4 border-t border-blue-100/80">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-200/50 flex-shrink-0">
          {getInitials(leaderName)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Crown size={11} className="text-amber-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Lead</span>
          </div>
          <p className="text-sm font-bold text-slate-800 truncate">{leaderName}</p>
          {leaderEmail && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
              <Mail size={10} />
              {leaderEmail}
            </p>
          )}
        </div>
        {leaderEmail && (
          <div className="ml-auto flex-shrink-0">
            <a
              href={`mailto:${leaderEmail}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
            >
              <Briefcase size={12} />
              Contact
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
