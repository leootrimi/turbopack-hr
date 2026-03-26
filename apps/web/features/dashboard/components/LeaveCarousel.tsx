import { useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Avatar } from "../components/shared";
import { useDashboardSummary } from "../hooks/useDashboard";

const TYPE_ICONS: Record<string, string> = {
  Vacation: "🌴",
  "Sick Leave": "🤒",
  "Work From Home": "🏠",
  Marriage: "💍",
  Bereavement: "🙏",
  Unpaid: "💸",
  "Personal Day": "👤",
};

export function LeaveCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: summary, isLoading } = useDashboardSummary();

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
      </div>
    );
  }

  const upcomingLeaves = summary?.upcomingLeaves || [];

  if (upcomingLeaves.length === 0) {
    return (
      <div className="flex flex-col h-full">
         <h3 className="text-[13px] font-bold text-slate-800 tracking-[-0.01em] mb-4">
          Upcoming Time Off
        </h3>
        <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-xs text-slate-400">No upcoming approved leaves</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-[-0.01em]">
          Upcoming Time Off
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} className="text-slate-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight size={13} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {upcomingLeaves.map((leave: any) => (
          <div
            key={leave.id}
            className="flex-shrink-0 w-36 rounded-2xl p-4 flex flex-col gap-2.5 border border-slate-100 bg-white shadow-sm"
          >
            {/* top row */}
            <div className="flex items-center justify-between">
              <Avatar initials={leave.employeeName.split(" ").map((n: string) => n[0]).join("")} size="sm" />
              <span className="text-lg leading-none">{TYPE_ICONS[leave.type] || "🕒"}</span>
            </div>

            {/* info */}
            <div>
              <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                {leave.employeeName.split(" ")[0]}
              </p>
              <p className="text-[10px] font-semibold mt-0.5 text-slate-400">
                {leave.type}
              </p>
            </div>

            {/* date range pill */}
            <div className="mt-auto bg-slate-50 rounded-lg px-2 py-1.5">
              <p className="text-[9px] text-slate-500 leading-snug font-medium">
                {new Date(leave.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} → 
                {new Date(leave.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
