'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Mail } from 'lucide-react';

interface TeamMemberListItemProps {
  member: {
    id: number;
    name: string;
    email: string;
    jobTitle: string;
    department: string;
  };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TeamMemberListItem({ member }: TeamMemberListItemProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/dashboard/employees/${member.id}`);
  };

  return (
    <button
      onClick={handleNavigate}
      className="w-full text-left group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all duration-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-linear-to-br group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            {member.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-medium text-slate-400 truncate tracking-wide uppercase">
              {member.jobTitle}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-slate-300 flex-shrink-0" />
            <span className="text-[10px] font-medium text-slate-400 truncate tracking-wide uppercase">
              {member.department}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <ChevronRight size={14} className="text-blue-500" />
      </div>
    </button>
  );
}
