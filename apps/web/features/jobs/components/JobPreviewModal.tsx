"use client";

import { X, Calendar, Users } from "lucide-react";
import { JobPost } from "./mock";
import { DeptBadge, LocationBadge, StatusBadge, TypeBadge } from "./shared";

interface Props {
  job: JobPost | null;
  onClose: () => void;
}

export function JobPreviewModal({ job, onClose }: Props) {
  if (!job) return null;

  const sections = [
    { label: "Responsibilities", items: job.responsibilities },
    { label: "Requirements", items: job.requirements },
    { label: "Nice to Have", items: job.niceToHave },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/60">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={job.status} />
                <DeptBadge dept={job.department} />
                <TypeBadge type={job.type} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
              <div className="flex items-center gap-3 flex-wrap text-sm text-slate-500">
                <LocationBadge locationType={job.locationType} location={job.location} />
                {job.salary && <span className="font-semibold text-indigo-600">{job.salary}</span>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X size={14} className="mx-auto" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 flex items-center gap-2 text-sm text-slate-600">
              <Calendar size={14} className="text-slate-500" />
              Posted{" "}
              {job.postedAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 flex items-center gap-2 text-sm text-slate-600">
              <Users size={14} className="text-slate-500" />
              {job.applicants} applicants
            </div>
          </div>

          {sections.map(({ label, items }) => {
            const validItems = items.filter(Boolean);
            if (validItems.length === 0) return null;

            return (
              <section key={label} className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</h3>
                <ul className="space-y-2">
                  {validItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
