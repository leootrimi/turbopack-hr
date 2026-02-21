import { JobStatus, JobType, JobLocation, STATUS_CONFIG, DEPT_COLORS } from "./mock";
import { MapPin, Clock, Wifi, Building2 } from "lucide-react";

export function StatusBadge({ status }: { status: JobStatus }) {
  const { bg, text, dot } = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dot }} />
      {status}
    </span>
  );
}

export function DeptBadge({ dept }: { dept: string }) {
  const color = DEPT_COLORS[dept] ?? "#94a3b8";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: color + "18", color }}
    >
      {dept}
    </span>
  );
}

export function TypeBadge({ type }: { type: JobType }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
      <Clock size={10} />
      {type}
    </span>
  );
}

export function LocationBadge({ locationType, location }: { locationType: JobLocation; location: string }) {
  const icon =
    locationType === "Remote"  ? <Wifi size={10} />     :
    locationType === "Hybrid"  ? <Building2 size={10} /> :
                                  <MapPin size={10} />;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      {icon}
      {location}
    </span>
  );
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function daysAgoLabel(d: Date) {
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30)  return `${diff}d ago`;
  return formatDate(d);
}
