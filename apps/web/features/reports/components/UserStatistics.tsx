"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";
import { headcountByTeam, headcountGrowth, turnoverData } from "./mock";

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

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function UserStatistics() {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">User Statistics</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Headcount by team */}
        <ChartCard title="Headcount by Team" subtitle="Current employees per department">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={headcountByTeam}
              layout="vertical"
              barSize={12}
              margin={{ left: 10 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="team"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="count" name="Employees" radius={[0, 4, 4, 0]}>
                {headcountByTeam.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Headcount growth */}
        <ChartCard title="Headcount Growth" subtitle="Total employees over 6 months">
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={headcountGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[28, 46]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Employees"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Turnover */}
        <ChartCard title="Joiners vs Leavers" subtitle="Monthly movement">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={turnoverData} barSize={10} barGap={3}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="joined" name="Joined" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="left"   name="Left"   fill="#fca5a5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" />Joined</span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><span className="w-2 h-2 rounded-sm bg-red-300 inline-block" />Left</span>
          </div>
        </ChartCard>

      </div>
    </section>
  );
}
