import { ArrowRight, Eye, XCircle } from "lucide-react";
import { Application, stages } from "../../types";
import { StageBadge } from "./stats-badge";

// Application Table Row
export function ApplicationTableRow({
    app,
    onView,
    onMoveStage,
    onReject,
  }: {
    app: Application;
    onView: () => void;
    onMoveStage: (direction: 'next' | 'prev') => void;
    onReject: () => void;
  }) {
    const currentIndex = stages.indexOf(app.stage);
    const canMoveNext = currentIndex < stages.length - 2 && app.stage !== 'Hired' && app.stage !== 'Rejected';
    const canMovePrev = currentIndex > 0 && app.stage !== 'Hired' && app.stage !== 'Rejected';
  
    return (
      <tr className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors">
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-slate-800 text-sm">{app.name}</p>
            <p className="text-xs text-slate-500">{app.position}</p>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600">{app.department}</td>
        <td className="px-4 py-3">
          <StageBadge stage={app.stage} />
        </td>
        <td className="px-4 py-3 text-sm text-slate-500">{new Date(app.appliedDate).toLocaleDateString()}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              title="View Details"
            >
              <Eye size={14} />
            </button>
            {canMoveNext && (
              <button
                onClick={() => onMoveStage('next')}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                title="Move to next stage"
              >
                <ArrowRight size={14} />
              </button>
            )}
            {app.stage !== 'Rejected' && app.stage !== 'Hired' && (
              <button
                onClick={onReject}
                className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 transition-colors"
                title="Reject"
              >
                <XCircle size={14} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };