import { LeaveBalance, getLeaveTypeConfig } from "./mock";

interface Props {
  balance: LeaveBalance;
}

export function BalanceCard({ balance }: Props) {
  const { type, total, used, color } = balance;

  const isUnlimited = total >= 9999;
  const remaining = isUnlimited ? "Unlimited" : total - used;
  const pct = !isUnlimited && total > 0 ? Math.round((used / total) * 100) : 0;
  const cfg = getLeaveTypeConfig(type);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ backgroundColor: cfg.bg }}
          >
            {cfg.icon}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">{type}</p>
            <p className="text-[10px] text-slate-400">{cfg.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold leading-none" style={{ color }}>{remaining}</p>
          <p className="text-[10px] text-slate-400">left</p>
        </div>
      </div>

      {/* progress bar */}
      {!isUnlimited && (
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{used} used</span>
            <span>{total} total</span>
          </div>
        </div>
      )}
    </div>
  );
}
