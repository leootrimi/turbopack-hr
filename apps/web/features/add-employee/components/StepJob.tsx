import { JobInfo, DEPARTMENTS, TEAMS, MANAGERS } from "./types";
import { Field, Input, Select, SegmentControl } from "../components/FormFields";
import { Briefcase, Calendar, Users, UserCheck } from "lucide-react";

interface Props {
  data: JobInfo;
  onChange: <K extends keyof JobInfo>(key: K, value: JobInfo[K]) => void;
}

export function StepJob({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Job Information</h2>
        <p className="text-sm text-slate-500 mt-0.5">Role details, team assignment and employment terms.</p>
      </div>

      {/* Job Title + Department */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job Title" required>
          <div className="relative">
            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="e.g. Senior Frontend Engineer"
              value={data.jobTitle}
              onChange={(e) => onChange("jobTitle", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Department" required>
          <Select value={data.department} onChange={(e) => onChange("department", e.target.value)}>
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </Select>
        </Field>
      </div>

      {/* Team + Manager */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Team">
          <div className="relative">
            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Select value={data.team} onChange={(e) => onChange("team", e.target.value)} className="pl-9">
              <option value="">Select team…</option>
              {TEAMS.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </div>
        </Field>
        <Field label="Reports To (Manager)">
          <div className="relative">
            <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Select value={data.manager} onChange={(e) => onChange("manager", e.target.value)} className="pl-9">
              <option value="">Select manager…</option>
              {MANAGERS.map((m) => <option key={m}>{m}</option>)}
            </Select>
          </div>
        </Field>
      </div>

      {/* Employment Type */}
      <Field label="Employment Type" required>
        <SegmentControl
          options={["Full-time", "Part-time", "Contractor"]}
          value={data.employmentType}
          onChange={(v) => onChange("employmentType", v as JobInfo["employmentType"])}
        />
      </Field>

      {/* Work Location */}
      <Field label="Work Location" required>
        <SegmentControl
          options={["Office", "Remote", "Hybrid"]}
          value={data.workLocation}
          onChange={(v) => onChange("workLocation", v as JobInfo["workLocation"])}
        />
      </Field>

      {/* Start + End Date */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date" required>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="End Date" hint="Leave blank for permanent positions">
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
      </div>
    </div>
  );
}
