import { Field, Input, Select, Textarea } from "@/components/components/FormFields";
import { AssignmentInfo, EquipmentLocation } from "@repo/types";
import { UserCheck, Calendar, MapPin, StickyNote } from "lucide-react";
import { EMPLOYEES, LOCATIONS } from "../types";

interface Props {
  data: AssignmentInfo;
  onChange: <K extends keyof AssignmentInfo>(key: K, value: AssignmentInfo[K]) => void;
  equipmentStatus: string;
}

const LOCATION_ICONS: Record<EquipmentLocation, string> = {
  Office:    "🏢",
  Remote:    "🏠",
  Warehouse: "🏭",
};

export function StepAssignment({ data, onChange, equipmentStatus }: Props) {
  const isAssigned = equipmentStatus === "Assigned";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Assignment & Management</h2>
        <p className="text-sm text-slate-500 mt-0.5">Who has this equipment and where is it located.</p>
      </div>

      <Field
        label="Assigned To"
        hint={!isAssigned ? "Optional — only required if status is 'Assigned'" : undefined}
      >
        <div className="relative">
          <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Select
            value={data.assignedTo}
            onChange={(e) => onChange("assignedTo", e.target.value)}
            className="pl-9"
          >
            <option value="">— Unassigned —</option>
            {EMPLOYEES.map((e) => <option key={e}>{e}</option>)}
          </Select>
        </div>
        {isAssigned && !data.assignedTo && (
          <p className="text-[11px] text-amber-500 font-medium mt-1">
            ⚠️ Status is "Assigned" — please select an employee.
          </p>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Assignment Date">
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={data.assignmentDate}
              onChange={(e) => onChange("assignmentDate", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Return Due Date" hint="Optional">
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              min={data.assignmentDate}
              value={data.returnDueDate}
              onChange={(e) => onChange("returnDueDate", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      <Field label="Location" required>
        <div className="grid grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => {
            const active = data.location === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => onChange("location", loc)}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                  active
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-2xl">{LOCATION_ICONS[loc]}</span>
                <span className={`text-xs font-bold ${active ? "text-indigo-700" : "text-slate-400"}`}>
                  {loc}
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Notes" hint="Any additional information about this assignment">
        <div className="relative">
          <StickyNote size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <Textarea
            placeholder="e.g. Assigned for remote work, includes docking station…"
            rows={3}
            value={data.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="pl-9"
          />
        </div>
      </Field>
    </div>
  );
}
