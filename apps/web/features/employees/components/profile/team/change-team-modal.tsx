"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2, UserMinus, ArrowRight } from "lucide-react";
import { useTeams } from "../../../../teams/hooks/queries";
import { TeamSelectItem } from "./team-select-item";

interface ChangeTeamModalProps {
  currentTeamId?: number | null;
  onClose: () => void;
  onSelect: (teamId: number | null) => void;
  isPending: boolean;
}

export function ChangeTeamModal({
  currentTeamId,
  onClose,
  onSelect,
  isPending,
}: ChangeTeamModalProps) {
  const { data: teams = [], isLoading } = useTeams();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(
    currentTeamId ?? null
  );

  const filtered = teams.filter((t: any) =>
    t.teamName?.toLowerCase().includes(search.toLowerCase())
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 animate-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Change Team</h2>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
              Assign a new workspace for this employee
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 active:scale-95"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div className="px-8 py-5 bg-slate-50/50">
          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search teams or departments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 outline-none ring-offset-2 ring-blue-500/20 focus:ring-4 focus:border-blue-500 transition-all shadow-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Team list grid */}
        <div
          className="px-8 pb-6 overflow-y-auto min-h-[160px]"
          style={{ maxHeight: "400px" }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Retrieving teams list...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-100">
              <p className="text-lg font-bold text-slate-300">No matching teams</p>
              <p className="text-sm font-medium text-slate-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((team: any) => (
                <TeamSelectItem
                  key={team.teamId}
                  team={team}
                  isSelected={selectedId === team.teamId}
                  isCurrent={currentTeamId === team.teamId}
                  onSelect={(id) => setSelectedId(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-slate-100 bg-slate-50/30">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-500 transition-all px-4 py-2.5 rounded-xl hover:bg-rose-50 active:scale-95"
          >
            <UserMinus size={16} strokeWidth={2.5} />
            UNASSIGN FROM TEAM
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={isPending || selectedId === currentTeamId}
              onClick={() => onSelect(selectedId)}
              className="flex items-center gap-2 bg-slate-900 text-white text-[12px] font-bold rounded-xl px-4 py-2.5 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Updating…
                </>
              ) : (
                <>
                  Confirm Selection
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
