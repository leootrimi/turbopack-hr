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
  Loader2,
  X,
} from "lucide-react";
import { useDocuments, useUploadDocument, useDeleteDocument } from "../../../hooks/useDocuments";

// ── tiny cn helper (no external dep) ──────────────────────────────────────────
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  category: string;
  createdAt: string;
}

interface CategoryPillProps {
  category: Category;
  active: boolean;
  onClick: () => void;
  count: number;
}

const categories: Category[] = [
  { id: "all", name: "All Documents", icon: File },
  { id: "contracts", name: "Contracts", icon: FileText },
  { id: "health", name: "Health Insurance", icon: Heart },
  { id: "additional", name: "Additionals", icon: Plus },
];

function CategoryPill({ category, active, onClick, count }: CategoryPillProps) {
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
        {count}
      </span>
    </button>
  );
}

function DocRow({ doc, onDelete }: { doc: Document; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 relative">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50">
        <FileText size={16} className="text-indigo-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{doc.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          <span className="font-medium text-slate-500">{doc.type}</span>
          <span className="mx-1.5">·</span>
          {doc.size}
          <span className="mx-1.5">·</span>
          {new Date(doc.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <ActionBtn icon={Eye} title="View" onClick={() => window.open(doc.url, "_blank")} />
        <ActionBtn icon={Download} title="Download" onClick={() => window.open(doc.url, "_blank")} />

        <div className="relative">
          <ActionBtn
            icon={MoreVertical}
            title="More"
            onClick={() => setMenuOpen((o) => !o)}
          />
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden w-36 py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(doc.id);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, title, onClick }: { icon: any; title: string; onClick: () => void }) {
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

function UploadModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
  initialCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, category: string) => void;
  isUploading: boolean;
  initialCategory: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(initialCategory === 'all' ? 'other' : initialCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Upload Document</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
            >
              {categories.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              File
            </label>
            <div
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer",
                file ? "border-indigo-200 bg-indigo-50/30" : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              )}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                <File size={20} />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {file ? file.name : "Click to select a file"}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOCX, PNG up to 10MB"}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-colors border border-transparent hover:border-slate-200"
          >
            Cancel
          </button>
          <button
            disabled={!file || isUploading}
            onClick={() => file && onUpload(file, category)}
            className="flex-3 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isUploading && <Loader2 size={16} className="animate-spin" />}
            {isUploading ? "Uploading..." : "Upload Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DocumentsTab({ employeeId }: { employeeId: string }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: documentsData, isLoading } = useDocuments(employeeId, selectedCategory);
  const { mutateAsync: uploadDoc, isPending: isUploading } = useUploadDocument();
  const { mutateAsync: deleteDoc } = useDeleteDocument();

  const handleUpload = async (file: File, category: string) => {
    try {
      await uploadDoc({ employeeId, file, category });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDoc({ employeeId, id });
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const list = (documentsData || []).filter((d: any) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  // Group counts
  const counts: Record<string, number> = {
    all: documentsData?.length || 0,
    contracts: documentsData?.filter((d: any) => d.category === 'contracts').length || 0,
    health: documentsData?.filter((d: any) => d.category === 'health').length || 0,
    additional: documentsData?.filter((d: any) => d.category === 'additional').length || 0,
  };

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
            count={counts[cat.id] || 0}
          />
        ))}

        <div className="mt-auto pt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-700 transition-colors justify-center shadow-lg shadow-slate-900/10"
          >
            <Plus size={14} />
            Upload
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
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

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 size={24} className="animate-spin text-slate-300" />
              <p className="text-sm text-slate-400 font-medium">Loading documents...</p>
            </div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FileText size={20} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">No documents found</p>
              <p className="text-xs text-slate-400">Try a different search or upload a new one</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {list.map((doc: any) => (
                <DocRow key={doc.id} doc={doc} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {list.length} document{list.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
        initialCategory={selectedCategory}
      />
    </div>
  );
}

export default DocumentsTab;