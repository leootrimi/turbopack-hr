'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface MeetingStats {
  total: number;
  upcoming: number;
  completed: number;
  canceled: number;
}

const SummaryCards = ({ stats }: { stats: MeetingStats }) => {
  const cards = [
    {
      id: 1,
      label: 'Total Meetings',
      value: String(stats.total),
      icon: Calendar,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-200/30',
      iconColor: 'text-blue-600',
      blurb: 'All meetings you organize or attend',
    },
    {
      id: 2,
      label: 'Upcoming',
      value: String(stats.upcoming),
      icon: Clock,
      gradient: 'from-indigo-500/10 to-violet-500/10',
      borderColor: 'border-indigo-200/30',
      iconColor: 'text-indigo-600',
      blurb: 'Scheduled and not yet ended',
    },
    {
      id: 3,
      label: 'Completed',
      value: String(stats.completed),
      icon: CheckCircle2,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-200/30',
      iconColor: 'text-emerald-600',
      blurb: 'Past end time',
    },
    {
      id: 4,
      label: 'Canceled',
      value: String(stats.canceled),
      icon: AlertCircle,
      gradient: 'from-rose-500/10 to-pink-500/10',
      borderColor: 'border-rose-200/30',
      iconColor: 'text-rose-600',
      blurb: 'Canceled in the system',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`bg-linear-to-br ${stat.gradient} border ${stat.borderColor} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl bg-white/50 ${stat.iconColor}`}>
                <Icon size={20} strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200/30">
              <p className="text-xs text-slate-500">{stat.blurb}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
