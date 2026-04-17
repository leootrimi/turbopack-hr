import { Calendar, Mail, MapPin, Phone, XCircle } from "lucide-react";
import { Application, stages } from "../../types";
import { StageBadge } from "./stats-badge";

export 
// Detail Panel (Modal)
const DetailPanel = ({
  application,
  onClose,
  onMoveStage,
  onReject,
}: {
  application: Application | null;
  onClose: () => void;
  onMoveStage: (appId: string, direction: 'next' | 'prev') => void;
  onReject: (appId: string) => void;
}) => {
  if (!application) return null;

  const currentIndex = stages.indexOf(application.stage);
  const canMoveNext = currentIndex < stages.length - 2 && application.stage !== 'Hired' && application.stage !== 'Rejected';
  const canMovePrev = currentIndex > 0 && application.stage !== 'Hired' && application.stage !== 'Rejected';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-5 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-semibold text-slate-800">Candidate Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <XCircle size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{application.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{application.position} • {application.department}</p>
            </div>
            <StageBadge stage={application.stage} />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-slate-400" />
              <span className="text-slate-700">{application.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-slate-400" />
              <span className="text-slate-700">{application.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-slate-700">{application.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-slate-700">Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Notes</h4>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{application.notes}</p>
          </div>

          {/* CV Link */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Resume/CV</h4>
            <a
              href={application.cvUrl}
              className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
            >
              View attached CV →
            </a>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Timeline</h4>
            <div className="space-y-2">
              {application.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                  <div className="flex-1">
                    <p className="text-slate-700">{item.action}</p>
                    <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {application.stage !== 'Hired' && application.stage !== 'Rejected' && (
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              {canMovePrev && (
                <button
                  onClick={() => onMoveStage(application.id, 'prev')}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Move to Previous Stage
                </button>
              )}
              {canMoveNext && (
                <button
                  onClick={() => onMoveStage(application.id, 'next')}
                  className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Move to {stages[currentIndex + 1]}
                </button>
              )}
              <button
                onClick={() => onReject(application.id)}
                className="flex-1 px-3 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors"
              >
                Reject Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};