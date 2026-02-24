import React, { useState } from "react";
import {
  Field,
  Input,
  Select,
  Toggle,
} from "../../../components/components/FormFields";

interface TimeOffFormData {
  annualPto: string;
  sickDays: string;
  paidHolidays: string;
  accrualMethod: string;
  allowCarryover: boolean;
}

export default function TimeOffSettings() {
  const [formData, setFormData] = useState<TimeOffFormData>({
    annualPto: "20",
    sickDays: "10",
    paidHolidays: "8",
    accrualMethod: "Annual (awarded on anniversary date)",
    allowCarryover: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allowCarryover: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* PTO Policy Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Time Off Entitlements
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Default annual time off allowances for new employees
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Annual PTO" required hint="Days per year">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="annualPto"
                  value={formData.annualPto}
                  onChange={handleChange}
                  placeholder="20"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  days
                </span>
              </div>
            </Field>

            <Field label="Sick Days" required hint="Days per year">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="sickDays"
                  value={formData.sickDays}
                  onChange={handleChange}
                  placeholder="10"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  days
                </span>
              </div>
            </Field>

            <Field label="Paid Holidays" required hint="Days per year">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="paidHolidays"
                  value={formData.paidHolidays}
                  onChange={handleChange}
                  placeholder="8"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  days
                </span>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Accrual Policy Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Accrual & Carryover
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            How PTO is earned and carried over to the next year
          </p>
        </div>

        <div className="space-y-4">
          <Field
            label="Accrual Method"
            required
            hint="How PTO is distributed annually"
          >
            <Select
              name="accrualMethod"
              value={formData.accrualMethod}
              onChange={handleChange}
            >
              <option value="Annual (awarded on anniversary date)">
                Annual (awarded on anniversary date)
              </option>
              <option value="Monthly accrual">Monthly accrual</option>
              <option value="No accrual policy">No accrual policy</option>
            </Select>
          </Field>

          <Toggle
            label="Allow PTO Carryover"
            description="Employees can carry up to 5 unused PTO days into the next year"
            checked={formData.allowCarryover}
            onChange={handleToggle}
          />
        </div>
      </div>
    </div>
  );
}
