"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useEmployeeTeam, useUpdateEmployeeTeam } from "../../hooks/queries";
import { CurrentTeamCard } from "./team/current-team-card";
import { ChangeTeamModal } from "./team/change-team-modal";

interface TeamTabProps {
  employeeId: string;
}

const TeamTab = ({ employeeId }: TeamTabProps) => {
  const { data: currentTeam, isLoading, error } = useEmployeeTeam(employeeId);
  const { mutate: updateTeam, isPending } = useUpdateEmployeeTeam(employeeId);
  
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSelect = (teamId: number | null) => {
    updateTeam(teamId, {
      onSuccess: () => {
        setShowModal(false);
        setSuccessMessage(teamId ? "Employee successfully assigned to new team" : "Employee removed from team");
        setTimeout(() => setSuccessMessage(null), 4000);
      },
    });
  };

  if (error) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center gap-4 bg-rose-50/30 rounded-3xl border border-rose-100 m-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-sm shadow-rose-200/50">
          <AlertCircle size={32} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Failed to load team data</h4>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-xs mx-auto">
            We couldn't retrieve this employee's current team assignment. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Success Notification */}
      {successMessage && (
        <div
          className="flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold animate-in slide-in-from-top-4 duration-500 shadow-lg shadow-emerald-500/10"
          style={{
            background: "hsl(140,70%,97%)",
            border: "1px solid hsl(140,70%,85%)",
            color: "hsl(140,70%,25%)",
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <CheckCircle2 size={16} strokeWidth={3} />
          </div>
          {successMessage}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
            Team Workspace
          </h3>
          <p className="text-sm text-slate-400 max-w-md">
            Manage where this employee belongs within the organizational structure and their reporting line.
          </p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 text-white text-[12px] font-bold rounded-xl px-4 py-2.5 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw size={16} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>Update Team Assignment</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm z-10 rounded-3xl">
            <Loader2 size={40} className="text-blue-500 animate-spin" strokeWidth={2.5} />
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Fetching details...</p>
          </div>
        ) : !currentTeam ? (
          /* Empty State - No team assigned */
          <div
            className="flex flex-col items-center justify-center py-18 px-8 rounded-3xl text-center transition-all bg-slate-50/50 border-2 border-dashed border-slate-200/60"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 bg-white border border-slate-100"
            >
              <Building2 size={36} className="text-slate-200" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-semibold text-slate-900">No team currently assigned</h4>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">
              This employee hasn't been placed into a team yet. Use the button above to assign one.
            </p>
          </div>
        ) : (
          /* Current team view */
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <CurrentTeamCard team={currentTeam} />
          </div>
        )}
      </div>

      {/* Selection Modal */}
      {showModal && (
        <ChangeTeamModal
          currentTeamId={currentTeam?.teamId}
          onClose={() => setShowModal(false)}
          onSelect={handleSelect}
          isPending={isPending}
        />
      )}
    </div>
  );
};

export default TeamTab;
