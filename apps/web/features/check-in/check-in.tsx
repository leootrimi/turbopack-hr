"use client";

import { useState } from "react";
import { SearchBar }       from "./components/SearchBar";
import { StatsRow }        from "./components/StatsRow";
import { UserPanel }       from "./components/UserPanel";
import { CheckedInRow }    from "./components/CheckedInRow";
import { NotCheckedInRow } from "./components/NotCheckedInRow";
import { checkedIn, notCheckedIn } from "./components/mock";

export function CheckInPage() {
  const [query, setQuery] = useState("");

  const fIn = checkedIn.filter((u) =>
    `${u.name} ${u.surname}`.toLowerCase().includes(query.toLowerCase())
  );
  const fOut = notCheckedIn.filter((u) =>
    `${u.name} ${u.surname}`.toLowerCase().includes(query.toLowerCase())
  );

  const attendanceRate = Math.round(
    (checkedIn.length / (checkedIn.length + notCheckedIn.length)) * 100
  );

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
            <p className="text-sm text-slate-500 mt-0.5">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search employee…"
          />
        </div>

        {/* stats */}
        <StatsRow
          total={checkedIn.length + notCheckedIn.length}
          checkedInCount={checkedIn.length}
          notCheckedInCount={notCheckedIn.length}
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