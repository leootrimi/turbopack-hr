import { Pin, Trash2, Edit2 } from "lucide-react";
import { Announcement } from "./mock";
import { TagBadge } from "./TagBadge";
import { AuthorAvatar } from "./AuthorAvatar";
import { formatRelative } from "./utils";

interface AnnouncementCardProps {
  announcement: Announcement;
  onDelete: (id: string) => void;
  onEdit:   (a: Announcement) => void;
}

export function AnnouncementCard({ announcement: a, onDelete, onEdit }: AnnouncementCardProps) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 group transition-shadow hover:shadow-md ${a.pinned ? "border-indigo-200" : "border-slate-100"}`}>
      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <TagBadge tag={a.tag} />
          {a.pinned && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              <Pin size={10} /> Pinned
            </span>
          )}
        </div>
        {/* actions — appear on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(a)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(a.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* content */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 leading-snug">{a.title}</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">{a.body}</p>
      </div>

      {/* footer */}
      <div className="flex items-center gap-2 mt-auto pt-1 border-t border-slate-50">
        <AuthorAvatar initials={a.authorInitials} />
        <div>
          <p className="text-[11px] font-semibold text-slate-700">{a.author}</p>
          <p className="text-[11px] text-slate-400">{formatRelative(a.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
