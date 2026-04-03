"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, FileText, User, CheckCircle, AlertCircle, Upload, X, Clock, Send } from "lucide-react";
import { useCreateTimeOff, useTimeOffBalance, useEnabledTimeOffTypes } from "../hooks/use-time-off";
import { formatDate } from "@/lib/utils";

interface FormState {
  type: string;
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

export function RequestForm({ onSubmit }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const { mutate: createRequest, isPending: submitting } = useCreateTimeOff();
  const { data: balanceRow } = useTimeOffBalance();
  const { data: timeOffTypes, isLoading: typesLoading } = useEnabledTimeOffTypes();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    attachCertificate: false,
    halfDay: false,
    attachmentName: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const list = timeOffTypes;
    const first = list?.[0];
    if (!list?.length || !first) return;
    setForm((f) => {
      if (list.some((t) => t.name === f.type)) return f;
      return { ...f, type: first.name };
    });
  }, [timeOffTypes]);

  const days = form.halfDay ? 0.5 : countWorkdays(form.startDate, form.endDate);
  
  let remaining = 0;
  let totalLimit = 1;
  if (balanceRow && Array.isArray(balanceRow)) {
    const b = balanceRow.find((r: any) => r.typeName === form.type);
    if (b) {
      remaining = Number(b.total || 0) - Number(b.used || 0);
      totalLimit = Number(b.total || 1);
    }
  }

  const overLimit = days > remaining;
  const needsCert = /sick/i.test(form.type) && days > 2;
  const isValid =
    form.type &&
    form.startDate &&
    form.endDate &&
    !overLimit &&
    days > 0;

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
            const first = timeOffTypes?.[0]?.name ?? "";
            setForm({
              type: first,
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
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      set("attachmentName", file.name);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    set("attachmentName", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (typesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading leave types…</p>
      </div>
    );
  }

  if (!timeOffTypes?.length) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-900">
        No time off types are available. Contact HR to configure leave types in Settings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-800">Request Time Off</h2>
        <p className="text-xs text-slate-500 mt-1">Submit a leave request for approval</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
          <User size={12} className="text-slate-400" />
          Leave Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeOffTypes.map((t) => {
            const active = form.type === t.name;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => set("type", t.name)}
                className={`
                  group relative p-3 rounded-xl text-left transition-all duration-200
                  ${active 
                    ? 'bg-white shadow-md ring-2 ring-indigo-500/20 border-transparent' 
                    : 'bg-slate-50/80 border border-slate-200 hover:border-slate-300 hover:bg-white'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${active ? 'text-slate-800' : 'text-slate-600'}`}>
                    {t.name}
                  </span>
                </div>
                {active && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={12} className="text-indigo-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={12} className="text-slate-400" />
            Start Date
          </label>
          <div className={`relative transition-all duration-200 ${focusedField === 'start' ? 'scale-[1.01]' : ''}`}>
            <input
              type="date"
              min={today}
              value={form.startDate}
              onFocus={() => setFocusedField('start')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => {
                set("startDate", e.target.value);
                if (e.target.value > form.endDate) set("endDate", e.target.value);
              }}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400 transition-all bg-white"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <Calendar size={12} className="text-slate-400" />
            End Date
          </label>
          <div className={`relative transition-all duration-200 ${focusedField === 'end' ? 'scale-[1.01]' : ''}`}>
            <input
              type="date"
              min={form.startDate || today}
              value={form.endDate}
              onFocus={() => setFocusedField('end')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => set("endDate", e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400 transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-slate-500" />
          <span className="text-sm text-slate-700">Half day request</span>
          <span className="text-[11px] text-slate-400">(0.5 days)</span>
        </div>
        <button
          onClick={() => set("halfDay", !form.halfDay)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300
            ${form.halfDay ? 'bg-indigo-500 shadow-sm shadow-indigo-200' : 'bg-slate-300'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-all duration-300
              ${form.halfDay ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {form.startDate && form.endDate && (
        <div className={`
          rounded-xl p-4 transition-all duration-200
          ${overLimit 
            ? 'bg-gradient-to-r from-red-50 to-red-50/30 border border-red-100' 
            : 'bg-gradient-to-r from-indigo-50 to-blue-50/30 border border-indigo-100'
          }
        `}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500">Request Summary</p>
              <p className="text-lg font-semibold text-slate-800">
                {days} {days === 1 ? 'day' : 'days'}
              </p>
              <p className="text-xs text-slate-500">
                {formatDate(form.startDate)} → {formatDate(form.endDate)}
              </p>
            </div>
            <div className="text-right">
              <div className={`
                text-2xl font-bold
                ${overLimit ? 'text-red-500' : 'text-indigo-600'}
              `}>
                {remaining}
              </div>
              <p className="text-[11px] text-slate-500">days remaining</p>
            </div>
          </div>
          
          {!overLimit && (
            <div className="mt-3">
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${(days / (totalLimit || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alerts - Modern */}
      {overLimit && (
        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border-l-4 border-red-500">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Insufficient balance</p>
            <p className="text-xs text-red-600 mt-0.5">
              You have <strong>{remaining}</strong> days remaining. Please adjust your request.
            </p>
          </div>
        </div>
      )}

      {needsCert && !overLimit && (
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border-l-4 border-amber-400">
          <FileText size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Medical certificate required</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Sick leave over 2 days requires a medical certificate. Please attach one below.
            </p>
          </div>
        </div>
      )}

      {/* Reason - Modern Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
          <FileText size={12} className="text-slate-400" />
          Reason (optional)
        </label>
        <textarea
          value={form.reason}
          onChange={(e) => set("reason", e.target.value)}
          placeholder="Add a note for your manager..."
          rows={3}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder-slate-400 transition-all resize-none bg-white"
        />
      </div>

      {/* File Upload - Modern Drag & Drop Style */}
      {/sick/i.test(form.type) && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <Upload size={12} className="text-slate-400" />
            Medical Certificate
          </label>
          
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <Upload size={28} className="mx-auto text-slate-400 group-hover:text-indigo-400 transition-colors mb-2" />
              <p className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
                Click to upload
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, PNG, JPG up to 5MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submit Button - Modern */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || submitting || submitted}
        className={`
          w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
          flex items-center justify-center gap-2
          ${submitted 
            ? 'bg-emerald-500 text-white' 
            : isValid 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-200 hover:shadow-indigo-300' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }
        `}
      >
        {submitted ? (
          <>
            <CheckCircle size={16} />
            Request Submitted!
          </>
        ) : submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={14} />
            Submit Request
          </>
        )}
      </button>

      {/* Footer Note */}
      <p className="text-center text-[11px] text-slate-400">
        Requests are subject to manager approval
      </p>
    </div>
  );
}