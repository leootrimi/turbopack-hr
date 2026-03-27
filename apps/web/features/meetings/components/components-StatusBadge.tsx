'use client';

import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    upcoming: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: Clock,
      label: 'Upcoming',
    },
    completed: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: CheckCircle2,
      label: 'Completed',
    },
    canceled: {
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      text: 'text-slate-600',
      icon: AlertCircle,
      label: 'Canceled',
    },
  };

  const { bg, border, text, icon: Icon, label } = config[status as keyof typeof config] || config.upcoming;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${bg} ${border}`}>
      <Icon size={14} className={text} />
      <span className={`text-xs font-medium ${text}`}>{label}</span>
    </div>
  );
};

export default StatusBadge;
