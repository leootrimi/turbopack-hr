import { CheckCircle2, Clock, Users, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatsRowProps {
  total: number;
  checkedInCount: number;
  notCheckedInCount: number;
  attendanceRate: number;
}

export function StatsRow({
  total,
  checkedInCount,
  notCheckedInCount,
  attendanceRate,
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard value={total}              label="Total employees"       icon={Users}        color="#6366f1" />
      <StatCard value={checkedInCount}     label="Checked in"            icon={CheckCircle2} color="#22c55e" />
      <StatCard value={notCheckedInCount}  label="Not checked in"        icon={Clock}        color="#f59e0b" />
      <StatCard value={`${attendanceRate}%`} label="Attendance rate today" icon={TrendingUp} color="#14b8a6" />
    </div>
  );
}
