"use client";

import { useState } from "react";
import { CalendarDays, History, Umbrella } from "lucide-react";
import { LEAVE_BALANCES, LeaveType } from "./components/mock";
import { BalanceCard }    from "./components/BalanceCard";
import { RequestForm }    from "./components/RequestForm";
import { RequestHistory } from "./components/RequestHistory";
import { useTimeOffRequests } from "./hooks/use-time-off";

type Tab = "request" | "history";

export function TimeOffPage() {
  const [tab, setTab] = useState<Tab>("request");
  const { data: requests = [], isLoading } = useTimeOffRequests();

  const handleSubmit = () => {
    setTab("history");
  };

  const pendingCount  = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Umbrella size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Time Off</h1>
              <p className="text-sm text-slate-500">Manage your leave and requests</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {pendingCount} Pending
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {approvedCount} Approved
            </span>
          </div>
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">

          <div className="flex-1 min-w-0 space-y-4">

            <div className="flex bg-white border border-slate-100 shadow-sm rounded-2xl p-1 gap-1 w-md">
              <button
                onClick={() => setTab("request")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === "request"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <CalendarDays size={15} />
                New Request
              </button>
              <button
                onClick={() => setTab("history")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                  tab === "history"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <History size={15} />
                My Requests
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-3 w-4 h-4 bg-amber-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-sm text-slate-500 font-medium">Loading...</p>
                </div>
              ) : tab === "request" ? (
                <RequestForm onSubmit={() => { handleSubmit(); }} />
              ) : (
                <RequestHistory requests={requests as any} />
              )}
            </div>
          </div>

          <aside className="w-full lg:w-72 shrink-0 space-y-3">
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Balances</h2>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            {LEAVE_BALANCES.map((b) => (
              <BalanceCard key={b.type} balance={b} />
            ))}
          </aside>

        </div>
      </div>
    </div>
  );
}