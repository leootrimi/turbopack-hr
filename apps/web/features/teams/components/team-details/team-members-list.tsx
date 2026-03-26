'use client';

import React from 'react';
import { Users, Loader2, ArrowRight } from 'lucide-react';
import { useTeamMembers } from '../../hooks/queries';
import { TeamMemberListItem } from './team-member-list-item';

interface TeamMembersListProps {
  teamId: number;
}

export function TeamMembersList({ teamId }: TeamMembersListProps) {
  const { data: members, isLoading, error } = useTeamMembers(teamId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 size={24} className="text-blue-500 animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving Force...</p>
      </div>
    );
  }

  if (error || !members) {
    return (
      <div className="p-6 text-center bg-rose-50/50 rounded-2xl border border-rose-100/50">
        <p className="text-sm font-semibold text-rose-600 tracking-tight">Failed to load team members</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center">
            <Users size={14} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Team Members</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 tracking-wider">
          {members.length} {members.length === 1 ? 'MEMBER' : 'MEMBERS'}
        </span>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto px-1 scrollbar-hide">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60">
            <p className="text-sm font-bold text-slate-300">No members assigned yet</p>
          </div>
        ) : (
          members.map((member) => (
            <TeamMemberListItem key={member.id} member={member} />
          ))
        )}
      </div>
    </div>
  );
}
