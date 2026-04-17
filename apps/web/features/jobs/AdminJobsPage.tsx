"use client";

import { useState } from "react";
import { Plus, Search, Briefcase } from "lucide-react";
import { JobPost, JobStatus, DEPARTMENTS } from "./components/mock";
import { AdminJobRow }   from "./components/AdminJobRow";
import { JobFormModal }  from "./components/JobFormModal";
import { JobPreviewModal } from "./components/JobPreviewModal";
import { useCreateJob, useJobs } from "./hooks/queries";

const STATUSES: JobStatus[] = ["Open", "Draft", "Closed"];

function SectionPanel({ title, jobs, onEdit, onDelete, onView, accent }: {
  title: string; jobs: JobPost[]; accent: string;
  onEdit: (j: JobPost) => void; onDelete: (id: string) => void; onView: (j: JobPost) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        <span className="ml-auto text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{jobs.length}</span>
      </div>
      {jobs.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-10">No positions in this category.</p>
      ) : (
        jobs.map((j) => <AdminJobRow key={j.id} job={j} onEdit={onEdit} onDelete={onDelete} onView={onView} />)
      )}
    </div>
  );
}

export function AdminJobsPage() {
  const { data: serverJobs = [], isLoading } = useJobs();
  const { mutate: createJob } = useCreateJob();
  const jobs = serverJobs;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobPost | null>(null);
  const [preview, setPreview] = useState<JobPost | null>(null);
  const [query, setQuery]     = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | JobStatus>("All");

  const filtered = jobs.filter((j) => {
    const q = query.toLowerCase();
    return (
      (j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q)) &&
      (deptFilter   === "All" || j.department === deptFilter) &&
      (statusFilter === "All" || j.status     === statusFilter)
    );
  });
  
  const open   = filtered.filter((j) => j.status === "Open");
  const drafts = filtered.filter((j) => j.status === "Draft");
  const closed = filtered.filter((j) => j.status === "Closed");

  const handleSave = (data: Omit<JobPost, "id" | "postedAt" | "applicants" | "closedAt">) => {
    if (editing) {
    } else {
      createJob(data);
    }
    setEditing(null);
  };

  const kpis = [
    { label: "Open Positions", value: jobs.filter((j) => j.status === "Open").length,   color: "#22c55e" },
    { label: "Draft",          value: jobs.filter((j) => j.status === "Draft").length,  color: "#94a3b8" },
    { label: "Closed",         value: jobs.filter((j) => j.status === "Closed").length, color: "#ef4444" },
    { label: "Total Applicants", value: jobs.reduce((s, j) => s + j.applicants, 0),      color: "#6366f1" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Job Positions</h1>
              <p className="text-sm text-slate-500">{jobs.length} positions total</p>
            </div>
          </div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            <Plus size={15} /> Post Position
          </button>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: k.color }} />
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">{k.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search positions…"
              className="pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 w-48 placeholder-slate-400" />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-600">
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <div className="flex items-center gap-1.5">
            {(["All", ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${statusFilter === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-sm text-slate-500">
            Loading jobs...
          </div>
        )}

        {/* sections */}
        <SectionPanel title="Open Positions" jobs={open}   accent="#22c55e" onEdit={(j) => { setEditing(j); setModalOpen(true); }} onDelete={(id) =>{}} onView={setPreview} />
        <SectionPanel title="Drafts"          jobs={drafts} accent="#94a3b8" onEdit={(j) => { setEditing(j); setModalOpen(true); }} onDelete={(id) =>{}} onView={setPreview} />
        <SectionPanel title="Closed / Past"   jobs={closed} accent="#ef4444" onEdit={(j) => { setEditing(j); setModalOpen(true); }} onDelete={(id) =>{}} onView={setPreview} />

      </div>

      <JobFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} editing={editing} />

      <JobPreviewModal job={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
