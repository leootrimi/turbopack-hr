"use client";

import { useState } from "react";
import { Search, Briefcase, Sparkles } from "lucide-react";
import { JobPost, MOCK_JOBS, DEPARTMENTS, JOB_TYPES, LOCATION_TYPES, JobType, JobLocation } from "./components/mock";
import { PublicJobCard }  from "./components/PublicJobCard";
import { JobDetailPage }  from "./components/JobDetailPage";

const openJobs = MOCK_JOBS.filter((j) => j.status === "Open");

export function PublicJobsPage() {
  const [selected, setSelected]       = useState<JobPost | null>(null);
  const [query, setQuery]             = useState("");
  const [deptFilter, setDeptFilter]   = useState("All");
  const [typeFilter, setTypeFilter]   = useState<"All" | JobType>("All");
  const [modeFilter, setModeFilter]   = useState<"All" | JobLocation>("All");

  if (selected) return <JobDetailPage job={selected} onBack={() => setSelected(null)} />;

  const filtered = openJobs.filter((j) => {
    const q = query.toLowerCase();
    return (
      (j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)) &&
      (deptFilter === "All" || j.department   === deptFilter) &&
      (typeFilter === "All" || j.type         === typeFilter) &&
      (modeFilter === "All" || j.locationType === modeFilter)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* hero */}
      <div className="bg-slate-900 text-white px-6 py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
          <Sparkles size={12} /> {openJobs.length} open positions
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Join our team</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          We're building something meaningful. Find a role where you can do your best work.
        </p>

        {/* search */}
        <div className="relative max-w-sm mx-auto mt-6">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, team, or location…"
            className="w-full pl-10 pr-4 py-3 text-sm bg-white text-slate-900 rounded-xl outline-none placeholder-slate-400 shadow-lg"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* filter bar */}
        <div className="flex flex-wrap gap-3 items-center">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none text-slate-600 focus:ring-2 focus:ring-slate-900/10">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none text-slate-600 focus:ring-2 focus:ring-slate-900/10">
            <option value="All">All Types</option>
            {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value as any)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none text-slate-600 focus:ring-2 focus:ring-slate-900/10">
            <option value="All">All Modes</option>
            {LOCATION_TYPES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <span className="text-xs text-slate-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <Briefcase size={22} className="text-slate-300" />
            </div>
            <p className="font-semibold text-slate-500">No positions match your search</p>
            <p className="text-xs text-slate-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <PublicJobCard key={job.id} job={job} onView={setSelected} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
