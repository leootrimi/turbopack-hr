'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface MetadataCardProps {
  createdAt?: Date;
  updatedAt?: Date;
}

export function MetadataCard({ createdAt, updatedAt }: MetadataCardProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg">
          <Clock size={18} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Timeline</h3>
      </div>

      <div className="space-y-3">
        {createdAt && (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Created
              </p>
              <p className="text-sm text-slate-700 mt-1">{formatDate(createdAt)}</p>
            </div>
          </div>
        )}

        {updatedAt && (
          <div className="flex items-start justify-between pt-3 border-t border-slate-300">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Last Updated
              </p>
              <p className="text-sm text-slate-700 mt-1">{formatDate(updatedAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
