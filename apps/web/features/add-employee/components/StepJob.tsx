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

      {/* Job Title + Department */}
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

      {/* Team + Manager */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Team" required error={errors.job?.team?.message}>
          <div className="relative">
            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Select {...register("job.team")} className="pl-9">
              <option value="">Select team…</option>
              {teams?.map((t) => <option key={t.teamId}>{t.teamName}</option>)}
            </Select>
          </div>
        </Field>
        <Field label="Reports To (Manager)" required error={errors.job?.manager?.message}>
          <div className="relative">
            <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Select {...register("job.manager")} className="pl-9">
              <option value="">Select manager…</option>
              {teams?.map((m) => <option key={m.leaderId}>{m.leaderName}</option>)}
            </Select>
          </div>
        </Field>
      </div>

      {/* Employment Type */}
      <Field label="Employment Type" required error={errors.job?.employmentType?.message}>
        <Controller
          name="job.employmentType"
          control={control}
          render={({ field }) => (
            <SegmentControl
              options={["Full-time", "Part-time", "Contractor"]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      {/* Work Location */}
      <Field label="Work Location" required error={errors.job?.workLocation?.message}>
        <Controller
          name="job.workLocation"
          control={control}
          render={({ field }) => (
            <SegmentControl
              options={["Office", "Remote", "Hybrid"]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      {/* Start + End Date */}
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
