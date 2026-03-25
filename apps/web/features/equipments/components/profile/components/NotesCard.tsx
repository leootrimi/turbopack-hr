'use client';

import { NotebookIcon } from 'lucide-react';
import React from 'react';

interface NotesCardProps {
  description?: string;
  notes?: string;
}

export function NotesCard({ description, notes }: NotesCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 rounded-lg">
          <NotebookIcon size={18} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Notes & Description</h3>
      </div>

      <div className="space-y-4">
        {description && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">
              {description}
            </p>
          </div>
        )}

        {notes && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Additional Notes
            </p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">
              {notes}
            </p>
          </div>
        )}

        {!description && !notes && (
          <div className="text-center py-8">
            <NotebookIcon size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 font-medium">No notes available</p>
            <p className="text-xs text-slate-500 mt-1">No description or additional notes for this equipment</p>
          </div>
        )}
      </div>
    </div>
  );
}
