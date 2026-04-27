"use client";

import { useState, useRef } from "react";
import { ArrowLeft, MapPin, Clock, Wifi, Building2, Send, CheckCircle2, Upload, X } from "lucide-react";
import { JobPost } from "./mock";
import { DeptBadge, TypeBadge, formatDate } from "./shared";
import { useApplyForJob } from "../hooks/queries";
import { uploadCv } from "../api";

interface Props {
  job: JobPost;
  onBack: () => void;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.filter(Boolean).map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function JobDetailPage({ job, onBack }: Props) {
  const applyMutation = useApplyForJob();
  const [applied, setApplied]   = useState(false);
  const [form, setForm]         = useState({ name: "", email: "", cvUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const locationIcon =
    job.locationType === "Remote" ? <Wifi size={14} /> :
    job.locationType === "Hybrid" ? <Building2 size={14} /> :
                                     <MapPin size={14} />;

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setCvFile(file);
    setUploading(true);

    try {
      const url = await uploadCv(file);
      setForm((f) => ({ ...f, cvUrl: url }));
    } catch (error) {
      console.error("Failed to upload CV:", error);
      alert("Failed to upload CV. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeCv = () => {
    setCvFile(null);
    setForm((f) => ({ ...f, cvUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApply = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    
    try {
      await applyMutation.mutateAsync({
        jobId: job.id,
        name: form.name,
        email: form.email,
        cvUrl: form.cvUrl || undefined,
      });
      setApplied(true);
    } catch (error) {
      console.error("Failed to submit application:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const submitting = applyMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* back */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft size={15} /> Back to positions
        </button>

        {/* hero card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-3">
              <DeptBadge dept={job.department} />
              <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">{locationIcon} {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {job.type}</span>
                <span className="text-slate-300">·</span>
                <span>Posted {formatDate(job.postedAt)}</span>
              </div>
              {job.salary && (
                <p className="text-lg font-bold text-indigo-600">{job.salary}</p>
              )}
            </div>
            <TypeBadge type={job.type} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* left — job details */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">About the Role</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Responsibilities</h2>
                <BulletList items={job.responsibilities} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Requirements</h2>
                <BulletList items={job.requirements} />
              </div>

              {job.niceToHave.filter(Boolean).length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Nice to Have</h2>
                  <BulletList items={job.niceToHave} />
                </div>
              )}
            </div>
          </div>

          {/* right — apply */}
          <div className="space-y-4">
            {applied ? (
              <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} className="text-green-500" />
                </div>
                <h3 className="font-bold text-slate-900">Application Sent!</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thank you for applying. We'll be in touch within 5–7 business days.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h2 className="text-sm font-bold text-slate-900">Apply for this role</h2>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 placeholder-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 placeholder-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Upload CV <span className="text-slate-400 font-normal">(PDF or Word, max 5MB)</span></label>
                    {cvFile ? (
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-sm text-slate-600 truncate">{cvFile.name}</span>
                        <button type="button" onClick={removeCv} className="text-slate-400 hover:text-slate-600">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-slate-300 transition-colors"
                      >
                        {uploading ? (
                          <span className="text-sm text-slate-400">Uploading...</span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Upload size={20} className="text-slate-400" />
                            <span className="text-xs text-slate-400">Click to upload your CV</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={!form.name.trim() || !form.email.trim() || submitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="animate-pulse">Submitting…</span>
                  ) : (
                    <><Send size={14} /> Submit Application</>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center">We respect your privacy. No spam, ever.</p>
              </div>
            )}

            {/* quick info card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Position Info</h3>
              {[
                { label: "Department", value: job.department },
                { label: "Type",       value: job.type       },
                { label: "Mode",       value: job.locationType },
                { label: "Location",   value: job.location   },
                ...(job.salary ? [{ label: "Salary", value: job.salary }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 text-xs">{label}</span>
                  <span className="font-semibold text-slate-700 text-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
