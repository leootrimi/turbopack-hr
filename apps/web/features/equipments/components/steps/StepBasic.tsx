import { Field, Input, Textarea } from "@/components/components/FormFields";
import { BasicInfo } from "@repo/types";
import { Tag, Hash, FileText } from "lucide-react";
import { CATEGORIES, CATEGORY_ICONS } from "../types";

interface Props {
  data: BasicInfo;
  onChange: <K extends keyof BasicInfo>(key: K, value: BasicInfo[K]) => void;
}

export function StepBasic({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
        <p className="text-sm text-slate-500 mt-0.5">Core details that identify this piece of equipment.</p>
      </div>

      <Field label="Category" required>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => {
            const active = data.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange("category", cat)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-center transition-all ${
                  active
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                <span className={`text-[10px] font-semibold leading-tight ${active ? "text-indigo-700" : "text-slate-500"}`}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Equipment Name" required hint="e.g. MacBook Pro 14-inch (2023)">
        <Input
          placeholder="Enter equipment name…"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Brand" required>
          <Input
            placeholder="e.g. Apple, Dell, Samsung"
            value={data.brand}
            onChange={(e) => onChange("brand", e.target.value)}
          />
        </Field>
        <Field label="Model" required>
          <Input
            placeholder="e.g. MacBook Pro M3"
            value={data.model}
            onChange={(e) => onChange("model", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Serial Number" hint="Found on the device label">
          <div className="relative">
            <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="SN-XXXXXXXXXX"
              value={data.serialNumber}
              onChange={(e) => onChange("serialNumber", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Asset Tag / Internal ID" hint="Your internal tracking ID">
          <div className="relative">
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="AST-001"
              value={data.assetTag}
              onChange={(e) => onChange("assetTag", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      <Field label="Description" hint="Optional — any additional notes about this equipment">
        <div className="relative">
          <FileText size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <Textarea
            placeholder="e.g. Space Grey, includes charger and carry bag…"
            rows={3}
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="pl-9"
          />
        </div>
      </Field>
    </div>
  );
}
