import { Field, Input } from "@/components/components/FormFields";
import { ConditionConfigSchema, PurchaseInfo } from "@repo/types";
import { Calendar, DollarSign, Building2, ShieldCheck } from "lucide-react";
import { CONDITION_CONFIG, CONDITIONS, STATUS_CONFIG, STATUSES } from "../types";

interface Props {
  data: PurchaseInfo;
  onChange: <K extends keyof PurchaseInfo>(key: K, value: PurchaseInfo[K]) => void;
}

export function StepPurchase({ data, onChange }: Props) {
  const isWarrantyExpired = data.warrantyExpiration && new Date(data.warrantyExpiration) < new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Purchase & Status Details</h2>
        <p className="text-sm text-slate-500 mt-0.5">Administrative and lifecycle tracking information.</p>
      </div>

      {/* Purchase date + cost */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Purchase Date">
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={data.purchaseDate}
              onChange={(e) => onChange("purchaseDate", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Purchase Cost" hint="In your local currency">
          <div className="relative">
            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="number"
              placeholder="e.g. 1299"
              value={data.purchaseCost}
              onChange={(e) => onChange("purchaseCost", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      {/* Supplier */}
      <Field label="Supplier / Vendor">
        <div className="relative">
          <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="e.g. Dell Technologies, Amazon Business"
            value={data.supplier}
            onChange={(e) => onChange("supplier", e.target.value)}
            className="pl-9"
          />
        </div>
      </Field>

      {/* Warranty */}
      <Field label="Warranty Expiration Date">
        <div className="relative">
          <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            type="date"
            value={data.warrantyExpiration}
            onChange={(e) => onChange("warrantyExpiration", e.target.value)}
            className={`pl-9 ${isWarrantyExpired ? "border-red-200 bg-red-50 focus:border-red-400" : ""}`}
          />
        </div>
        {isWarrantyExpired && (
          <p className="text-[11px] text-red-500 font-medium mt-1">⚠️ Warranty has already expired.</p>
        )}
      </Field>

      {/* Condition */}
      <Field label="Condition" required>
        <div className="grid grid-cols-3 gap-3">
          {CONDITIONS.map((c) => {
            const active = data.condition === c;
            const cfg = CONDITION_CONFIG[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange("condition", c)}
                className="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all"
                style={{
                  borderColor: active ? cfg.text : "#e2e8f0",
                  backgroundColor: active ? cfg.bg : "white",
                }}
              >
                <span className="text-xl">
                  {c === "New" ? "✨" : c === "Used" ? "🔧" : "♻️"}
                </span>
                <span className="text-xs font-bold" style={{ color: active ? cfg.text : "#94a3b8" }}>
                  {c}
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Status */}
      <Field label="Status" required>
        <div className="grid grid-cols-2 gap-3">
          {STATUSES.map((s) => {
            const active = data.status === s;
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange("status", s)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: active ? cfg.dot : "#e2e8f0",
                  backgroundColor: active ? cfg.bg : "white",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: active ? cfg.dot : "#cbd5e1" }}
                />
                <span className="text-xs font-bold" style={{ color: active ? cfg.text : "#94a3b8" }}>
                  {s}
                </span>
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
