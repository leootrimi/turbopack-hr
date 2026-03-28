"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  CheckInHourRow,
  CheckInTrendRow,
  LocationSlice,
} from "../api";

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export function CheckInAnalytics({
  checkInTrend,
  checkInByHour,
  locationSplit,
  peakCheckinHourLabel,
}: {
  checkInTrend: CheckInTrendRow[];
  checkInByHour: CheckInHourRow[];
  locationSplit: LocationSlice[];
  peakCheckinHourLabel: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Check-in Analytics</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <ChartCard
          title="Attendance"
          subtitle="Checked in vs absent by period bucket"
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={checkInTrend} barSize={10} barGap={3}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar
                dataKey="checkedIn"
                name="Checked In"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="absent"
                name="Absent"
                fill="#fca5a5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />
              Checked In
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-sm bg-red-300 inline-block" />
              Absent
            </span>
          </div>
        </ChartCard>

        <ChartCard
          title="Check-in by Hour"
          subtitle="Distribution in selected range"
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={checkInByHour} barSize={14}>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="count" name="Check-ins" radius={[4, 4, 0, 0]}>
                {checkInByHour.map((row, i) => {
                  const peakIdx = checkInByHour.reduce(
                    (best, r, j, arr) =>
                      r.count > arr[best]!.count ? j : best,
                    0,
                  );
                  return (
                    <Cell
                      key={i}
                      fill={i === peakIdx && row.count > 0 ? "#6366f1" : "#e0e7ff"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-slate-400 mt-1">
            Peak: {peakCheckinHourLabel === "—" ? "—" : peakCheckinHourLabel}
          </p>
        </ChartCard>

        <ChartCard
          title="Location Split"
          subtitle="Check-ins by work location (from job profile)"
        >
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={locationSplit}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {locationSplit.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-1">
            {locationSplit.map((l) => (
              <div
                key={l.name}
                className="flex items-center justify-between text-[11px]"
              >
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: l.fill }}
                  />
                  {l.name}
                </span>
                <span className="font-semibold text-slate-700">{l.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
