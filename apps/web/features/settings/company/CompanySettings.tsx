import React, { useState } from "react";
import {
  Field,
  Input,
  Select,
} from "../../../components/components/FormFields";

interface CompanyFormData {
  companyName: string;
  industry: string;
  companySize: string;
  headquarters: string;
  fiscalYear: string;
}

export default function CompanySettings() {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "Acme Corporation",
    industry: "Technology",
    companySize: "51-200",
    headquarters: "123 Business Street, San Francisco, CA 94105",
    fiscalYear: "January",
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

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Basic Information
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Company details and general information
          </p>
        </div>

        <div className="space-y-4">
          <Field
            label="Company Name"
            required
            hint="This is how your company appears in the system"
          >
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Industry"
              required
              hint="Select your primary industry"
            >
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </Select>
            </Field>

            <Field label="Company Size" required hint="Number of employees">
              <Select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
              >
                <option value="1-50">1-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1000+">1000+</option>
              </Select>
            </Field>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">Location</h3>
          <p className="text-xs text-slate-500 mt-1">
            Primary office and headquarters information
          </p>
        </div>

        <div className="space-y-4">
          <Field
            label="Headquarters Address"
            required
            hint="Main office location"
          >
            <Input
              type="text"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleChange}
              placeholder="Enter full address"
            />
          </Field>
        </div>
      </div>

      {/* Financial Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Financial Configuration
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Accounting and fiscal period settings
          </p>
        </div>

        <div className="space-y-4">
          <Field
            label="Fiscal Year Start"
            required
            hint="When your fiscal year begins"
          >
            <Select
              name="fiscalYear"
              value={formData.fiscalYear}
              onChange={handleChange}
            >
              <option value="January">January</option>
              <option value="April">April</option>
              <option value="July">July</option>
              <option value="October">October</option>
            </Select>
          </Field>
        </div>
      </div>
    </div>
  );
}
