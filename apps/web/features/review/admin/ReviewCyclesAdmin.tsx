"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  Circle,
  CalendarRange,
  Loader2,
} from "lucide-react";
import {
  useReviewCycles,
  useCreateReviewCycle,
  useUpdateReviewCycle,
  useDeleteReviewCycle,
} from "../../review/hooks/queries";
import { ReviewCycle } from "../../review/api";

type ModalMode = "create" | "edit" | null;

interface FormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  enabled: boolean;
}

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  enabled: false,
});

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewCyclesAdmin() {
  const { data: cycles = [], isLoading, error } = useReviewCycles();
  const createMutation = useCreateReviewCycle();
  const updateMutation = useUpdateReviewCycle();
  const deleteMutation = useDeleteReviewCycle();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const openCreate = () => {
    setForm(emptyForm());
    setEditingId(null);
    setModalMode("create");
  };

  const openEdit = (cycle: ReviewCycle) => {
    setForm({
      title: cycle.title,
      description: cycle.description ?? "",
      startDate: cycle.startDate ? cycle.startDate.split("T")[0] : "",
      endDate: cycle.endDate ? cycle.endDate.split("T")[0] : "",
      enabled: cycle.enabled,
    });
    setEditingId(cycle.id);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      enabled: form.enabled,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };

    if (!payload.title) {
      alert("Title is required");
      return;
    }

    try {
      if (modalMode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (modalMode === "edit" && editingId !== null) {
        await updateMutation.mutateAsync({ id: editingId, dto: payload });
      }
      closeModal();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save review cycle");
    }
  };

  const handleToggle = async (cycle: ReviewCycle) => {
    setTogglingId(cycle.id);
    try {
      await updateMutation.mutateAsync({
        id: cycle.id,
        dto: { enabled: !cycle.enabled },
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update cycle");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (cycle: ReviewCycle) => {
    if (!window.confirm(`Delete review cycle "${cycle.title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(cycle.id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete cycle");
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList size={16} className="text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Review Cycles</h3>
            </div>
            <p className="text-xs text-slate-500">
              Create and manage performance review periods. Only one cycle can be
              active at a time — enabling one disables all others.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Plus size={13} />
            New Review Cycle
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 mb-3">
            Failed to load review cycles.
          </p>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-6">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-4 py-2.5">Title</th>
                  <th className="px-4 py-2.5">Period</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Enabled</th>
                  <th className="px-4 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((cycle) => (
                  <tr
                    key={cycle.id}
                    className="border-t border-slate-100 text-slate-800 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Title + description */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{cycle.title}</p>
                      {cycle.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {cycle.description}
                        </p>
                      )}
                    </td>

                    {/* Period */}
                    <td className="px-4 py-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <CalendarRange size={12} />
                        {formatDate(cycle.startDate)} → {formatDate(cycle.endDate)}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      {cycle.enabled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={10} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <Circle size={10} />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Toggle */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={togglingId === cycle.id}
                        onClick={() => handleToggle(cycle)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 ${
                          cycle.enabled ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                        aria-pressed={cycle.enabled}
                        aria-label={cycle.enabled ? "Disable cycle" : "Enable cycle"}
                      >
                        {togglingId === cycle.id ? (
                          <Loader2
                            size={12}
                            className="absolute left-1/2 -translate-x-1/2 animate-spin text-white"
                          />
                        ) : (
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                              cycle.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(cycle)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        <Pencil size={11} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cycle)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                      >
                        <Trash2 size={11} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {cycles.length === 0 && !error && (
              <div className="px-4 py-8 text-center">
                <ClipboardList size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">
                  No review cycles yet. Create your first one.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                {modalMode === "create" ? "New Review Cycle" : "Edit Review Cycle"}
              </h4>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Q2 2026 Performance Review"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Optional notes about this review cycle…"
                rows={2}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startDate: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, endDate: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>
            </div>

            {/* Enabled toggle */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-800">Enable this cycle</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Makes review forms visible to managers on employee profiles
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({ ...p, enabled: !p.enabled }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                  form.enabled ? "bg-indigo-600" : "bg-slate-300"
                }`}
                aria-pressed={form.enabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    form.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {isSaving && <Loader2 size={13} className="animate-spin" />}
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
