"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ATTENDANCE_DATA, DEPT_DATA } from "./mock";

type View = "week" | "dept";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-md px-3 py-2 text-[11px]">
      <p className="font-bold text-slate-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="my-0.5">
          {p.name}:{" "}
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function AttendanceChart() {
  const [view, setView] = useState<View>("week");

  return (
    <div className="flex flex-col h-full">
      {/* header + toggle */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[13px] font-bold text-slate-800 tracking-[-0.01em]">
          HR Analytics
        </h3>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-0.5">
          {(["week", "dept"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-[10px] transition-all cursor-pointer ${view === v
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
                }`}
            >
              {v === "week" ? "This Week" : "By Dept"}
            </button>
          ))}
        </div>
      </div>

      {view === "week" ? (
        <>
          {/* legend */}
          <div className="flex gap-4 mb-3">
            {[
              { label: "Present", color: "#6366f1" },
              { label: "Absent", color: "#fca5a5" },
              { label: "WFH", color: "#14b8a6" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: l.color }}
                />
                {l.label}
              </span>
            ))}
          </div>

          {/* bar chart */}
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ATTENDANCE_DATA}
                barSize={9}
                barGap={3}
                margin={{ top: 0, right: 4, bottom: 0, left: -28 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="present" name="Present" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wfh" name="WFH" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        /* dept progress bars */
        <div className="flex-1 flex flex-col justify-center gap-3">
          {DEPT_DATA.map((d) => (
            <div key={d.dept} className="flex items-center gap-3">
              <span className="w-24 text-[11px] font-semibold text-slate-500 text-right shrink-0">
                {d.dept}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                />
              </div>
              <span
                className="text-[11px] font-bold w-8 shrink-0"
                style={{ color: d.color }}
              >
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
