'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function InfoCard({ title, icon: Icon, children, className }: InfoCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="p-2 bg-slate-50 rounded-lg">
            <Icon size={18} className="text-slate-600" />
          </div>
        )}
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

interface InfoFieldProps {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
}

export function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-900 font-medium">
        {value || <span className="text-slate-400 italic">Not specified</span>}
      </p>
    </div>
  );
}
