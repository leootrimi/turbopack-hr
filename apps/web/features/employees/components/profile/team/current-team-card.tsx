"use client";

import React from "react";
import { Users, Crown, Building2 } from "lucide-react";
import { getInitials } from "./utils";

interface CurrentTeamCardProps {
  team: {
    teamName: string;
    teamType: string;
    leaderName: string;
    teamMemberCount: number;
  };
}

export function CurrentTeamCard({ team }: CurrentTeamCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white shadow-sm transition-all duration-300">
      {/* Top accent bar */}
      <div className="h-1 bg-linear-to-r from-blue-400 via-indigo-500 to-blue-400" />

      <div className="p-6">
        {/* Team Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1.5">
            <h4 className="text-lg font-bold text-slate-900 tracking-tight">
              {team.teamName}
            </h4>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                {team.teamType || "General"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-50 to-blue-50 border border-blue-100/50 flex items-center justify-center text-indigo-600 shadow-xs">
            <Users size={22} strokeWidth={2.25} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Team Lead */}
          <div className="rounded-xl p-4 bg-slate-50/50 border border-slate-100/80 transition-colors">
            <div className="flex items-center gap-2 mb-2.5">
              <Crown size={12} className="text-amber-500" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Team Lead
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                {getInitials(team.leaderName)}
              </div>
              <p className="text-sm font-semibold text-slate-700 truncate">
                {team.leaderName || "—"}
              </p>
            </div>
          </div>

          {/* Members Count */}
          <div className="rounded-xl p-4 bg-slate-50/50 border border-slate-100/80 transition-colors">
            <div className="flex items-center gap-2 mb-2.5">
              <Building2 size={12} className="text-blue-500" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Force
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-blue-600">
                <Users size={14} />
              </div>
              <div className="flex flex-baseline gap-1">
                <span className="text-sm font-bold text-slate-800">
                  {team.teamMemberCount ?? 0}
                </span>
                <span className="text-xs text-slate-400 font-medium">Headcount</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
