"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Field,
  Input,
  Toggle,
} from "../../../components/components/FormFields";
import {
  getTimeOffTypes,
  createTimeOffType,
  updateTimeOffType,
  deleteTimeOffType,
  type TimeOffTypeDTO,
} from "../../timeoff/api";

interface TimeOffFormData {
  annualPto: string;
  sickDays: string;
  paidHolidays: string;
  accrualMethod: string;
  allowCarryover: boolean;
}

type ModalMode = "create" | "edit" | null;

export default function TimeOffSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TimeOffFormData>({
    annualPto: "20",
    sickDays: "10",
    paidHolidays: "8",
    accrualMethod: "Annual (awarded on anniversary date)",
    allowCarryover: true,
  });

  const [types, setTypes] = useState<TimeOffTypeDTO[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formDefaultValue, setFormDefaultValue] = useState("0");
  const [formEnabled, setFormEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const loadTypes = useCallback(async () => {
    setTypesLoading(true);
    setTypesError(null);
    try {
      const rows = await getTimeOffTypes({ all: true });
      setTypes(rows);
    } catch (e) {
      setTypesError(
        e instanceof Error ? e.message : "Failed to load time off types",
      );
    } finally {
      setTypesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const invalidateTypeQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["time-off-types"] });
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
    setFormName("");
    setFormDefaultValue("0");
    setFormEnabled(true);
  };

  const openEdit = (row: TimeOffTypeDTO) => {
    setModalMode("edit");
    setEditingId(row.id);
    setFormName(row.name);
    setFormDefaultValue(String(row.defaultValue));
    setFormEnabled(row.enabled);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
  };

  const handleSaveType = async () => {
    const name = formName.trim();
    const defaultValue = parseFloat(formDefaultValue);
    if (!name) {
      alert("Name is required");
      return;
    }
    if (!Number.isFinite(defaultValue)) {
      alert("Default value must be a number");
      return;
    }
    setSaving(true);
    try {
      if (modalMode === "create") {
        await createTimeOffType({
          name,
          defaultValue,
          enabled: formEnabled,
        });
      } else if (modalMode === "edit" && editingId != null) {
        await updateTimeOffType(editingId, {
          name,
          defaultValue,
          enabled: formEnabled,
        });
      }
      invalidateTypeQueries();
      await loadTypes();
      closeModal();
    } catch (e) {
      alert(
        e instanceof Error ? e.message : "Could not save time off type",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (row: TimeOffTypeDTO) => {
    setTogglingId(row.id);
    try {
      await updateTimeOffType(row.id, { enabled: !row.enabled });
      invalidateTypeQueries();
      await loadTypes();
    } catch (e) {
      alert(
        e instanceof Error ? e.message : "Could not update time off type",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (row: TimeOffTypeDTO) => {
    if (
      !window.confirm(
        `Delete time off type "${row.name}"? This is only allowed if no requests use it.`,
      )
    ) {
      return;
    }
    try {
      await deleteTimeOffType(row.id);
      invalidateTypeQueries();
      await loadTypes();
    } catch (e) {
      alert(
        e instanceof Error ? e.message : "Could not delete time off type",
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allowCarryover: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Time off types (DB-backed) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Time Off Types</h3>
            <p className="text-xs text-slate-500 mt-1">
              Manage leave categories, defaults, and availability for requests
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          >
            Add Time Off Type
          </button>
        </div>

        {typesError && (
          <p className="text-sm text-red-600 mb-3">{typesError}</p>
        )}

        {typesLoading ? (
          <p className="text-sm text-slate-500">Loading types…</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Default (days)</th>
                  <th className="px-3 py-2">Enabled</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 text-slate-800"
                  >
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className="px-3 py-2 tabular-nums">{row.defaultValue}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        disabled={togglingId === row.id}
                        onClick={() => handleToggleEnabled(row)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 ${
                          row.enabled ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                        aria-pressed={row.enabled}
                        aria-label={row.enabled ? "Disable type" : "Enable type"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            row.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {types.length === 0 && !typesError && (
              <p className="text-sm text-slate-500 px-3 py-4">
                No types yet. Add one or run database migrations.
              </p>
            )}
          </div>
        )}
      </div>

      {/* PTO Policy Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Time Off Entitlements
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Default annual time off allowances for new employees
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Annual PTO" required hint="Days per year">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="annualPto"
                  value={formData.annualPto}
                  onChange={handleChange}
                  placeholder="20"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  days
                </span>
              </div>
            </Field>

            <Field label="Sick Days" required hint="Days per year">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="sickDays"
                  value={formData.sickDays}
                  onChange={handleChange}
                  placeholder="10"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  days
                </span>
              </div>
            </Field>

            <Field label="Paid Holidays" required hint="Days per year">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="paidHolidays"
                  value={formData.paidHolidays}
                  onChange={handleChange}
                  placeholder="8"
                  className="flex-1"
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  days
                </span>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* Accrual Policy Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900">
            Accrual & Carryover
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            How PTO is earned and carried over to the next year
          </p>
        </div>

        <div className="space-y-4">
          <Field
            label="Accrual Method"
            required
            hint="How PTO is distributed annually"
          >
            <select
              name="accrualMethod"
              value={formData.accrualMethod}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
            >
              <option value="Annual (awarded on anniversary date)">
                Annual (awarded on anniversary date)
              </option>
              <option value="Monthly accrual">Monthly accrual</option>
              <option value="No accrual policy">No accrual policy</option>
            </select>
          </Field>

          <Toggle
            label="Allow PTO Carryover"
            description="Employees can carry up to 5 unused PTO days into the next year"
            checked={formData.allowCarryover}
            onChange={handleToggle}
          />
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">
              {modalMode === "create"
                ? "Add Time Off Type"
                : "Edit Time Off Type"}
            </h4>
            <Field label="Name" required>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Vacation"
              />
            </Field>
            <Field label="Default value" required hint="Typical days allocated (reference)">
              <Input
                type="number"
                step="0.5"
                value={formDefaultValue}
                onChange={(e) => setFormDefaultValue(e.target.value)}
              />
            </Field>
            <Toggle
              label="Enabled"
              description="When off, employees cannot select this type for new requests"
              checked={formEnabled}
              onChange={setFormEnabled}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveType}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
