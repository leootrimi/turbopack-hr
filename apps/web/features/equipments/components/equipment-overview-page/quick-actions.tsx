// components/equipment/QuickActionCard.tsx
import { PlusCircle, Mail } from "lucide-react";

export function QuickActionCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-lg">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
      <button className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors">
        <PlusCircle size={16} />
        Request New Equipment
      </button>
      <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors">
        <Mail size={16} />
        Report Issue
      </button>
    </div>
  );
}