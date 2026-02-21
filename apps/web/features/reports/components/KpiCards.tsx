import { TrendingUp, TrendingDown } from "lucide-react";
import { kpis } from "./mock";

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1 leading-none">
            {kpi.value}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            {kpi.deltaType === "up" ? (
              <TrendingUp size={13} className="text-emerald-500" />
            ) : (
              <TrendingDown size={13} className="text-red-400" />
            )}
            <span
              className={`text-xs font-semibold ${
                kpi.deltaType === "up" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {kpi.delta}
            </span>
            <span className="text-xs text-slate-400">{kpi.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
