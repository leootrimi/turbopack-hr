'use client';

import React from 'react';

type StatusType = 'Available' | 'Assigned' | 'Under Repair' | 'Retired';
type ConditionType = 'New' | 'Used' | 'Refurbished';
type LocationType = 'Office' | 'Remote' | 'Warehouse';

interface StatusBadgeProps {
  status: StatusType | ConditionType | LocationType | string;
  type?: 'status' | 'condition' | 'location';
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const getStatusStyles = (status: string): { bg: string; text: string; border: string } => {
    switch (status) {
      // Equipment Status
      case 'Available':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'Assigned':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'Under Repair':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'Retired':
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
      
      // Condition
      case 'New':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
      case 'Used':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'Refurbished':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      
      // Location
      case 'Office':
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      case 'Remote':
        return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
      case 'Warehouse':
        return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${styles.bg} ${styles.text} ${styles.border}`}>
      {status}
    </span>
  );
}
