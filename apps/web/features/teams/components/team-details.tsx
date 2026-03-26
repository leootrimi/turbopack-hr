'use client';

import React from 'react';
import { X, Users, Calendar, User, Mail, MapPin, Settings, Share2, Archive } from 'lucide-react';

import { TeamCard } from '@repo/types';
import { formatDate } from '@/lib/utils';

interface TeamMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface TeamDetailSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamCard;
}

export function TeamDetailSidebar({ isOpen, onClose, team }: TeamDetailSidebarProps) {
  const leaderInitials = team.leaderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Overlay - Only show on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative right-0 top-0 h-screen w-full md:w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between md:hidden">
          <h2 className="text-base font-bold text-slate-900">Team Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-black-600" />
          </button>
        </div>

        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block sticky top-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Team Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-black-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Team Header Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 rounded-xl border border-blue-200/30 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900 mb-1.5">
                  {team.teamName}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    {team.teamType || 'N/A'}
                  </span>
                  {team.department && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                      {team.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {team.description && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {team.description}
              </p>
            )}
          </div>

          {/* Team Leader Card */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-slate-50 rounded-lg">
                <User size={16} className="text-slate-600" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Team Leader</h3>
            </div>

            <div className="flex items-center  gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{leaderInitials}</span>
              </div>
              <div className="flex-1 min-w-0 items-center justify-center">
                <p className="text-sm font-semibold text-slate-900">
                  {team.leaderName}
                </p>
                {team.leaderEmail && (
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
                    <Mail size={12} />
                    {team.leaderEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-center gap-2 ">
                <Users size={14} className="text-indigo-600" />
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Members
                </p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {team.teamMemberCount}
              </p>
            </div>
 
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar size={14} className="text-indigo-600" />
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Created
                </p>
              </div>
              <p className="text-xs font-bold text-slate-900">
                {formatDate(team.createdAt)}
              </p>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm text-slate-900 font-medium mt-1">
                    {formatDate(team.createdAt)}
                  </p>
                </div>
              </div>

              {team.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Last Updated
                    </p>
                    <p className="text-sm text-slate-900 font-medium mt-1">
                      {formatDate(team.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Team Members Preview */}
          {team.members && team.members.length > 0 && (
            <div className="border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Team Members</h3>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                  {team.members.length}
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {team.members.slice(0, 5).map((member) => {
                  const memberInitials = member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <div key={member.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">
                          {memberInitials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                  );
                })}

                {team.members.length > 5 && (
                  <button className="w-full text-center py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    View all {team.members.length} members
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-slate-200 pt-5 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors group text-sm">
              <Share2 size={14} className="group-hover:text-indigo-600" />
              Share Team
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors group text-sm">
              <Settings size={14} className="group-hover:text-indigo-600" />
              Edit Team
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors group text-sm">
              <Archive size={14} />
              Archive Team
            </button>
          </div>
        </div>
      </div>
    </>
  );
}