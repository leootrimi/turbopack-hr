import { MoreVertical } from "lucide-react";
import { Application } from "../../types";
import { Stage } from "../../types";
import { ApplicationCard } from "./application-card";

// Pipeline Column
export function PipelineColumn({
    stage,
    applications,
    onCardClick,
  }: {
    stage: Stage;
    applications: Application[];
    onCardClick: (app: Application) => void;
  }) {
    return (
      <div className="bg-slate-50 rounded-xl p-3 w-[260px] flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-700 text-sm">{stage}</h3>
            <span className="text-xs text-slate-500 bg-white px-1.5 py-0.5 rounded-full">
              {applications.length}
            </span>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical size={14} />
          </button>
        </div>
        <div className="space-y-2 flex-1">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} onClick={() => onCardClick(app)} />
          ))}
          {applications.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-lg border border-dashed border-slate-200">
              No applications
            </div>
          )}
        </div>
      </div>
    );
  };