"use client";

import { useState } from "react";
import { Download, CalendarDays } from "lucide-react";
import { KpiCards }          from "./components/KpiCards";
import { CheckInAnalytics }  from "./components/CheckInAnalytics";
import { UserStatistics }    from "./components/UserStatistics";
import { TimeOffAnalytics }  from "./components/TimeOffAnalytics";

const RANGES = ["This Week", "This Month", "Last 3 Months", "This Year"] as const;
type Range = (typeof RANGES)[number];

export function ReportsPage() {
  const [range, setRange] = useState<Range>("This Month");

  return (
    <div
      className="min-h-screen bg-slate-50 p-6 space-y-7"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-7">

        {/* ── page header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Workforce insights and analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* range picker */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    range === r
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        {/* ── KPIs ── */}
        <KpiCards />

        {/* ── sections ── */}
        <CheckInAnalytics />
        <UserStatistics />
        <TimeOffAnalytics />

      </div>
    </div>
  );
}
