"use client";

import React from "react";
import { Users, Crown, CheckCircle2 } from "lucide-react";
import { getInitials } from "./utils";

interface TeamSelectItemProps {
  team: {
    teamId: number;
    teamName: string;
    teamType: string;
    leaderName: string;
    teamMemberCount: number;
  };
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: (teamId: number) => void;
}

export function TeamSelectItem({
  team,
  isSelected,
  isCurrent,
  onSelect,
}: TeamSelectItemProps) {
  return (
    <button
      onClick={() => onSelect(team.teamId)}
      className={`group relative w-full text-left rounded-xl p-4 transition-all duration-200 border ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 shadow-sm"
          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50 hover:shadow-xs"
      }`}
    >
      {/* Selection State Icons */}
      {isCurrent && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200/50">
          Current
        </span>
      )}

      {isSelected && !isCurrent && (
        <CheckCircle2
          size={16}
          className="absolute top-3 right-3 text-blue-500 animate-in zoom-in-50 duration-200"
        />
      )}

      {/* Avatar and Info */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
            isSelected
              ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
              : "bg-linear-to-br from-slate-100 to-slate-200 text-slate-600"
          }`}
        >
          {getInitials(team.leaderName)}
        </div>
        <div className="min-w-0 pr-12">
          <p className="text-sm font-bold text-slate-900 truncate">
            {team.teamName}
          </p>
          <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-tighter">
            {team.teamType || "General"}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5 min-w-0">
          <Crown size={12} className={isSelected ? "text-amber-500" : "text-slate-300"} />
          <span className="truncate">{team.leaderName}</span>
        </span>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <Users size={12} className={isSelected ? "text-blue-500" : "text-slate-300"} />
          <span>{team.teamMemberCount} members</span>
        </span>
      </div>
    </button>
  );
}
