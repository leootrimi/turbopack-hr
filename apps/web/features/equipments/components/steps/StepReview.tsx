import { EquipmentForm, CATEGORY_ICONS, STATUS_CONFIG, CONDITION_CONFIG } from "../types";
import { Package, ShoppingBag, UserCheck, CheckCircle2 } from "lucide-react";

interface Props { form: EquipmentForm; }

function ReviewSection({ icon: Icon, title, rows }: {
  icon: React.ElementType; title: string;
  rows: { label: string; value: string | React.ReactNode }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
          <Icon size={14} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {rows.filter((r) => r.value).map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3 gap-4">
            <span className="text-xs text-slate-400 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepReview({ form }: Props) {
  const { basic, purchase, assignment } = form;
  const statusCfg    = STATUS_CONFIG[purchase.status];
  const conditionCfg = CONDITION_CONFIG[purchase.condition];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Review & Confirm</h2>
        <p className="text-sm text-slate-500 mt-0.5">Check all details before saving this equipment record.</p>
      </div>

      {/* hero preview card */}
      {(basic.name || basic.category) && (
        <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-2xl text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
            {basic.category ? CATEGORY_ICONS[basic.category] : "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate">{basic.name || "—"}</p>
            <p className="text-slate-400 text-sm mt-0.5">
              {[basic.brand, basic.model].filter(Boolean).join(" · ") || "—"}
            </p>
            {basic.assetTag && (
              <p className="text-xs text-slate-500 mt-0.5">#{basic.assetTag}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.dot }} />
              {purchase.status}
            </span>
            <span
              className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: conditionCfg.bg, color: conditionCfg.text }}
            >
              {purchase.condition}
            </span>
          </div>
        </div>
      )}

      <ReviewSection
        icon={Package}
        title="Basic Information"
        rows={[
          { label: "Name",          value: basic.name           },
          { label: "Category",      value: basic.category       },
          { label: "Brand",         value: basic.brand          },
          { label: "Model",         value: basic.model          },
          { label: "Serial Number", value: basic.serialNumber   },
          { label: "Asset Tag",     value: basic.assetTag       },
          { label: "Description",   value: basic.description    },
        ]}
      />

      <ReviewSection
        icon={ShoppingBag}
        title="Purchase & Status"
        rows={[
          { label: "Purchase Date",      value: purchase.purchaseDate        },
          { label: "Purchase Cost",      value: purchase.purchaseCost ? `€${Number(purchase.purchaseCost).toLocaleString()}` : "" },
          { label: "Supplier",           value: purchase.supplier            },
          { label: "Warranty Expires",   value: purchase.warrantyExpiration  },
          { label: "Condition",          value: purchase.condition           },
          { label: "Status",             value: purchase.status              },
        ]}
      />

      <ReviewSection
        icon={UserCheck}
        title="Assignment"
        rows={[
          { label: "Assigned To",    value: assignment.assignedTo    || "Unassigned" },
          { label: "Assignment Date",value: assignment.assignmentDate              },
          { label: "Return Due",     value: assignment.returnDueDate || "—"        },
          { label: "Location",       value: assignment.location                    },
          { label: "Notes",          value: assignment.notes                       },
        ]}
      />
    </div>
  );
}
