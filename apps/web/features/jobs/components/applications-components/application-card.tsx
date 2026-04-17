import { ArrowRight, Calendar, UserPlus } from "lucide-react";
import { Application } from "../../types";
import { StageBadge } from "./stats-badge";

// Application Card (for Kanban)
export function ApplicationCard({
    app,
    onClick,
  }: {
    app: Application;
    onClick: () => void;
  }) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">{app.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{app.position}</p>
          </div>
          <StageBadge stage={app.stage} />
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <Calendar size={12} />
          <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <UserPlus size={12} />
            <span>{app.department}</span>
          </div>
          <button className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1">
            View <ArrowRight size={12} />
          </button>
        </div>
      </div>
    );
  };
  