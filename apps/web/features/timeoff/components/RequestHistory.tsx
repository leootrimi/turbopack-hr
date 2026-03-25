import { STATUS_CONFIG, LEAVE_CONFIG } from "./mock";
import { CalendarDays, User, MessageSquare, Clock, Loader2 } from "lucide-react";
import { LeaveRequest } from "../api";
import { useTimeOffRequests } from "../hooks/use-time-off";

interface Props {
  requests?: LeaveRequest[];
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(dateInput: string | Date) {
  const d = new Date(dateInput);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

function RequestCard({ req }: { req: LeaveRequest }) {
  const cfg    = LEAVE_CONFIG[req.type as keyof typeof LEAVE_CONFIG] || LEAVE_CONFIG["Vacation"];
  const status = STATUS_CONFIG[req.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG["Pending"];
  const isUpcoming = new Date(req.startDate) >= new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      {/* top */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: cfg.bg }}>
            {cfg.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{req.type}</p>
            <p className="text-[11px] text-slate-400">{timeAgo(req.submittedAt)}</p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
          style={{ backgroundColor: status.bg, color: status.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
          {req.status}
        </span>
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ backgroundColor: cfg.bg }}
      >
        <CalendarDays size={13} style={{ color: cfg.color }} />
        <span className="text-xs font-semibold" style={{ color: cfg.text }}>
          {formatDate(req.startDate)}
          {req.startDate !== req.endDate && ` → ${formatDate(req.endDate)}`}
        </span>
        <span
          className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-lg"
          style={{ backgroundColor: cfg.color + "20", color: cfg.text }}
        >
          {req.days}d
        </span>
      </div>

      {/* reason */}
      {req.reason && (
        <p className="text-xs text-slate-500 leading-relaxed">{req.reason}</p>
      )}

      {/* reviewer */}
      {req.reviewedBy && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <User size={11} />
          <span>Reviewed by <span className="font-semibold text-slate-600">{req.reviewedBy}</span></span>
        </div>
      )}

      {req.managerNote && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
          <MessageSquare size={11} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-red-600">{req.managerNote}</p>
        </div>
      )}
    </div>
  );
}

export function RequestHistory({ requests: propsRequests }: Props) {
  const { data: hookRequests = [], isLoading } = useTimeOffRequests();
  const requests = propsRequests || hookRequests;
  
  const today = new Date().toISOString().split("T")[0];
  const upcoming = requests.filter((r) => r.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past     = requests.filter((r) => r.startDate < today).sort((a, b) => b.startDate.localeCompare(a.startDate));

  if (isLoading && !propsRequests) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={30} />
        <p className="text-sm text-slate-500 font-medium">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Upcoming</h3>
          </div>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">{upcoming.length}</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        {upcoming.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">No upcoming requests.</div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((r) => <RequestCard key={r.id} req={r} />)}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Past Requests</h3>
          <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{past.length}</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        {past.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">No past requests.</div>
        ) : (
          <div className="space-y-3">
            {past.map((r) => <RequestCard key={r.id} req={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
