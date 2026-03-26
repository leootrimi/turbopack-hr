import { Check, X, Loader2 } from "lucide-react";
import { Avatar, Badge, SectionHeader } from "../components/shared";
import { useDashboardSummary } from "../hooks/useDashboard";
import { useUpdateTimeOffStatus } from "../hooks/useTimeOff";

const TYPE_COLOR: Record<string, string> = {
  Vacation:   "#6366f1",
  "Sick Leave": "#f43f5e",
  "Work From Home": "#14b8a6",
};

export function RecentRequests() {
  const { data: summary, isLoading } = useDashboardSummary();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateTimeOffStatus();

  const handle = (id: number, action: "Approved" | "Rejected") => {
    updateStatus({ id, status: action });
  };

  const statusStyle: Record<string, { color: string; label: string }> = {
    Pending:  { color: "#f59e0b", label: "Pending"  },
    Approved: { color: "#22c55e", label: "Approved" },
    Rejected: { color: "#f43f5e", label: "Rejected" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
      </div>
    );
  }

  const requests = summary?.recentRequests || [];

  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Recent Requests" action="View All" />

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {requests.map((r: any) => {
          const color = TYPE_COLOR[r.type] ?? "#6366f1";
          const st = statusStyle[r.status] || { color: "#ccc", label: r.status };
          
          // Calculate days
          const start = new Date(r.startDate);
          const end = new Date(r.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          return (
            <div
              key={r.id}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <Avatar initials={r.employeeName?.split(' ').map((n: string) => n[0]).join('') || '?'} color={color} />

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 truncate">
                  {r.employeeName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge label={r.type} color={color} />
                  <span className="text-[10px] text-slate-400">
                    {diffDays}d · {new Date(r.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {r.status === "Pending" ? (
                <div className="flex gap-1.5 shrink-0">
                  <button
                    disabled={isUpdating}
                    onClick={() => handle(r.id, "Approved")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: "#f0fdf4" }}
                    title="Approve"
                  >
                    <Check size={13} color="#22c55e" />
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() => handle(r.id, "Rejected")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: "#fff1f2" }}
                    title="Reject"
                  >
                    <X size={13} color="#f43f5e" />
                  </button>
                </div>
              ) : (
                <Badge label={st.label} color={st.color} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
