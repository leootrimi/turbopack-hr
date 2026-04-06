import { useFormContext, Controller } from "react-hook-form";
import { Field, Input, Select, SegmentControl } from "../../../components/components/FormFields";
import { Briefcase, Calendar, Users, UserCheck } from "lucide-react";
import { useTeamSelect } from "../hooks/queries";
import { EmployeeForm, DEPARTMENTS } from "@repo/types";

export function StepJob() {
  const { data: teams } = useTeamSelect();
  const { register, control, formState: { errors } } = useFormContext<EmployeeForm>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Job Information</h2>
        <p className="text-sm text-slate-500 mt-0.5">Role details, team assignment and employment terms.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Job Title" required error={errors.job?.jobTitle?.message}>
          <div className="relative">
            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="e.g. Senior Frontend Engineer"
              {...register("job.jobTitle")}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Department" required error={errors.job?.department?.message}>
          <Select {...register("job.department")}>
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Team" required error={errors.job?.teamId?.message}>
          <div className="relative">
            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Select {...register("job.teamId")} className="pl-9">
              <option value="">Select team…</option>
              {teams?.map((t) => <option key={t.teamId} value={t.teamId}>{t.teamName}</option>)}
            </Select>
          </div>
        </Field>
        <Field label="Reports To (Manager)" required error={errors.job?.managerId?.message}>
          <div className="relative">
            <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Select {...register("job.managerId")} className="pl-9">
              <option value="">Select manager…</option>
              {teams?.map((m) => <option key={m.leaderId} value={m.leaderId}>{m.leaderName}</option>)}
            </Select>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date" required error={errors.job?.startDate?.message}>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              {...register("job.startDate")}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="End Date" hint="Leave blank for permanent positions" error={errors.job?.endDate?.message}>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              {...register("job.endDate")}
              className="pl-9"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
