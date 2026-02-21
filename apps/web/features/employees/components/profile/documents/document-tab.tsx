"use client";

import { useState } from "react";
import {
  FileText,
  Heart,
  Plus,
  Download,
  Eye,
  MoreVertical,
  File,
  Search,
  Trash2,
  Share2,
  FolderOpen,
} from "lucide-react";

// ── tiny cn helper (no external dep) ──────────────────────────────────────────
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  count: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  color: string;
}

interface MenuItemProps {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  danger?: boolean;
}

interface CategoryPillProps {
  category: Category;
  active: boolean;
  onClick: () => void;
}

// ── sample data ───────────────────────────────────────────────────────────────
const categories = [
  { id: "all",        name: "All Documents",   icon: File,     count: 8 },
  { id: "contracts",  name: "Contracts",        icon: FileText, count: 3 },
  { id: "health",     name: "Health Insurance", icon: Heart,    count: 3 },
  { id: "additional", name: "Additionals",      icon: Plus,     count: 2 },
];

interface DocumentData {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  color: string;
}

const docs: Record<string, DocumentData[]> = {
  contracts: [
    { id: "1", name: "Employment Contract 2024", type: "PDF",  size: "2.4 MB", uploadedAt: "15 Jan 2024", color: "#6366f1" },
    { id: "2", name: "NDA Agreement",            type: "PDF",  size: "1.2 MB", uploadedAt: "10 Jan 2024", color: "#6366f1" },
    { id: "3", name: "Service Agreement",        type: "DOCX", size: "890 KB", uploadedAt: "20 Dec 2023", color: "#6366f1" },
  ],
  health: [
    { id: "4", name: "Health Insurance Policy 2024", type: "PDF", size: "3.1 MB", uploadedAt: "01 Jan 2024", color: "#ec4899" },
    { id: "5", name: "Medical Records",               type: "PDF", size: "5.6 MB", uploadedAt: "15 Nov 2023", color: "#ec4899" },
    { id: "6", name: "Dental Coverage",               type: "PDF", size: "1.8 MB", uploadedAt: "05 Oct 2023", color: "#ec4899" },
  ],
  additional: [
    { id: "7", name: "Tax Documents 2023",       type: "PDF", size: "4.2 MB", uploadedAt: "20 Jan 2024", color: "#14b8a6" },
    { id: "8", name: "Certificate of Completion",type: "PDF", size: "650 KB", uploadedAt: "15 Dec 2023", color: "#14b8a6" },
  ],
  all: [],
};
docs.all = [...(docs.contracts ?? []), ...(docs.health ?? []), ...(docs.additional ?? [])];

// ── sub-components ─────────────────────────────────────────────────────────────
function CategoryPill({ category, active, onClick }: CategoryPillProps) {
  const Icon = category.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 w-full",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      )}
    >
      <Icon size={14} className="shrink-0" />
      <span className="truncate flex-1 text-left">{category.name}</span>
      <span
        className={cn(
          "text-xs px-1.5 py-0.5 rounded-md font-semibold tabular-nums",
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        )}
      >
        {category.count}
      </span>
    </button>
  );
}

function DocRow({ doc }: { doc: Document }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 relative">
      {/* icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: doc.color + "18" }}
      >
        <FileText size={16} style={{ color: doc.color }} />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{doc.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          <span className="font-medium text-slate-500">{doc.type}</span>
          <span className="mx-1.5">·</span>
          {doc.size}
          <span className="mx-1.5">·</span>
          {doc.uploadedAt}
        </p>
      </div>

      {/* actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <ActionBtn icon={Eye} title="Preview" onClick={() => {}} />
        <ActionBtn icon={Download} title="Download" onClick={() => {}} />

        {/* more menu */}
        <div className="relative">
          <ActionBtn
            icon={MoreVertical}
            title="More"
            onClick={() => setMenuOpen((o) => !o)}
          />
          {menuOpen && (
            <>
              {/* backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden w-36 py-1">
                {[
                  { label: "Share",    icon: Share2  },
                  { label: "Move to",  icon: FolderOpen },
                  { label: "Delete",   icon: Trash2, danger: true },
                ].map(({ label, icon: Icon, danger }) => (
                  <button
                    key={label}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium transition-colors",
                      danger
                        ? "text-red-500 hover:bg-red-50"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick }: { icon: React.ComponentType<{ size?: number }>; title: string; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
    >
      <Icon size={15} />
    </button>
  );
}

export function DocumentsTab() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");

  const list = (docs[selectedCategory] ?? []).filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex gap-0 h-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <aside className="w-48 shrink-0 border-r border-slate-100 px-3 py-4 flex flex-col gap-1">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-3 mb-2">
          Categories
        </p>
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            category={cat}
            active={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          />
        ))}

        <div className="mt-auto pt-4">
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold text-slate-900 bg-slate-900 text-white hover:bg-slate-700 transition-colors justify-center">
            <Plus size={14} />
            Upload
          </button>
        </div>
      </aside>

      {/* ── content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* top bar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents…"
              className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition placeholder-slate-400"
            />
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FileText size={20} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">No documents found</p>
              <p className="text-xs text-slate-400">Try a different search or category</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {list.map((doc) => (
                <DocRow key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </div>

        {/* footer count */}
        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {list.length} document{list.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DocumentsTab;