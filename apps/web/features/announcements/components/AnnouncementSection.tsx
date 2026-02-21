import { Announcement } from "./mock";
import { AnnouncementCard } from "./AnnouncementCard";

interface AnnouncementSectionProps {
  title: string;
  announcements: Announcement[];
  onDelete: (id: string) => void;
  onEdit:   (a: Announcement) => void;
  emptyText?: string;
}

export function AnnouncementSection({
  title,
  announcements,
  onDelete,
  onEdit,
  emptyText = "No announcements in this period.",
}: AnnouncementSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-slate-700">{title}</h2>
        <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
          {announcements.length}
        </span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {announcements.length === 0 ? (
        <p className="text-sm text-slate-400 py-4">{emptyText}</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {announcements.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}
