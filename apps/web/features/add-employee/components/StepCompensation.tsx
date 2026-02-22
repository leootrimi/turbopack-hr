import { CompensationInfo, CURRENCIES } from "./types";
import { Field, Input, Select, SegmentControl, Toggle } from "../components/FormFields";
import { DollarSign, Landmark } from "lucide-react";

interface Props {
  data: CompensationInfo;
  onChange: <K extends keyof CompensationInfo>(key: K, value: CompensationInfo[K]) => void;
}

export function StepCompensation({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Compensation & Payroll</h2>
        <p className="text-sm text-slate-500 mt-0.5">Salary details, payment schedule and benefits eligibility.</p>
      </div>

      {/* Salary amount + currency */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Field label="Salary Amount" required>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                type="number"
                placeholder="e.g. 3500"
                value={data.salaryAmount}
                onChange={(e) => onChange("salaryAmount", e.target.value)}
                className="pl-9"
              />
            </div>
          </Field>
        </div>
        <Field label="Currency">
          <Select value={data.currency} onChange={(e) => onChange("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>
      </div>

      {/* Salary type */}
      <Field label="Salary Type" hint="Gross is before tax deductions, Net is take-home pay">
        <SegmentControl
          options={["Gross", "Net"]}
          value={data.salaryType}
          onChange={(v) => onChange("salaryType", v as CompensationInfo["salaryType"])}
        />
      </Field>

      {/* Payment frequency */}
      <Field label="Payment Frequency">
        <SegmentControl
          options={["Monthly", "Weekly"]}
          value={data.paymentFrequency}
          onChange={(v) => onChange("paymentFrequency", v as CompensationInfo["paymentFrequency"])}
        />
      </Field>

      {/* Bank account */}
      <Field label="Bank Account Number" hint="IBAN or local account number for payroll processing">
        <div className="relative">
          <Landmark size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="RS35 1234 0078 0000 0001 00"
            value={data.bankAccount}
            onChange={(e) => onChange("bankAccount", e.target.value)}
            className="pl-9"
          />
        </div>
      </Field>

      {/* Bonus eligible toggle */}
      <Toggle
        label="Bonus Eligible"
        description="Employee is eligible for performance-based bonuses"
        checked={data.bonusEligible}
        onChange={(v) => onChange("bonusEligible", v)}
      />

      {/* Summary preview */}
      {data.salaryAmount && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Salary Summary</p>
          <p className="text-2xl font-bold text-indigo-900">
            {data.currency} {Number(data.salaryAmount).toLocaleString()}
            <span className="text-sm font-medium text-indigo-500 ml-2">/ {data.paymentFrequency === "Monthly" ? "month" : "week"}</span>
          </p>
          <p className="text-xs text-indigo-500 mt-1">{data.salaryType} · {data.paymentFrequency} · {data.bonusEligible ? "Bonus eligible" : "No bonus"}</p>
        </div>
      )}
    </div>
  );
}
