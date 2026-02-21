"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { timeOffByType, timeOffTrend } from "./mock";

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

export function TimeOffAnalytics() {
  const total = timeOffByType.reduce((s, t) => s + t.days, 0);

  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Time-off Analytics</h2>
      <div className="grid md:grid-cols-2 gap-4">

        {/* Trend */}
        <ChartCard title="Time-off Days Trend" subtitle="Total days taken per month">
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={timeOffTrend}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="days"
                name="Days off"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#trendGrad)"
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Breakdown donut */}
        <ChartCard title="Time-off Breakdown" subtitle="By category this period">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={timeOffByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="days"
                >
                  {timeOffByType.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2.5 flex-1">
              {timeOffByType.map((t) => (
                <div key={t.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.fill }} />
                    {t.name}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800">{t.days}d</span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {Math.round((t.days / total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

      </div>
    </section>
  );
}
