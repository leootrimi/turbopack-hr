"use client";

import { useState } from "react";
import { Download, CalendarDays, Loader2 } from "lucide-react";
import { KpiCards } from "./components/KpiCards";
import { CheckInAnalytics } from "./components/CheckInAnalytics";
import { UserStatistics } from "./components/UserStatistics";
import { TimeOffAnalytics } from "./components/TimeOffAnalytics";
import { useDashboardReports } from "./hooks/use-dashboard-reports";
import type { ReportsRangeParam } from "./api";

const RANGES = ["This Week", "This Month", "Last 3 Months", "This Year"] as const;
type RangeLabel = (typeof RANGES)[number];

const RANGE_TO_API: Record<RangeLabel, ReportsRangeParam> = {
  "This Week": "this_week",
  "This Month": "this_month",
  "Last 3 Months": "last_3_months",
  "This Year": "this_year",
};

export function ReportsPage() {
  const [range, setRange] = useState<RangeLabel>("This Month");
  const apiRange = RANGE_TO_API[range];
  const { data, isLoading, isError, error, refetch } = useDashboardReports(apiRange);

  return (
    <div
      className="min-h-screen bg-slate-50 p-6 space-y-7"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-7">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Workforce insights and analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
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

            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download size={13} />
              Export
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-12 justify-center">
            <Loader2 className="animate-spin" size={18} />
            Loading reports…
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50/80 p-5 text-sm text-red-800">
            <p className="font-medium">Could not load reports</p>
            <p className="text-red-600/90 mt-1">
              {error instanceof Error ? error.message : "Request failed"}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-xs font-medium text-red-900 underline"
            >
              Retry
            </button>
          </div>
        )}

        {data && !isLoading && (
          <>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays size={14} />
              <span>
                {new Date(data.range.from).toLocaleDateString()} —{" "}
                {new Date(data.range.to).toLocaleDateString()}
              </span>
            </div>

            <KpiCards kpis={data.kpis} />

            <CheckInAnalytics
              checkInTrend={data.checkInTrend}
              checkInByHour={data.checkInByHour}
              locationSplit={data.locationSplit}
              peakCheckinHourLabel={data.peakCheckinHourLabel}
            />

            <UserStatistics
              headcountByTeam={data.headcountByTeam}
              headcountGrowth={data.headcountGrowth}
              turnoverData={data.turnoverData}
            />

            <TimeOffAnalytics
              timeOffByType={data.timeOffByType}
              timeOffTrend={data.timeOffTrend}
            />
          </>
        )}
      </div>
    </div>
  );
}
