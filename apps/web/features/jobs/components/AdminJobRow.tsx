import { Edit2, Trash2, Users, Eye } from "lucide-react";
import { JobPost } from "./mock";
import { StatusBadge, DeptBadge, TypeBadge, LocationBadge, daysAgoLabel } from "./shared";

interface Props {
  job: JobPost;
  onEdit:   (j: JobPost) => void;
  onDelete: (id: string) => void;
  onView:   (j: JobPost) => void;
}

export function AdminJobRow({ job, onEdit, onDelete, onView }: Props) {
  return (
    <div className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
      {/* left */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <button onClick={() => onView(job)} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left">
            {job.title}
          </button>
          <StatusBadge status={job.status} />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <DeptBadge dept={job.department} />
          <TypeBadge type={job.type} />
          <LocationBadge locationType={job.locationType} location={job.location} />
        </div>
      </div>

      {/* meta */}
      <div className="hidden md:flex flex-col items-end gap-1 shrink-0 text-right">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Users size={11} />
          <span className="font-semibold text-slate-700">{job.applicants}</span> applicants
        </div>
        <span className="text-xs text-slate-400">{daysAgoLabel(job.postedAt)}</span>
        {job.salary && <span className="text-xs font-medium text-slate-600">{job.salary}</span>}
      </div>

      {/* actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button onClick={() => onView(job)}   className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><Eye   size={14} /></button>
        <button onClick={() => onEdit(job)}   className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><Edit2 size={14} /></button>
        <button onClick={() => onDelete(job.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
