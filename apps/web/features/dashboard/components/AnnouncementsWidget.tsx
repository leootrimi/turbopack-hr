"use client";

import { Plus, Loader2, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { SectionHeader, Badge } from "../components/shared";
import { useAnnouncements } from "../../announcements/hooks/queries";
import { useState } from "react";
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

const PAGE_SIZE = 3;

export function AnnouncementsWidget({ onNew }: AnnouncementsWidgetProps) {
  const { data: announcements = [], isLoading } = useAnnouncements();
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
      </div>
    );
  }

  const totalPages = Math.ceil(announcements.length / PAGE_SIZE);
  const paginatedAnnouncements = announcements.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));

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
        {paginatedAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400">
            <Bell size={24} className="opacity-20 mb-2" />
            <p className="text-[11px]">No announcements available.</p>
          </div>
        ) : (
          paginatedAnnouncements.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl p-3 border-[0.5px] border-slate-200 hover:border-slate-300 transition-colors ${a.pinned ? "border-slate-50" : "bg-blue-100"}`}
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
          ))
        )}
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
