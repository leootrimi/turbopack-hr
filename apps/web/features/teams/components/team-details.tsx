'use client';

import React from 'react';
import { X, Settings, Share2, Archive, Calendar, Info } from 'lucide-react';
import { TeamCard } from '@repo/types';
import { formatDate } from '@/lib/utils';
import { TeamHeaderCard } from './team-details/team-header-card';
import { TeamMembersList } from './team-details/team-members-list';

interface TeamDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCard;
}

export function TeamDetailSidebar({ isOpen, onClose, team }: TeamDetailSidebarProps) {
  return (
    <>
      {/* Overlay - Only show on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative right-0 top-0 h-screen w-full md:w-1/2 bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header Navigation */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <Info size={16} className="text-slate-500" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase tracking-wider">Team Overview</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95 group"
          >
            <X size={20} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-8 space-y-8 pb-20">
          {/* Main Info Card */}
          <TeamHeaderCard
            teamName={team.teamName}
            teamType={team.teamType}
            leaderName={team.leaderName}
            leaderEmail={team.leaderEmail}
            description={team.description}
          />

          {/* Members Section */}
          <div className="animate-in fade-in duration-500 delay-100">
            <TeamMembersList teamId={team.teamId} />
          </div>

          {/* Timeline & Metadata */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100/50 flex items-center justify-center">
                <Calendar size={14} className="text-orange-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Timeline</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-200">
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Established</p>
                <p className="text-sm font-semibold text-slate-900">{formatDate(team.createdAt)}</p>
              </div>
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 shadow-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Updated</p>
                <p className="text-sm font-semibold text-slate-900">{team.updatedAt ? formatDate(team.updatedAt) : 'Never'}</p>
              </div>
            </div>
          </div>

          {/* Action Zone */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-50 transition-all duration-200 uppercase tracking-widest">
              <Share2 size={13} strokeWidth={2.5} />
              Share
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-50 transition-all duration-200 uppercase tracking-widest">
              <Settings size={13} strokeWidth={2.5} />
              Edit
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-red-100 bg-red-50/50 text-red-600 font-bold text-[11px] hover:bg-red-100/50 transition-all duration-200 uppercase tracking-widest">
              <Archive size={13} strokeWidth={2.5} />
              Archive
            </button>
          </div>
        </div>
      </div>
    </>
  );
}