'use client';

import {
  useState,
  useEffect,
  useMemo,
  createElement,
  type ComponentType,
} from 'react';
import {
  Star,
  Target,
  Trophy,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { useActiveReviewCycle, useSubmitManagerReview, useManagerReviewSubmission } from '../hooks/queries';
import {
  DEFAULT_MANAGER_OVERVIEW_QUESTIONS,
  normalizeReviewQuestions,
} from '../review-form-defaults';

interface ReviewData {
  overview: Record<string, string>;
}

const getQuality = (text: string): { label: string; color: string } => {
  const len = text.trim().length;
  if (len < 20) return { label: 'Required — add more detail', color: 'text-rose-500' };
  if (len < 80) return { label: 'Good start', color: 'text-emerald-500' };
  return { label: 'Excellent', color: 'text-emerald-600' };
};

const TEXT_MIN = 20;
const isTextValid = (text: string) => text.trim().length >= TEXT_MIN;

function getValidationSummary(
  data: ReviewData,
  overviewQuestionIds: string[],
): { overviewDone: boolean; allDone: boolean } {
  const overviewDone = overviewQuestionIds.every((id) =>
    isTextValid(data.overview[id] ?? ''),
  );

  return { overviewDone, allDone: overviewDone };
}

const OVERVIEW_ICONS = [Trophy, Target, TrendingUp, MessageSquare, Star] as const;

interface ManagerReviewPageProps {
  employeeId: string;
  managerId: string;
  cycleId: number;
}

export default function ManagerReviewPage({ employeeId, managerId, cycleId }: ManagerReviewPageProps) {
  const { data: activeCycle } = useActiveReviewCycle();
  const overviewQuestions = useMemo(
    () =>
      normalizeReviewQuestions(
        activeCycle?.managerReviewQuestions,
        DEFAULT_MANAGER_OVERVIEW_QUESTIONS,
      ),
    [activeCycle?.managerReviewQuestions],
  );

  const [reviewData, setReviewData] = useState<ReviewData>({
    overview: {},
  });

  useEffect(() => {
    setReviewData((prev) => {
      const overview: Record<string, string> = {};
      for (const q of overviewQuestions) {
        overview[q.id] = prev.overview[q.id] ?? '';
      }
      return { ...prev, overview };
    });
  }, [overviewQuestions]);
  const [submitted, setSubmitted] = useState(false);

  const { data: existingSubmission, isLoading: isLoadingSubmission } = useManagerReviewSubmission(cycleId, parseInt(employeeId));
  const submitMutation = useSubmitManagerReview();

  useEffect(() => {
    if (existingSubmission?.answers) {
      setReviewData(existingSubmission.answers as ReviewData);
      if (existingSubmission.status === 'submitted') {
        setSubmitted(true);
      }
    }
  }, [existingSubmission]);

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        employeeId: parseInt(employeeId),
        managerId: parseInt(managerId),
        reviewCycleId: cycleId,
        answers: reviewData,
        status: 'submitted'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };


  const updateOverviewField = (id: string, value: string) => {
    setReviewData((prev) => {
      const updated = {
        ...prev,
        overview: { ...prev.overview, [id]: value },
      };
      return updated;
    });
  };

  const overviewQuestionIds = overviewQuestions.map((q) => q.id);
  const validation = getValidationSummary(reviewData, overviewQuestionIds);

  if (isLoadingSubmission) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-500">
        Loading review form…
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Review submitted!</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          Thank you for completing this performance review. Your feedback has been recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <StatusPill done={validation.overviewDone} label="Form progress" onClick={() => {}} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-8">
              {overviewQuestions.map((q, i) => {
                const IconComp = OVERVIEW_ICONS[i % OVERVIEW_ICONS.length];
                return (
                  <Section
                    key={q.id}
                    icon={createElement(
                      IconComp as ComponentType<{ size?: number }>,
                      { size: 18 },
                    )}
                    title={q.label}
                    prompt={q.prompt}
                    tip={q.tip ?? ""}
                    placeholder={
                      q.placeholder ??
                      "Write your feedback here... (minimum 20 characters)"
                    }
                    value={reviewData.overview[q.id] ?? ""}
                    onChange={(val) => updateOverviewField(q.id, val)}
                  />
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-slate-500">
              {!validation.allDone && (
                <span className="flex items-center gap-1 text-rose-500">
                  <AlertCircle size={12} />
                  Fill in all fields to submit.
                </span>
              )}
              {validation.allDone && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={12} />
                  All sections complete — ready to submit!
                </span>
              )}
            </div>
            <button
              disabled={!validation.allDone || submitMutation.isPending}
              onClick={handleSubmit}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                validation.allDone
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ done, label, onClick }: { done: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
        done
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-rose-50 border-rose-200 text-rose-600'
      }`}
    >
      {done ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
      {label}
    </button>
  );
}

function Section({
  icon,
  title,
  prompt,
  tip,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  prompt: string;
  tip: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const quality = getQuality(value);
  const invalid = value.trim().length < 20;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <span className="text-rose-500 text-xs font-semibold">*</span>
        {invalid && (
          <span className="ml-auto text-[10px] font-semibold text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded-full">
            Required
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full px-4 py-3 text-slate-700 border rounded-xl focus:outline-none focus:ring-2 resize-y transition ${
          invalid
            ? 'border-rose-200 focus:ring-rose-500/20 focus:border-rose-400'
            : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
        }`}
        placeholder={placeholder}
      />
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Lightbulb size={12} />
          <span>{tip}</span>
        </div>
        <div className={quality.color}>
          {`${value.length} chars • ${quality.label}`}
        </div>
      </div>
    </div>
  );
}