"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import {
  JobPost, JobStatus, JobType, JobLocation,
  DEPARTMENTS, JOB_TYPES, LOCATION_TYPES,
} from "./mock";

type FormData = Omit<JobPost, "id" | "postedAt" | "applicants" | "closedAt">;

const EMPTY: FormData = {
  title: "", department: "Engineering", location: "", locationType: "Hybrid",
  type: "Full-time", salary: "", status: "Open",
  description: "", responsibilities: [""], requirements: [""], niceToHave: [""],
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  editing?: JobPost | null;
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const update = (i: number, val: string) => { const n = [...items]; n[i] = val; onChange(n); };
  const add    = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Add ${label.toLowerCase()} item…`}
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 placeholder-slate-400"
            />
            {items.length > 1 && (
              <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors">
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 placeholder-slate-400 transition bg-white";
const selectCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 bg-white";

export function JobFormModal({ open, onClose, onSave, editing }: Props) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const set = (k: keyof FormData, v: any) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (editing) {
      const { id, postedAt, applicants, closedAt, ...rest } = editing;
      setForm({ ...rest });
    } else {
      setForm(EMPTY);
    }
  }, [editing, open]);

  if (!open) return null;

  const valid = form.title.trim() && form.description.trim() && form.location.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-bold text-slate-900">{editing ? "Edit Position" : "Post New Position"}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">

          {/* row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Job Title">
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Senior Frontend Engineer" className={inputCls} />
            </Field>
            <Field label="Department">
              <select value={form.department} onChange={(e) => set("department", e.target.value)} className={selectCls}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          {/* row 2 */}
          <div className="grid grid-cols-3 gap-4">
            <Field label="Employment Type">
              <select value={form.type} onChange={(e) => set("type", e.target.value as JobType)} className={selectCls}>
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Work Mode">
              <select value={form.locationType} onChange={(e) => set("locationType", e.target.value as JobLocation)} className={selectCls}>
                {LOCATION_TYPES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value as JobStatus)} className={selectCls}>
                {(["Open","Draft","Closed"] as JobStatus[]).map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Belgrade, Serbia" className={inputCls} />
            </Field>
            <Field label="Salary Range">
              <input value={form.salary} onChange={(e) => set("salary", e.target.value)} placeholder="e.g. €3,000 – €4,500 / mo" className={inputCls} />
            </Field>
          </div>

          {/* description */}
          <Field label="Job Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Brief overview of the role…" className={`${inputCls} resize-none`} />
          </Field>

          {/* lists */}
          <ListEditor label="Responsibilities" items={form.responsibilities} onChange={(v) => set("responsibilities", v)} />
          <ListEditor label="Requirements"     items={form.requirements}     onChange={(v) => set("requirements", v)}     />
          <ListEditor label="Nice to Have"     items={form.niceToHave}       onChange={(v) => set("niceToHave", v)}       />

        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
          <button
            onClick={() => { if (valid) { onSave(form); onClose(); } }}
            disabled={!valid}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {editing ? "Save Changes" : "Publish Position"}
          </button>
        </div>
      </div>
    </div>
  );
}
