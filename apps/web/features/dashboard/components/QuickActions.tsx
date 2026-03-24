import { UserPlus, Bell, CheckCircle2, BarChart3 } from "lucide-react";
import { SectionHeader } from "../components/shared";
import { useRouter } from "next/navigation";

const ACTIONS = [
  { label: "Add Employee",   Icon: UserPlus,     color: "#6366f1", bg: "#eef2ff", href: "/dashboard/admin/add-employer" },
  { label: "Announcement",   Icon: Bell,         color: "#f59e0b", bg: "#fffbeb", href: "/dashboard/admin/announcements" },
  { label: "Approve All",    Icon: CheckCircle2, color: "#22c55e", bg: "#f0fdf4", href: "/dashboard/admin/check-in" },
  { label: "View Reports",   Icon: BarChart3,    color: "#14b8a6", bg: "#f0fdfa", href: "/dashboard/reports" },
];

export function QuickActions() {
  const router = useRouter();
  return (
    <div>
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            className="flex flex-col items-start gap-2 p-3.5 rounded-2xl border cursor-pointer hover:opacity-90 transition-opacity text-left"
          onClick={() => router.push(a.href)}
        
            style={{ backgroundColor: a.bg, borderColor: a.color + "25" }}
          >
            <a.Icon size={17} style={{ color: a.color }} />
            <span
              className="text-[11px] font-bold leading-tight"
              style={{ color: a.color }}
            >
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
