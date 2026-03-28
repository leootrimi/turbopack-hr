"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getTimeOffCalendar, type CalendarLeaveRow } from "../timeoff/api";
import { getLeaveTypeConfig } from "../timeoff/components/mock";

interface ExtendedLeaveRequest extends CalendarLeaveRow {
  employeeName: string;
  employeeInitials: string;
}

function getInitials(first: string, last: string): string {
  const a = first?.[0] ?? "";
  const b = last?.[0] ?? "";
  return `${a}${b}`.toUpperCase() || "?";
}

/** Local calendar YYYY-MM-DD (avoids UTC drift from API ISO strings). */
function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse API datetime to local calendar date for range iteration. */
function parseLocalDay(iso: string): Date {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function WhoIsOutCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);
    const days: Date[] = [];
    const endDate = new Date(lastDayOfMonth);
    const endDayOfWeek = endDate.getDay();
    endDate.setDate(endDate.getDate() + (6 - endDayOfWeek));
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const range = useMemo(() => {
    if (!calendarDays.length) return null;
    const first = calendarDays[0]!;
    const last = calendarDays[calendarDays.length - 1]!;
    return { from: toYmd(first), to: toYmd(last) };
  }, [calendarDays]);

  const {
    data: leaveRows = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["time-off-calendar", range?.from, range?.to],
    queryFn: () => getTimeOffCalendar(range!.from, range!.to),
    enabled: !!range?.from && !!range?.to,
  });

  const approvedLeaves = useMemo((): ExtendedLeaveRequest[] => {
    return leaveRows
      .filter((req) => req.status === "Approved")
      .map((req) => ({
        ...req,
        employeeName: `${req.firstName} ${req.lastName}`.trim(),
        employeeInitials: getInitials(req.firstName, req.lastName),
      }));
  }, [leaveRows]);

  const leavesByDate = useMemo(() => {
    const map = new Map<string, ExtendedLeaveRequest[]>();
    approvedLeaves.forEach((req) => {
      const start = parseLocalDay(req.startDate);
      const end = parseLocalDay(req.endDate);
      const cur = new Date(start);
      while (cur <= end) {
        const dateKey = toYmd(cur);
        if (!map.has(dateKey)) map.set(dateKey, []);
        map.get(dateKey)!.push(req);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [approvedLeaves]);

  const legendTypes = useMemo(() => {
    const s = new Set<string>();
    approvedLeaves.forEach((r) => s.add(r.type));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [approvedLeaves]);

  const goPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const goToday = () => {
    const n = new Date();
    setCurrentMonth(new Date(n.getFullYear(), n.getMonth(), 1));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={goToday}
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={goPreviousMonth}
              className="p-1.5 rounded-lg hover:bg-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <button
              type="button"
              onClick={goNextMonth}
              className="p-1.5 rounded-lg hover:bg-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </div>
          <h2 className="text-sm font-semibold text-slate-800 ml-2">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          {(isLoading || isFetching) && (
            <Loader2
              size={14}
              className="text-slate-400 animate-spin shrink-0"
              aria-hidden
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500">Who&apos;s out</span>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-b border-red-100">
          Could not load leave data. Please try again.
        </div>
      )}

      {legendTypes.length > 0 && (
        <div className="flex flex-wrap gap-3 p-3 border-b border-slate-100 bg-white">
          {legendTypes.map((type) => {
            const cfg = getLeaveTypeConfig(type);
            return (
              <div key={type} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full border shrink-0"
                  style={{
                    backgroundColor: cfg.bg,
                    borderColor: cfg.color,
                  }}
                />
                <span className="text-xs text-slate-600">{type}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 text-center border-b border-slate-200 bg-slate-50">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((day) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = day.toDateString() === today.toDateString();
              const dateKey = toYmd(day);
              const leavesToday = leavesByDate.get(dateKey) || [];
              return (
                <div
                  key={dateKey}
                  className={`
                    min-h-[100px] border-r border-b border-slate-100 p-2 transition-colors
                    ${!isCurrentMonth ? "bg-slate-50/50 text-slate-400" : "bg-white"}
                    ${isToday ? "bg-gradient-to-br from-indigo-50/50 to-blue-50/50" : ""}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`
                        text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                        ${isToday ? "bg-indigo-500 text-white" : "text-slate-700"}
                      `}
                    >
                      {day.getDate()}
                    </span>
                    {leavesToday.length > 0 && (
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                        {leavesToday.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {leavesToday.map((leave, idx) => {
                      const cfg = getLeaveTypeConfig(leave.type);
                      return (
                        <div key={`${leave.id}-${idx}`} className="group relative">
                          <div
                            className="text-xs px-1.5 py-0.5 rounded-md truncate cursor-help border"
                            style={{
                              backgroundColor: cfg.bg,
                              color: cfg.text,
                              borderColor: `${cfg.color}40`,
                            }}
                            title={`${leave.employeeName} – ${leave.type}\n${formatDate(leave.startDate)} – ${formatDate(leave.endDate)}`}
                          >
                            <span className="font-medium mr-1">
                              {leave.employeeInitials}
                            </span>
                            <span className="text-[10px] opacity-90">
                              {leave.type.length > 10
                                ? `${leave.type.slice(0, 8)}…`
                                : leave.type}
                            </span>
                          </div>
                          {leave.days > 1 && (
                            <div
                              className="absolute -bottom-0.5 left-1 right-1 h-0.5 rounded-full opacity-30"
                              style={{ backgroundColor: cfg.color }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!isLoading && !error && approvedLeaves.length === 0 && (
        <div className="py-8 px-4 text-center text-sm text-slate-500 border-t border-slate-100">
          No approved time off in this view. Approved requests appear here for everyone in the
          organization.
        </div>
      )}
    </div>
  );
}
