// components/equipment/ResponsibilityCard.tsx
import { Shield, AlertTriangle } from "lucide-react";

export function ResponsibilityCard() {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full  flex items-center justify-center">
          <Shield size={14} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Your Responsibility</p>
          <p className="text-xs text-slate-600 mt-0.5">
            You are responsible for all assigned equipment. Report any damage, loss, or issues immediately.
          </p>
          <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
            <AlertTriangle size={10} />
            <span>Report issues within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}