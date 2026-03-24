import { Users, UserCheck, CalendarOff, ClipboardList } from "lucide-react";
import { TODAY_CHECKINS, INITIAL_REQUESTS } from "./mock";

const tiles = [
  {
    label: "Total Employees",
    value: 42,
    icon: Users,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    label: "Working Today",
    value: TODAY_CHECKINS.filter((e) => e.status === "in").length,
    icon: UserCheck,
    color: "#22c55e",
    bg: "#f0fdf4",
  },
  {
    label: "On Leave / Absent",
    value: TODAY_CHECKINS.filter(
      (e) => e.status === "leave" || e.status === "absent"
    ).length,
    icon: CalendarOff,
    color: "#f43f5e",
    bg: "#fff1f2",
  },
  {
    label: "Open Requests",
    value: INITIAL_REQUESTS.filter((r) => r.status === "pending").length,
    icon: ClipboardList,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
];

export function TeamOverview() {
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