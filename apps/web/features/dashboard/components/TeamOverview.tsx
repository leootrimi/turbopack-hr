import { Users, UserCheck, CalendarOff, ClipboardList, Loader2 } from "lucide-react";
import { useDashboardSummary } from "../hooks/useDashboard";

export function TeamOverview() {
  const { data: summary, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 w-full">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 w-full text-red-500 text-sm">
        Error loading overview
      </div>
    );
  }

  const { stats } = summary;

  const tiles = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      label: "Working Today",
      value: stats.workingToday,
      icon: UserCheck,
      color: "#22c55e",
      bg: "#f0fdf4",
    },
    {
      label: "On Leave / Absent",
      value: stats.onLeaveToday,
      icon: CalendarOff,
      color: "#f43f5e",
      bg: "#fff1f2",
    },
    {
      label: "Open Requests",
      value: stats.pendingRequests,
      icon: ClipboardList,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
      {tiles.map((t, i) => {
        const Icon = t.icon;
        return (
          <div
            key={t.label}
            className="flex flex-col items-center gap-3 px-6 py-2 first:pl-0 last:pr-0"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: t.color + "15" }}
            >
              <Icon size={16} style={{ color: t.color }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold mb-1 text-slate-400">
                {t.label}
              </p>
              <p
                className="text-3xl font-extrabold leading-none text-center"
              >
                {t.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}