// components/equipment/StatsSummaryCard.tsx
import { Package, Wrench } from "lucide-react";

interface StatsSummaryCardProps {
  assigned: number;
  inRepair: number;
}

export function StatsSummaryCard({ assigned, inRepair }: StatsSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-lg">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
            <Package size={14} className="text-emerald-100" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{assigned}</p>
            <p className="text-xs text-slate-500">Assigned</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
            <Wrench size={14} className="text-amber-100" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{inRepair}</p>
            <p className="text-xs text-slate-500">In Repair</p>
          </div>
        </div>
      </div>
    </div>
  );
}