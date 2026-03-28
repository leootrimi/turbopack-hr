import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardSummary } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";

export function DashboardHeader() {
  const router = useRouter();
  const { data: summary, isLoading } = useDashboardSummary();
  const { user, isAdmin } = useAuth();

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-between gap-4 mb-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-lg" />
        <div className="h-10 w-64 bg-slate-100 rounded-lg" />
      </div>
    );
  }

  const { stats } = summary || { stats: { totalEmployees: 0, workingToday: 0 } };
  const working = stats.workingToday;
  const attendancePct = stats.totalEmployees > 0
    ? Math.round((working / stats.totalEmployees) * 100)
    : 0;

  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      {/* greeting */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-0.5">
          {`Good morning, ${user?.email} 👋`}
        </h1>
        <p className="text-[13px] text-slate-400">{today}</p>
      </div>

      {/* status pill + CTA */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-2 text-[12px] text-slate-500 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <strong className="text-slate-800">{working}</strong> working today
          <span className="text-slate-200 mx-1">·</span>
          <strong className="text-indigo-500">{attendancePct}%</strong>{" "}
          attendance
        </div>

        {isAdmin && 
        <button
          className="flex items-center gap-2 bg-slate-900 text-white text-[12px] font-bold rounded-xl px-4 py-2.5 hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => router.push("/dashboard/admin/add-employer")}
        >
          <Plus size={14} />
          Add Employee
        </button>}

      </div>
    </div>
  );
}
