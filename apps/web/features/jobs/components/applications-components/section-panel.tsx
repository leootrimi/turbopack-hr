import { AdminJobRow } from "../AdminJobRow";
import { JobPost } from "../mock";

export function SectionPanel({ title, jobs, onEdit, onDelete, onView, accent }: {
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