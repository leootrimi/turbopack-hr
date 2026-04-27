"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useUpdateEmployee } from "../../hooks/queries";
import { 
  DEPARTMENTS, 
  EmploymentTypeSchema, 
  SalaryTypeSchema, 
  WorkLocationSchema,
  CurrencySchema 
} from "@repo/types";

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  employeeId: string;
}

type SubmitStatus = "idle" | "success" | "error";

const emptyForm = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    personalEmail: "",
    phone: "",
    dateOfBirth: "",
    personalNumber: "",
    address: "",
    emergencyContact: "",
  },
  job: {
    jobTitle: "",
    department: "",
    teamId: "",
    managerId: "",
    startDate: "",
    endDate: "",
    employmentType: "Full-time",
    workLocation: "Office",
  },
  compensation: {
    salaryAmount: "",
    salaryType: "Gross",
    currency: "EUR",
    bankAccount: "",
    bonusEligible: false,
  },
};

export function EditEmployeeModal({ open, onOpenChange, employee, employeeId }: EditEmployeeModalProps) {
  const [form, setForm] = useState(emptyForm);
  const updateEmployee = useUpdateEmployee(employeeId);
  const [activeTab, setActiveTab] = useState("personal");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  }, [open]);

  useEffect(() => {
    if (employee && open) {
      setForm({
        personal: {
          firstName: employee.personal?.firstName || "",
          lastName: employee.personal?.lastName || "",
          email: employee.personal?.email || "",
          personalEmail: employee.personal?.personalEmail || "",
          phone: employee.personal?.phone || "",
          dateOfBirth: employee.personal?.dateOfBirth 
            ? new Date(employee.personal.dateOfBirth).toISOString().split("T")[0]
            : "",
          personalNumber: employee.personal?.personalNumber || "",
          address: employee.personal?.address || "",
          emergencyContact: employee.personal?.emergencyContact || "",
        },
        job: {
          jobTitle: employee.job?.jobTitle || "",
          department: employee.job?.department || "",
          teamId: employee.job?.teamId?.toString() || "",
          managerId: employee.job?.managerId?.toString() || "",
          startDate: employee.job?.startDate 
            ? new Date(employee.job.startDate).toISOString().split("T")[0]
            : "",
          endDate: employee.job?.endDate 
            ? new Date(employee.job.endDate).toISOString().split("T")[0]
            : "",
          employmentType: employee.job?.employmentType || "Full-time",
          workLocation: employee.job?.workLocation || "Office",
        },
        compensation: {
          salaryAmount: employee.compensation?.salaryAmount?.toString() || "",
          salaryType: employee.compensation?.salaryType || "Gross",
          currency: employee.compensation?.currency || "EUR",
          bankAccount: employee.compensation?.bankAccount || "",
          bonusEligible: employee.compensation?.bonusEligible || false,
        },
      });
    }
  }, [employee, open]);

  const handleChange = (section: "personal" | "job" | "compensation", field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmitStatus("idle");
    setErrorMessage("");
    try {
      const payload: any = {};

      if (form.personal.firstName || form.personal.lastName || form.personal.email) {
        payload.personal = {
          ...form.personal,
          dateOfBirth: form.personal.dateOfBirth || null,
        };
      }

      if (form.job.jobTitle || form.job.department) {
        payload.job = {
          ...form.job,
          teamId: form.job.teamId ? parseInt(form.job.teamId, 10) : null,
          managerId: form.job.managerId ? parseInt(form.job.managerId, 10) : null,
          startDate: form.job.startDate || null,
          endDate: form.job.endDate || null,
        };
      }

      if (form.compensation.salaryAmount !== "") {
        payload.compensation = {
          ...form.compensation,
          salaryAmount: parseFloat(form.compensation.salaryAmount) || null,
          bonusEligible: form.compensation.bonusEligible,
        };
      }

      await updateEmployee.mutateAsync(payload);
      setSubmitStatus("success");
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (error: any) {
      setSubmitStatus("error");
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to update employee");
    }
  };

  if (!employee) return null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/60">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Edit Employee - {employee.personal?.firstName} {employee.personal?.lastName}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X size={14} className="mx-auto" />
            </button>
          </div>

          <div className="flex gap-1 mt-4">
            {["personal", "job", "compensation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 max-h-[60vh]">
          {activeTab === "personal" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.firstName}
                  onChange={(e) => handleChange("personal", "firstName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.lastName}
                  onChange={(e) => handleChange("personal", "lastName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.email}
                  onChange={(e) => handleChange("personal", "email", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.personalEmail}
                  onChange={(e) => handleChange("personal", "personalEmail", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.phone}
                  onChange={(e) => handleChange("personal", "phone", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.personalNumber}
                  onChange={(e) => handleChange("personal", "personalNumber", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.dateOfBirth}
                  onChange={(e) => handleChange("personal", "dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.emergencyContact}
                  onChange={(e) => handleChange("personal", "emergencyContact", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.personal.address}
                  onChange={(e) => handleChange("personal", "address", e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "job" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.jobTitle}
                  onChange={(e) => handleChange("job", "jobTitle", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.department}
                  onChange={(e) => handleChange("job", "department", e.target.value)}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.employmentType}
                  onChange={(e) => handleChange("job", "employmentType", e.target.value)}
                >
                  {EmploymentTypeSchema.options.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work Location</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.workLocation}
                  onChange={(e) => handleChange("job", "workLocation", e.target.value)}
                >
                  {WorkLocationSchema.options.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.startDate}
                  onChange={(e) => handleChange("job", "startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.endDate}
                  onChange={(e) => handleChange("job", "endDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Team ID</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.teamId}
                  onChange={(e) => handleChange("job", "teamId", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manager ID</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.job.managerId}
                  onChange={(e) => handleChange("job", "managerId", e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "compensation" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Salary Amount</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.compensation.salaryAmount}
                  onChange={(e) => handleChange("compensation", "salaryAmount", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Salary Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.compensation.salaryType}
                  onChange={(e) => handleChange("compensation", "salaryType", e.target.value)}
                >
                  {SalaryTypeSchema.options.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.compensation.currency}
                  onChange={(e) => handleChange("compensation", "currency", e.target.value)}
                >
                  {CurrencySchema.options.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={form.compensation.bankAccount}
                  onChange={(e) => handleChange("compensation", "bankAccount", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.compensation.bonusEligible}
                    onChange={(e) => handleChange("compensation", "bonusEligible", e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="font-medium text-slate-700">Bonus Eligible</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {submitStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Employee updated successfully!</span>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={updateEmployee.isPending || submitStatus === "success"}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {updateEmployee.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}