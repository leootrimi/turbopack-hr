import { EmployeeForm } from "./types";
import { User, Briefcase, Banknote, CheckCircle2 } from "lucide-react";

interface Props {
  form: EmployeeForm;
}

function ReviewSection({ icon: Icon, title, rows }: {
  icon: React.ElementType;
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
          <Icon size={14} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {rows.filter((r) => r.value).map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between px-5 py-3 gap-4">
            <span className="text-xs text-slate-400 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepReview({ form }: Props) {
  const { personal, job, compensation } = form;
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Review & Confirm</h2>
        <p className="text-sm text-slate-500 mt-0.5">Please review the details below before creating the employee profile.</p>
      </div>

      {/* avatar preview */}
      {fullName && (
        <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl text-white">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
            {personal.firstName[0]}{personal.lastName[0]}
          </div>
          <div>
            <p className="font-bold text-base">{fullName}</p>
            <p className="text-slate-400 text-sm">{job.jobTitle || "—"} · {job.department || "—"}</p>
          </div>
          <div className="ml-auto">
            <CheckCircle2 size={20} className="text-green-400" />
          </div>
        </div>
      )}

      <ReviewSection
        icon={User}
        title="Personal Information"
        rows={[
          { label: "Full Name",          value: fullName                     },
          { label: "Email",              value: personal.email               },
          { label: "Personal Email",    value: personal.personalEmail ?? "" },
          { label: "Phone",              value: personal.phone               },
          { label: "Date of Birth",      value: personal.dateOfBirth         },
          { label: "Personal Number",    value: personal.personalNumber      },
          { label: "Address",            value: personal.address             },
          { label: "Emergency Contact",  value: personal.emergencyContact    },
        ]}
      />

      <ReviewSection
        icon={Briefcase}
        title="Job Information"
        rows={[
          { label: "Job Title",          value: job.jobTitle                 },
          { label: "Department",         value: job.department               },
          { label: "Team",               value: job.team                     },
          { label: "Manager",            value: job.manager                  },
          { label: "Employment Type",    value: job.employmentType           },
          { label: "Work Location",      value: job.workLocation             },
          { label: "Start Date",         value: job.startDate                },
          { label: "End Date",           value: job.endDate || "Permanent"   },
        ]}
      />

      <ReviewSection
        icon={Banknote}
        title="Compensation & Payroll"
        rows={[
          { label: "Salary",             value: `${compensation.currency} ${Number(compensation.salaryAmount || 0).toLocaleString()} (${compensation.salaryType})` },
          { label: "Payment Frequency",  value: compensation.paymentFrequency },
          { label: "Bank Account",       value: compensation.bankAccount      },
          { label: "Bonus Eligible",     value: compensation.bonusEligible ? "Yes" : "No" },
        ]}
      />
    </div>
  );
}
