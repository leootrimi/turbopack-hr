"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Avatar, Badge, SectionHeader } from "../components/shared";
import { INITIAL_REQUESTS, Request, RequestStatus } from "./mock";

const TYPE_COLOR: Record<string, string> = {
  Vacation:   "#6366f1",
  "Sick Leave": "#f43f5e",
  WFH:        "#14b8a6",
};

export function RecentRequests() {
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);

  const handle = (id: number, action: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const statusStyle: Record<RequestStatus, { color: string; label: string }> = {
    pending:  { color: "#f59e0b", label: "Pending"  },
    approved: { color: "#22c55e", label: "Approved" },
    rejected: { color: "#f43f5e", label: "Rejected" },
  };

  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Recent Requests" action="View All" />

      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {requests.map((r) => {
          const color = TYPE_COLOR[r.type] ?? "#6366f1";
          const st = statusStyle[r.status];
          return (
            <div
              key={r.id}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <Avatar initials={r.initials} color={color} />

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 truncate">
                  {r.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge label={r.type} color={color} />
                  <span className="text-[10px] text-slate-400">
                    {r.days}d · {r.submitted}
                  </span>
                </div>
              </div>

              {r.status === "pending" ? (
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handle(r.id, "approved")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "#f0fdf4" }}
                    title="Approve"
                  >
                    <Check size={13} color="#22c55e" />
                  </button>
                  <button
                    onClick={() => handle(r.id, "rejected")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
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
