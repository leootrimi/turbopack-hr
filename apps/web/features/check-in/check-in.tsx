"use client";

import { useState } from "react";
import { SearchBar }       from "./components/SearchBar";
import { StatsRow }        from "./components/StatsRow";
import { UserPanel }       from "./components/UserPanel";
import { CheckedInRow }    from "./components/CheckedInRow";
import { NotCheckedInRow } from "./components/NotCheckedInRow";
import { useCheckinDashboard } from "../dashboard/hooks/queries";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { Button } from "@/components/components/ui/button";
import { Calendar } from "@/components/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/components/ui/popover";

export function CheckInPage() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const selectedDate = date ? format(date, "yyyy-MM-dd") : new Date().toLocaleDateString("en-CA");

  const { data: rawQuery, isLoading } = useCheckinDashboard(selectedDate, false);

  const rawData = rawQuery || [];

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
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Check-in Monitor</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    "border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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