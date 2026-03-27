// components/shared/StatusBadge.tsx
import React from 'react';

type MeetingStatus = 'upcoming' | 'completed' | 'canceled';

interface StatusBadgeProps {
  status: MeetingStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles = {
    upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    canceled: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  };

  return (
    <span className={`${sizeClasses[size]} rounded-full border ${styles[status]} font-medium`}>
      {status}
    </span>
  );
};