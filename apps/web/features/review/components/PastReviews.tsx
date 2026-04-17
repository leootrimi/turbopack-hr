"use client";

import React from "react";
import { ClipboardList, CalendarRange, Info } from "lucide-react";

interface PastReviewsProps {
  employeeId: string;
}

export default function PastReviews({ employeeId: _employeeId }: PastReviewsProps) {
  // In the future this would fetch completed review submissions for the employee.
  // For now we show a clear "no active cycle" state with past-cycle placeholders.
  const pastCycles: { title: string; period: string; score: number }[] = [];

  return (
    <div className="p-6 space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
        <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
        <div>
          <p className="text-xs font-semibold">No active review cycle</p>
          <p className="text-xs mt-0.5 text-amber-700">
            An admin needs to create and enable a review cycle in{" "}
            <strong>Settings → Reviews</strong> before the review form appears
            here.
          </p>
        </div>
      </div>

      {/* Past cycles */}
      {pastCycles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <ClipboardList size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No past reviews</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Completed review cycles will appear here once a cycle finishes and
            reviews are submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Past Reviews
          </p>
          {pastCycles.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 bg-white hover:shadow-sm transition-shadow"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{c.title}</p>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                  <CalendarRange size={11} />
                  {c.period}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-800">{c.score}</p>
                <p className="text-[10px] text-slate-400">/ 100</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
