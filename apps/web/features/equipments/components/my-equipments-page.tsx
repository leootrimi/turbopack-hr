// app/dashboard/equipments/page.tsx (or wherever MyEquipmentsPage is used)
"use client";

import { useMemo } from "react";
import { useMyEquipments } from "../hooks/queries";
import { EquipmentCard } from "./equipment-overview-page/equipment-card";
import { QuickActionCard } from "./equipment-overview-page/quick-actions";
import { ResponsibilityCard } from "./equipment-overview-page/responsibility-card";
import { StatsSummaryCard } from "./equipment-overview-page/stats-summary";
import { useAuth } from "../../auth/hooks/useAuth";

export function MyEquipmentsPage() {
  const { data = [], isLoading, error } = useMyEquipments();
  const { user } = useAuth()
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-white via-slate-100 to-slate-200 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-slate-900">{user?.fullName}'s Equipments</h1>
          <p className="text-sm text-slate-500 mt-1">Devices and assets currently assigned to you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {data.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-10 text-center text-slate-500 text-sm">
                No equipment assigned to you yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((item) => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <StatsSummaryCard assigned={summary.assigned} inRepair={summary.inRepair} />
            <QuickActionCard />
            <ResponsibilityCard />
          </div>
        </div>
      </div>
    </div>
  );
}