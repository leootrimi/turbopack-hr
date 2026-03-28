"use client";

import { Plus, Loader2 } from "lucide-react";
import { SectionHeader, Badge } from "../components/shared";
import { useDashboardSummary } from "../hooks/useDashboard";
import { formatDate } from "../../../lib/utils";
import { useAuth } from "../../auth/hooks/useAuth";

const TAG_COLORS: Record<string, string> = {
  General: "#6366f1",
  Urgent: "#f43f5e",
  HR: "#14b8a6",
  IT: "#3b82f6",
  Event: "#f59e0b",
};

interface AnnouncementsWidgetProps {
  onNew: () => void;
}

export function AnnouncementsWidget({ onNew }: AnnouncementsWidgetProps) {
  const { data: summary, isLoading } = useDashboardSummary();
  const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
      </div>
    );
  }

  const announcements = summary?.recentAnnouncements || [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-[-0.01em]">
          Announcements
        </h3>
        {
          isAdmin && 
          <button
          onClick={onNew}
          className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-xl px-3 py-1.5 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <Plus size={11} />
          New
        </button>
        }

      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
        {announcements.map((a: any) => (
          <div
            key={a.id}
            className="rounded-xl p-3 bg-slate-50 border-[1px]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Badge label={a.tag} color={TAG_COLORS[a.tag] ?? "#6366f1"} />
              <span className="text-[10px] text-slate-400 ml-auto">
                {formatDate(a.createdAt)}
              </span>
            </div>
            <p className="text-[12px] font-bold text-slate-800 mb-1 leading-snug">
              {a.title}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
              {a.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
