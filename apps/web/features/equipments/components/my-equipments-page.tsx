"use client";

import { useMemo } from "react";
import { useMyEquipments } from "../hooks/queries";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function MyEquipmentsPage() {
  const { data = [], isLoading, error } = useMyEquipments();

  const summary = useMemo(() => {
    const assigned = data.length;
    const inRepair = data.filter((e) => e.status === "Under Repair").length;
    return { assigned, inRepair };
  }, [data]);

  if (isLoading) {
    return <div className="p-8 text-sm text-slate-500">Loading your equipments...</div>;
  }

  if (error) {
    return <div className="p-8 text-sm text-red-500">Failed to load equipments: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-white via-slate-100 to-slate-200 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900">My Equipments</h1>
          <p className="text-sm text-slate-500 mt-1">Devices and assets currently assigned to you.</p>
          <div className="mt-4 flex gap-3">
            <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500">Assigned</p>
              <p className="text-xl font-bold text-slate-900">{summary.assigned}</p>
            </div>
            <div className="px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-700">Under Repair</p>
              <p className="text-xl font-bold text-amber-800">{summary.inRepair}</p>
            </div>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-10 text-center text-slate-500 text-sm">
            No equipment assigned to you yet.
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Equipment</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Brand & Model</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Asset Tag</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    const statusColor =
                      item.status === "Assigned"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : item.status === "Under Repair"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-slate-50 text-slate-600 border-slate-100";

                    return (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <Link
                            href={`/dashboard/equipments/${item.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-black-700 hover:text-indigo-900 hover:underline"
                          >
                            {item.name}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">{item.category}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{item.brand} {item.model}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 font-mono">{item.assetTag || "-"}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
                            {item.status ?? "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
