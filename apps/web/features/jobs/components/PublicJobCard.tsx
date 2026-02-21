import { ArrowRight, Users } from "lucide-react";
import { JobPost } from "./mock";
import { DeptBadge, TypeBadge, LocationBadge, daysAgoLabel } from "./shared";

interface Props {
  job: JobPost;
  onView: (j: JobPost) => void;
}

export function PublicJobCard({ job, onView }: Props) {
  return (
    <div
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
      onClick={() => onView(job)}
    >
      {/* top */}
      <div className="flex items-start justify-between gap-2">
        <DeptBadge dept={job.department} />
        <span className="text-xs text-slate-400 shrink-0">{daysAgoLabel(job.postedAt)}</span>
      </div>

      {/* title */}
      <div>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {job.title}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{job.description}</p>
      </div>

      {/* meta */}
      <div className="flex flex-wrap gap-2">
        <TypeBadge type={job.type} />
        <LocationBadge locationType={job.locationType} location={job.location} />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50 mt-auto">
        {job.salary ? (
          <span className="text-sm font-semibold text-indigo-600">{job.salary}</span>
        ) : (
          <span />
        )}
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
          View role <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
