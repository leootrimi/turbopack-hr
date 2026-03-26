'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/components/ui/avatar';
import { Card } from '@/components/components/ui/card';
import { Users, ArrowRight } from 'lucide-react';
import { TeamCard } from '@repo/types';

interface TeamCardProps {
  team: TeamCard;
}

export function TeamCardComponent({ team }: TeamCardProps) {
  const initials = team.leaderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="group p-2 gap-2 bg-card hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 border-slate-200/60 backdrop-blur-sm overflow-hidden cursor-pointer">
      <div className="px-4 py-2">
        {/* Top Section: Team Name and Type */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1 text-balance group-hover:text-blue-600 transition-colors line-clamp-2">
              {team.teamName}
            </h3>
          </div>
          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100/60 flex-shrink-0 ml-2">
            {team.teamType}
          </span>
        </div>

        {/* Team Lead Info */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
          <Avatar className="h-8 w-8 border border-slate-200 flex-shrink-0">
            <AvatarImage
              src={team.leaderName}
              alt={team.leaderName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-700 font-semibold text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
              Team Lead
            </p>
            <p className="text-xs font-semibold text-foreground truncate">
              {team.leaderName}
            </p>
            {team.leaderEmail && (
              <p className="text-[10px] text-slate-400 truncate">{team.leaderEmail}</p>
            )}
          </div>
        </div>

        {/* Members Count and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs font-medium">{team.teamMemberCount} members</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight size={16} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Gradient Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}