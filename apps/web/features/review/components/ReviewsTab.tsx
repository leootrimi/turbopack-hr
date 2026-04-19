"use client";

import React, { useState, useEffect } from "react";
import { Loader2, User, Users, History } from "lucide-react";
import { useActiveReviewCycle } from "../hooks/queries";
import ManagerReviewPage from "../manager/manager-review";
import SelfReviewPage from "../employee/employee-review";
import PastReviews from "./PastReviews";
import { useAuth } from "../../auth/hooks/useAuth";

interface ReviewsTabProps {
  employeeId: string;
}

export default function ReviewsTab({ employeeId }: ReviewsTabProps) {
  const { data: activeCycle, isLoading, error } = useActiveReviewCycle();
  const { user } = useAuth();

  const isSelf = user?.employeeId === parseInt(employeeId);
  const [activeSubTab, setActiveSubTab] = useState<"self" | "manager" | "past">("self");

  // Set initial sub-tab once auth and context are loaded
  useEffect(() => {
    if (isSelf) {
      setActiveSubTab("self");
    } else {
      setActiveSubTab("manager");
    }
  }, [isSelf]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-slate-400 text-sm">
        <Loader2 size={18} className="animate-spin" />
        Loading review cycle…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        Failed to load review cycle. Please refresh.
      </div>
    );
  }

  if (activeCycle && activeCycle.enabled) {
    return (
      <div className="flex flex-col min-h-[600px]">
        {/* Sub-navigation Tabs */}
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">
                {activeCycle.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                 Active performance review period
              </p>
            </div>
            
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveSubTab("self")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === "self"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <User size={14} />
                Self-Reflection
              </button>
              <button
                onClick={() => setActiveSubTab("manager")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === "manager"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Users size={14} />
                Manager Evaluation
              </button>
              <button
                onClick={() => setActiveSubTab("past")}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === "past"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <History size={14} />
                History
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          {activeSubTab === "self" && (
            <SelfReviewPage employeeId={employeeId} cycleId={activeCycle.id} />
          )}
          {activeSubTab === "manager" && (
            <ManagerReviewPage
              employeeId={employeeId}
              managerId={user?.employeeId?.toString() ?? ""}
              cycleId={activeCycle.id}
            />
          )}
          {activeSubTab === "past" && <PastReviews employeeId={employeeId} hideBanner={true} />}
        </div>
      </div>
    );
  }

  return <PastReviews employeeId={employeeId} />;
}
