import { ReactNode } from "react";

interface UserPanelProps {
  title: string;
  count: number;
  indicatorColor: string;
  countColor: string;
  countBg: string;
  children: ReactNode;
}

export function UserPanel({
  title,
  count,
  indicatorColor,
  countColor,
  countBg,
  children,
}: UserPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: indicatorColor }} />
        <h2 className="font-semibold text-slate-900 text-sm">{title}</h2>
        <span
          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-lg"
          style={{ color: countColor, backgroundColor: countBg }}
        >
          {count}
        </span>
      </div>

      <div className="divide-y divide-slate-50">
        {count === 0 ? (
          <p className="text-center text-sm text-slate-400 py-10">No results</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
