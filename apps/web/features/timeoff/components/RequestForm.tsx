"use client";

import { useState } from "react";
import { Send, CalendarDays, Info } from "lucide-react";
import { LeaveType, LEAVE_CONFIG, LEAVE_BALANCES } from "./mock";

import { useCreateTimeOff } from "../hooks/use-time-off";

interface FormState {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  attachCertificate: boolean;
  halfDay: boolean;
  attachmentName?: string;
}

interface Props {
  onSubmit: (data: FormState & { days: number }) => void;
}

const TYPES = Object.keys(LEAVE_CONFIG) as LeaveType[];

function countWorkdays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function formatDateDisplay(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function RequestForm({ onSubmit }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const { mutate: createRequest, isPending: submitting } = useCreateTimeOff();

  const [form, setForm] = useState<FormState>({
    type: "Vacation",
    startDate: "",
    endDate: "",
    reason: "",
    attachCertificate: false,
    halfDay: false,
    attachmentName: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const days = form.halfDay ? 0.5 : countWorkdays(form.startDate, form.endDate);
  const balance = LEAVE_BALANCES.find((b) => b.type === form.type);
  const remaining = balance ? balance.total - balance.used : 0;
  const cfg = LEAVE_CONFIG[form.type];
  const overLimit = days > remaining;
  const needsCert = form.type === "Sick Leave" && days > 2;
  const isValid = form.startDate && form.endDate && !overLimit && days > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    createRequest(
      {
        ...form,
        days,
        attachmentName: selectedFile?.name,
      },
      {
        onSuccess: () => {
          onSubmit({ ...form, days, attachmentName: selectedFile?.name });
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setForm({
              type: "Vacation",
              startDate: "",
              endDate: "",
              reason: "",
              attachCertificate: false,
              halfDay: false,
              attachmentName: "",
            });
            setSelectedFile(null);
          }, 2000);
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400 transition bg-white";

  return (
    <div className="space-y-5">

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Leave Type</label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const c = LEAVE_CONFIG[t];
            const active = form.type === t;
            return (
              <button
                key={t}
                onClick={() => set("type", t)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: active ? c.color : "#e2e8f0",
                  backgroundColor: active ? c.bg : "white",
                }}
              >
                <span className="text-base">{c.icon}</span>
                <span className="text-xs font-semibold" style={{ color: active ? c.text : "#64748b" }}>
                  {t}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">From</label>
          <div className="relative">
            <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              min={today}
              value={form.startDate}
              onChange={(e) => {
                set("startDate", e.target.value);
                if (e.target.value > form.endDate) set("endDate", e.target.value);
              }}
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">To</label>
          <div className="relative">
            <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="date"
              min={form.startDate || today}
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => set("halfDay", !form.halfDay)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.halfDay ? "bg-indigo-600" : "bg-slate-200"}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${form.halfDay ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
        <span className="text-xs font-semibold text-slate-600">Half day only</span>
      </div>

      {form.startDate && form.endDate && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl border"
          style={{ borderColor: overLimit ? "#fecaca" : cfg.color + "40", backgroundColor: overLimit ? "#fef2f2" : cfg.bg }}
        >
          <div>
            <p className="text-xs font-bold" style={{ color: overLimit ? "#991b1b" : cfg.text }}>
              {days} working day{days !== 1 ? "s" : ""} requested
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: overLimit ? "#ef4444" : cfg.color + "cc" }}>
              {formatDateDisplay(form.startDate)} → {formatDateDisplay(form.endDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: overLimit ? "#ef4444" : cfg.color }}>
              {remaining}
            </p>
            <p className="text-[10px]" style={{ color: overLimit ? "#ef4444" : cfg.color + "99" }}>days left</p>
          </div>
        </div>
      )}

      {overLimit && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl">
          <Info size={13} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600">You don't have enough days for this request. You have <strong>{remaining}</strong> days remaining.</p>
        </div>
      )}

      {/* Sick leave cert notice */}
      {needsCert && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
          <Info size={13} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">Sick leave over 2 days requires a medical certificate. Please attach one below or bring it on your return.</p>
        </div>
      )}

      {/* Reason */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Reason <span className="text-slate-400 font-normal normal-case">(optional)</span>
        </label>
        <textarea
          value={form.reason}
          onChange={(e) => set("reason", e.target.value)}
          placeholder="Add a note for your manager…"
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {form.type === "Sick Leave" && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Medical Certificate</label>
          <div 
            className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-slate-300 transition-colors cursor-pointer relative"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            {selectedFile ? (
              <div>
                <p className="text-xs font-semibold text-indigo-600">Selected: {selectedFile.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Click to change</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-500">Click to upload or drag & drop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, PNG or JPG up to 5MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || submitted}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: submitted ? "#22c55e" : "#0f172a",
          color: "white",
        }}
      >
        {submitted ? (
          "✓ Request Submitted!"
        ) : (
          <><Send size={14} /> Submit Request</>
        )}
      </button>
    </div>
  );
}
