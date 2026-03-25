"use client";

import { useState } from "react";
import { SearchBar }       from "./components/SearchBar";
import { StatsRow }        from "./components/StatsRow";
import { UserPanel }       from "./components/UserPanel";
import { CheckedInRow }    from "./components/CheckedInRow";
import { NotCheckedInRow } from "./components/NotCheckedInRow";
import { useCheckinDashboard } from "../dashboard/hooks/queries";

export function CheckInPage() {
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString("en-CA"));

  const { data, isLoading } = useCheckinDashboard(selectedDate, false);

  const rawData = data || [];

  const fIn = rawData
    .filter((u) => u.status === "in" || u.status === "late")
    .map((u) => ({
      id: Number(u.id),
      name: u.name.split(" ")[0] || u.name,
      surname: u.name.split(" ").slice(1).join(" "),
      team: u.team,
      checkInTime: u.time || "—",
      isOut: false,
    }))
    .filter((u) =>
      `${u.name} ${u.surname}`.toLowerCase().includes(query.toLowerCase())
    );

  const fOut = rawData
    .filter((u) => u.status === "absent" || u.status === "leave")
    .map((u) => ({
      id: Number(u.id),
      name: u.name.split(" ")[0] || u.name,
      surname: u.name.split(" ").slice(1).join(" "),
      team: u.team,
      role: "Employee",
      avatar: "",
      expectedTime: "09:00 AM",
      status: "Absent" as const,
    }))
    .filter((u) =>
      `${u.name} ${u.surname}`.toLowerCase().includes(query.toLowerCase())
    );

  const total = fIn.length + fOut.length;
  const attendanceRate = total > 0 ? Math.round((fIn.length / total) * 100) : 0;

  return (
    <div
      className="min-h-screen bg-slate-50 p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Check-in Monitor</h1>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 text-sm text-slate-500 border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none focus:border-slate-400 font-medium cursor-pointer"
            />
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search employee…"
          />
        </div>

        {/* stats */}
        <StatsRow
          total={total}
          checkedInCount={fIn.length}
          notCheckedInCount={fOut.length}
          attendanceRate={attendanceRate}
        />

        {/* panels */}
        <div className="grid lg:grid-cols-2 gap-5">
          <UserPanel
            title="Checked In"
            count={fIn.length}
            indicatorColor="#22c55e"
            countColor="#16a34a"
            countBg="#f0fdf4"
          >
            {fIn.map((u) => <CheckedInRow key={u.id} user={u} />)}
          </UserPanel>

          <UserPanel
            title="Not Checked In"
            count={fOut.length}
            indicatorColor="#fbbf24"
            countColor="#d97706"
            countBg="#fffbeb"
          >
            {fOut.map((u) => <NotCheckedInRow key={u.id} user={u} />)}
          </UserPanel>
        </div>

      </div>
    </div>
  );
}