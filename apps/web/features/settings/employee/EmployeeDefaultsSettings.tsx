import React, { useState } from "react";
import {
  Field,
  Input,
  Select,
  Toggle,
} from "../../../components/components/FormFields";

interface EmployeeDefaultsFormData {
  employmentType: string;
  department: string;
  workLocation: string;
  workHours: string;
  payFrequency: string;
  autoEnrollBenefits: boolean;
}

export default function EmployeeDefaultsSettings() {
  const [formData, setFormData] = useState<EmployeeDefaultsFormData>({
    employmentType: "Full-Time",
    department: "Engineering",
    workLocation: "San Francisco, CA (HQ)",
    workHours: "40",
    payFrequency: "Bi-weekly",
    autoEnrollBenefits: true,
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
      autoEnrollBenefits: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Employment Details Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Employment Details
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Default values applied when creating new employee records
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Employment Type"
              required
              hint="Full-time, part-time, contract, etc."
            >
              <Select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </Select>
            </Field>

            <Field label="Department" required hint="Select default department">
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
              </Select>
            </Field>
          </div>

          <Field label="Work Location" required hint="Primary office location">
            <Select
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
            >
              <option value="San Francisco, CA (HQ)">
                San Francisco, CA (HQ)
              </option>
              <option value="New York, NY">New York, NY</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Compensation Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">Compensation</h3>
          <p className="text-xs text-slate-500 mt-1">
            Work hours and pay frequency settings
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Work Hours per Week" required hint="Standard hours">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="workHours"
                  value={formData.workHours}
                  onChange={handleChange}
                  placeholder="40"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  hours
                </span>
              </div>
            </Field>

            <Field
              label="Pay Frequency"
              required
              hint="How often employees are paid"
            >
              <Select
                name="payFrequency"
                value={formData.payFrequency}
                onChange={handleChange}
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Semi-monthly">Semi-monthly</option>
                <option value="Monthly">Monthly</option>
              </Select>
            </Field>
          </div>
        </div>
      </div>

      {/* Benefits Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">Benefits</h3>
          <p className="text-xs text-slate-500 mt-1">
            Automatic enrollment and benefits settings
          </p>
        </div>

        <div className="space-y-4">
          <Toggle
            label="Auto-enroll in Benefits"
            description="Automatically enroll new employees in the company benefits program"
            checked={formData.autoEnrollBenefits}
            onChange={handleToggle}
          />
        </div>
      </div>
    </div>
  );
}
