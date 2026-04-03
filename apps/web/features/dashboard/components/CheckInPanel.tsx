"use client";

import { useState, useEffect } from "react";
import { Building2, Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, SectionHeader } from "../components/shared";
import { useCheckinDashboard } from "../hooks/queries";
import { useRouter } from "next/navigation";

type CheckInStatus = "in" | "late" | "absent" | "leave";

const STATUS_COLOR: Record<CheckInStatus, string> = {
  in: "#22c55e",
  late: "#f59e0b",
  absent: "#ef4444",
  leave: "#6366f1",
};

const STATUS_LABEL: Record<CheckInStatus, string> = {
  in: "In",
  late: "Late",
  absent: "Absent",
  leave: "On Leave",
};

type Filter = "all" | CheckInStatus;

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in", label: "In" },
  { key: "late", label: "Late" },
  { key: "absent", label: "Absent" },
  { key: "leave", label: "On Leave" },
];

const PAGE_SIZE = 5;

export function CheckInPanel() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: queryData, isLoading } = useCheckinDashboard(undefined, true);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const TODAY_CHECKINS = queryData || [];

  const counts = TABS.reduce<Record<Filter, number>>((acc, t) => {
    acc[t.key] =
      t.key === "all"
        ? TODAY_CHECKINS.length
        : TODAY_CHECKINS.filter((e) => e.status === t.key).length;
    return acc;
  }, {} as Record<Filter, number>);

  const list =
    filter === "all"
      ? TODAY_CHECKINS
      : TODAY_CHECKINS.filter((e) => e.status === filter);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const paginatedList = list.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  return (
    <div className="flex flex-col h-full">
      <SectionHeader
        title="Check-in Status"
        action="View All"
        onAction={() => router.push("/dashboard/admin/check-in")}
      />


      {/* filter tabs */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${filter === t.key
                ? "bg-slate-900 text-white"
                : "border border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className="ml-1 opacity-60">{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* employee rows */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5">
        {isLoading && (
          <div className="flex items-center justify-center p-4 text-slate-400 text-sm">
            Loading check-ins...
          </div>
        )}
        {!isLoading && list.length === 0 && (
          <div className="flex items-center justify-center p-4 text-slate-400 text-sm">
            No check-in records found.
          </div>
        )}
        {!isLoading && paginatedList.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <Avatar initials={emp.initials} color={STATUS_COLOR[emp.status]} />

            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-slate-800 truncate">
                {emp.name}
              </p>
              <p className="text-[10px] text-slate-400">{emp.team}</p>
            </div>

            {emp.time && (
              <p className="text-[11px] font-semibold text-slate-500 shrink-0">
                {emp.time}
              </p>
            )}

            <div className="flex items-center gap-1 shrink-0">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[emp.status] }}
              />
              <span
                className="text-[10px] font-bold"
                style={{ color: STATUS_COLOR[emp.status] }}
              >
                {STATUS_LABEL[emp.status]}
              </span>
            </div>

            {emp.location !== "—" && (
              <span className="text-slate-300 shrink-0">
                {emp.location === "office" ? (
                  <Building2 size={11} />
                ) : (
                  <Wifi size={11} />
                )}
              </span>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <p className="text-[10px] text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
