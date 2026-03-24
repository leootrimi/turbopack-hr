"use client";

import { useState } from "react";
import { X } from "lucide-react";

const TAGS = ["General", "Urgent", "HR", "IT", "Event"] as const;
type Tag = (typeof TAGS)[number];

interface NewAnnouncementModalProps {
  onClose: () => void;
}

export function NewAnnouncementModal({ onClose }: NewAnnouncementModalProps) {
  const [tag, setTag] = useState<Tag>("General");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handlePublish = () => {
    // TODO: wire up to API / state
    onClose();
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(15,23,42,0.45)" }}
      onClick={onClose}
    >
      {/* modal panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-[15px] font-extrabold text-slate-900">
            New Announcement
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* category picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    tag === t
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title…"
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
          />

          {/* body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message…"
            rows={4}
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder:text-slate-300"
          />

          {/* actions */}
          <div className="flex gap-2.5 justify-end pt-1">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2 text-[12px] font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
