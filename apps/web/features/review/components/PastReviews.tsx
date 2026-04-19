"use client";

import React from "react";
import { ClipboardList, CalendarRange, Info, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useReviewHistory } from "../hooks/queries";

interface PastReviewsProps {
  employeeId: string;
  hideBanner?: boolean;
}

export default function PastReviews({ employeeId, hideBanner = false }: PastReviewsProps) {
  const { data: history, isLoading } = useReviewHistory(parseInt(employeeId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-slate-400 text-sm">
        <Loader2 size={18} className="animate-spin" />
        Loading review history…
      </div>
    );
  }

  const pastCycles = history || [];

  return (
    <div className="p-6 space-y-5">
      {/* Info banner */}
      {!hideBanner && (
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
      )}

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
                  {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'N/A'} - {c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Present'}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Self</span>
                    <div className="flex items-center gap-1">
                      {c.selfStatus === 'submitted' ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <Clock size={12} className="text-amber-400" />
                      )}
                      <span className={`text-[11px] font-medium ${c.selfStatus === 'submitted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {c.selfStatus === 'submitted' ? 'Done' : c.selfStatus === 'draft' ? 'Draft' : 'Missing'}
                      </span>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-slate-100 mx-1" />
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Manager</span>
                    <div className="flex items-center gap-1">
                      {c.managerStatus === 'submitted' ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <Clock size={12} className="text-amber-400" />
                      )}
                      <span className={`text-[11px] font-medium ${c.managerStatus === 'submitted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {c.managerStatus === 'submitted' ? 'Done' : c.managerStatus === 'draft' ? 'Draft' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
