"use client";

import { useState, useEffect } from "react";
import { X, Pin } from "lucide-react";
import { Announcement, AnnouncementTag, TAG_CONFIG } from "./mock";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Announcement, "id" | "createdAt">) => void;
  editing?: Announcement | null;
}

const TAGS = Object.keys(TAG_CONFIG) as AnnouncementTag[];
const EMPTY = { title: "", body: "", tag: "General" as AnnouncementTag, pinned: false };

export function CreateAnnouncementModal({ open, onClose, onSave, editing }: ModalProps) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (editing) {
      setForm({ title: editing.title, body: editing.body, tag: editing.tag, pinned: !!editing.pinned });
    } else {
      setForm(EMPTY);
    }
  }, [editing, open]);

  if (!open) return null;

  const valid = form.title.trim().length > 0 && form.body.trim().length > 0;

  const handleSave = () => {
    if (!valid) return;
    onSave({ ...form, author: "Sarah Johnson", authorInitials: "SJ" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">
            {editing ? "Edit Announcement" : "New Announcement"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5 space-y-4">
          {/* title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Announcement title…"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 placeholder-slate-400 transition"
            />
          </div>

          {/* tag */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Category</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => {
                const { bg, text } = TAG_CONFIG[t];
                const active = form.tag === t;
                return (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, tag: t }))}
                    className="px-3 py-1 rounded-lg text-xs font-semibold border-2 transition-all"
                    style={{
                      backgroundColor: active ? bg : "transparent",
                      color: active ? text : "#94a3b8",
                      borderColor: active ? bg : "#e2e8f0",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* body */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Message</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Write your announcement here…"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 placeholder-slate-400 resize-none transition"
            />
          </div>

          {/* pin toggle */}
          <button
            onClick={() => setForm((f) => ({ ...f, pinned: !f.pinned }))}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              form.pinned
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Pin size={12} />
            {form.pinned ? "Pinned" : "Pin this announcement"}
          </button>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!valid}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {editing ? "Save Changes" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
