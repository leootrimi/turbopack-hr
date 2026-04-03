// components/equipment/EquipmentCard.tsx
import Link from "next/link";
import { ExternalLink, Laptop, Monitor, Smartphone, Headphones, Printer, Package } from "lucide-react";

interface Equipment {
  id: string | number;
  name: string;
  category: string;
  brand: string;
  model: string;
  assetTag?: string | null;
  status: string | null;
}

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const statusColor =
    equipment.status === "Assigned"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : equipment.status === "Under Repair"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Link
                href={`/dashboard/equipments/${equipment.id}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
              >
                {equipment.name}
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <p className="text-xs text-slate-500">{equipment.category}</p>
            </div>
          </div>
          <span className={`inline-flex rounded-lg border px-2 py-0.5 text-xs font-medium ${statusColor}`}>
            {equipment.status}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-500">Brand/Model</p>
            <p className="font-medium text-slate-700">{equipment.brand} {equipment.model}</p>
          </div>
          <div>
            <p className="text-slate-500">Asset Tag</p>
            <p className="font-mono text-slate-700">{equipment.assetTag || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}