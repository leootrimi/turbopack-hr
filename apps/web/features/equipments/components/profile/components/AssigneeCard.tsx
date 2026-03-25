'use client';

import React from 'react';
import { User, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface AssigneeCardProps {
  assignedTo?: {
    name: string;
    email: string;
    id: number;
  };
  assignmentDate?: Date;
  returnDueDate?: Date;
}

export function AssigneeCard({ assignedTo, assignmentDate, returnDueDate }: AssigneeCardProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = returnDueDate && new Date(returnDueDate) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">
          <User size={18} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Assignment</h3>
      </div>

      {assignedTo ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Assigned To
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {assignedTo.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{assignedTo.name}</p>
                <p className="text-xs text-slate-500">{assignedTo.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Assignment Date
                </p>
                <p className="text-sm text-slate-900">
                  {formatDate(assignmentDate) || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {returnDueDate && (
            <div className={`border-t border-slate-100 pt-4 ${isOverdue ? 'bg-red-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl' : ''}`}>
              <div className="flex items-start gap-3">
                {isOverdue && <AlertCircle size={16} className="text-red-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Return Due Date
                  </p>
                  <p className={`text-sm ${isOverdue ? 'text-red-700 font-semibold' : 'text-slate-900'}`}>
                    {formatDate(returnDueDate)}
                  </p>
                  {isOverdue && (
                    <p className="text-xs text-red-600 mt-1 font-medium">⚠️ Equipment return is overdue</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <User size={20} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-600 font-medium">Not Assigned</p>
          <p className="text-xs text-slate-500 mt-1">This equipment is currently available</p>
        </div>
      )}
    </div>
  );
}
