"use client";

import { useState } from "react";
import { Plus, Search, Bell } from "lucide-react";
import { Announcement, MOCK_ANNOUNCEMENTS, AnnouncementTag, TAG_CONFIG } from "./components/mock";
import { AnnouncementSection }        from "./components/AnnouncementSection";
import { CreateAnnouncementModal }    from "./components/CreateAnnouncementModal";
import { groupAnnouncements } from "./components/utils";

const TAGS = ["All", ...Object.keys(TAG_CONFIG)] as const;

export function AnnouncementsPage() {
  const [items, setItems]       = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [query, setQuery]       = useState("");
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<Announcement | null>(null);

  // ── filter ─────────────────────────────────────────────────────────────────
  const filtered = items.filter((a) => {
    const matchesQuery = a.title.toLowerCase().includes(query.toLowerCase()) ||
                         a.body.toLowerCase().includes(query.toLowerCase());
    const matchesTag   = tagFilter === "All" || a.tag === tagFilter;
    return matchesQuery && matchesTag;
  });

  const { thisWeek, thisMonth, older } = groupAnnouncements(filtered);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleSave = (data: Omit<Announcement, "id" | "createdAt">) => {
    if (editing) {
      setItems((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...data } : a))
      );
    } else {
      const newItem: Announcement = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setEditing(null);
  };

  const handleEdit = (a: Announcement) => {
    setEditing(a);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
              <p className="text-sm text-slate-500">{items.length} total announcements</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
          >
            <Plus size={15} />
            New Announcement
          </button>
        </div>

        {/* ── filters bar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements…"
              className="pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 w-56 placeholder-slate-400"
            />
          </div>

          {/* tag filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {TAGS.map((t) => {
              const active = tagFilter === t;
              const config = t !== "All" ? TAG_CONFIG[t as AnnouncementTag] : null;
              return (
                <button
                  key={t}
                  onClick={() => setTagFilter(t)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                  style={
                    active && config
                      ? { backgroundColor: config.bg, color: config.text, borderColor: config.bg }
                      : active
                      ? { backgroundColor: "#0f172a", color: "#fff", borderColor: "#0f172a" }
                      : { backgroundColor: "#fff", color: "#94a3b8", borderColor: "#e2e8f0" }
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── grouped sections ── */}
        <AnnouncementSection
          title="This Week"
          announcements={thisWeek}
          onDelete={handleDelete}
          onEdit={handleEdit}
          emptyText="No announcements this week."
        />
        <AnnouncementSection
          title="This Month"
          announcements={thisMonth}
          onDelete={handleDelete}
          onEdit={handleEdit}
          emptyText="No announcements this month."
        />
        <AnnouncementSection
          title="Older"
          announcements={older}
          onDelete={handleDelete}
          onEdit={handleEdit}
          emptyText="No older announcements."
        />

      </div>

      {/* ── modal ── */}
      <CreateAnnouncementModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
      />
    </div>
  );
}