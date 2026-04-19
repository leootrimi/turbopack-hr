// app/team/review/[id]/page.tsx
'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
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
  Save,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { useActiveReviewCycle } from '../hooks/queries';
import {
  DEFAULT_MANAGER_OVERVIEW_QUESTIONS,
  normalizeReviewQuestions,
} from '../review-form-defaults';

// ---------- Types ----------
type Rating = 1 | 2 | 3 | 4 | 5;

interface Competency {
  id: string;
  name: string;
  description: string;
  rating: Rating | null;
  comment: string;
}

interface ReviewData {
  overview: Record<string, string>;
  competencies: Competency[];
}

// Mock competencies
const defaultCompetencies: Competency[] = [
  { id: 'c1', name: 'Technical skills', description: 'Quality of code, problem‑solving, architecture', rating: null, comment: '' },
  { id: 'c2', name: 'Collaboration', description: 'Teamwork, knowledge sharing, communication', rating: null, comment: '' },
  { id: 'c3', name: 'Ownership', description: 'Proactiveness, accountability, follow‑through', rating: null, comment: '' },
  { id: 'c4', name: 'Impact', description: 'Business value, results, leadership', rating: null, comment: '' },
];

// Helper to calculate overall score (average of competency ratings)
const computeOverallScore = (competencies: Competency[]): number => {
  const rated = competencies.filter(c => c.rating !== null);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((acc, c) => acc + (c.rating as number), 0);
  return Math.round((sum / rated.length) * 20); // convert 1-5 to 0-100
};

// Quality indicator for text length
const getQuality = (text: string): { label: string; color: string } => {
  const len = text.trim().length;
  if (len < 20) return { label: 'Required — add more detail', color: 'text-rose-500' };
  if (len < 80) return { label: 'Good start', color: 'text-emerald-500' };
  return { label: 'Excellent', color: 'text-emerald-600' };
};

// Validation helpers
const TEXT_MIN = 20;
const isTextValid = (text: string) => text.trim().length >= TEXT_MIN;

function getValidationSummary(
  data: ReviewData,
  overviewQuestionIds: string[],
): { overviewDone: boolean; competenciesDone: boolean; allDone: boolean } {
  const overviewDone = overviewQuestionIds.every((id) =>
    isTextValid(data.overview[id] ?? ''),
  );

  const competenciesDone = data.competencies.every(
    (c) => c.rating !== null && isTextValid(c.comment),
  );

  return { overviewDone, competenciesDone, allDone: overviewDone && competenciesDone };
}

const OVERVIEW_ICONS = [Trophy, Target, TrendingUp, MessageSquare, Star] as const;

// ---------- Main Component ----------
export default function ManagerReviewPage() {
  const { data: activeCycle } = useActiveReviewCycle();
  const overviewQuestions = useMemo(
    () =>
      normalizeReviewQuestions(
        activeCycle?.managerReviewQuestions,
        DEFAULT_MANAGER_OVERVIEW_QUESTIONS,
      ),
    [activeCycle?.managerReviewQuestions],
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'competencies'>('overview');
  const [reviewData, setReviewData] = useState<ReviewData>({
    overview: {},
    competencies: defaultCompetencies,
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
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update overall score when competencies change
  useEffect(() => {
    setOverallScore(computeOverallScore(reviewData.competencies));
  }, [reviewData.competencies]);

  // Auto-save simulation
  const handleAutoSave = useCallback((newData: ReviewData) => {
    setSavedStatus('saving');
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      setSavedStatus('saved');
      setLastSaved(new Date());
    }, 800);
  }, []);

  const updateOverviewField = (id: string, value: string) => {
    setReviewData((prev) => {
      const updated = {
        ...prev,
        overview: { ...prev.overview, [id]: value },
      };
      handleAutoSave(updated);
      return updated;
    });
  };

  const updateCompetency = (id: string, updates: Partial<Competency>) => {
    setReviewData(prev => {
      const newComps = prev.competencies.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      const updated = { ...prev, competencies: newComps };
      handleAutoSave(updated);
      return updated;
    });
  };

  const getCharCountQuality = (text: string) => {
    const len = text.length;
    const quality = getQuality(text);
    return { len, quality };
  };

  const overviewQuestionIds = overviewQuestions.map((q) => q.id);
  const validation = getValidationSummary(reviewData, overviewQuestionIds);

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

        {/* Required fields notice */}
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertCircle size={14} className="shrink-0 text-amber-500" />
          <span>All fields are <strong>required</strong>. Every section must have at least 20 characters and all competencies must be rated before you can submit.</span>
        </div>

        {/* Completion status bar */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <StatusPill done={validation.overviewDone} label="Overview complete" onClick={() => setActiveTab('overview')} />
          <StatusPill done={validation.competenciesDone} label="Competencies complete" onClick={() => setActiveTab('competencies')} />
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 px-6 pt-4 gap-1">
            <TabButton
              active={activeTab === 'overview'}
              done={validation.overviewDone}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </TabButton>
            <TabButton
              active={activeTab === 'competencies'}
              done={validation.competenciesDone}
              onClick={() => setActiveTab('competencies')}
            >
              Competencies & Rating
            </TabButton>
            {/* Auto-save status */}
            <div className="ml-auto flex items-center text-xs pb-2 self-end">
              {savedStatus === 'saving' && (
                <span className="text-slate-400 flex items-center gap-1">
                  <Save size={12} className="animate-pulse" /> Saving...
                </span>
              )}
              {savedStatus === 'saved' && lastSaved && (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Saved just now
                </span>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'overview' ? (
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
                      tip={q.tip ?? ''}
                      placeholder={
                        q.placeholder ??
                        'Write your feedback here... (minimum 20 characters)'
                      }
                      value={reviewData.overview[q.id] ?? ''}
                      onChange={(val) => updateOverviewField(q.id, val)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Star size={18} className="text-amber-500" />
                    Competency ratings
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{overallScore}</div>
                    <div className="text-xs text-slate-500">Overall score</div>
                    <div className="mt-1 h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overallScore}%` }} />
                    </div>
                  </div>
                </div>

                {reviewData.competencies.map((comp) => {
                  const { len, quality } = getCharCountQuality(comp.comment);
                  const ratingMissing = comp.rating === null;
                  const commentMissing = !isTextValid(comp.comment);
                  return (
                    <div
                      key={comp.id}
                      className={`border rounded-xl p-4 transition-colors ${
                        ratingMissing || commentMissing
                          ? 'border-rose-200 bg-rose-50/30'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="font-medium text-slate-800 flex items-center gap-1.5">
                            {comp.name}
                            {(ratingMissing || commentMissing) && (
                              <span className="text-[10px] font-semibold text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded-full">
                                Required
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500">{comp.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {ratingMissing && (
                            <span className="text-xs text-rose-400 mr-1">Rate →</span>
                          )}
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateCompetency(comp.id, { rating: star as Rating })}
                              className={`p-1 rounded-md transition ${
                                (comp.rating ?? 0) >= star
                                  ? 'text-amber-400 hover:text-amber-500'
                                  : 'text-slate-300 hover:text-slate-400'
                              }`}
                            >
                              <Star size={20} fill={comp.rating && comp.rating >= star ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={comp.comment}
                        onChange={(e) => updateCompetency(comp.id, { comment: e.target.value })}
                        placeholder="Add a comment to support your rating (required)..."
                        rows={2}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 resize-y transition-colors ${
                          commentMissing
                            ? 'border-rose-200 focus:ring-rose-500/20 bg-white'
                            : 'border-slate-200 focus:ring-indigo-500/20'
                        }`}
                      />
                      {len > 0 && (
                        <div className="flex justify-end mt-1">
                          <span className={`text-[10px] ${quality.color}`}>
                            {len} chars • {quality.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit footer */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-slate-500">
              {!validation.allDone && (
                <span className="flex items-center gap-1 text-rose-500">
                  <AlertCircle size={12} />
                  {!validation.overviewDone && !validation.competenciesDone
                    ? 'Complete all overview fields and rate all competencies to submit.'
                    : !validation.overviewDone
                    ? 'Fill in all overview fields to submit.'
                    : 'Rate all competencies and add comments to submit.'}
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
              disabled={!validation.allDone}
              onClick={() => setSubmitted(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                validation.allDone
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Review
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab button with completion indicator ──
function TabButton({
  children,
  active,
  done,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition flex items-center gap-1.5 ${
        active
          ? 'bg-white text-indigo-600 border-b-2 border-indigo-500'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {done ? (
        <CheckCircle2 size={13} className="text-emerald-500" />
      ) : (
        <AlertCircle size={13} className="text-rose-400" />
      )}
      {children}
    </button>
  );
}

// ── Status pill ──
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

// ── Reusable section component for text fields ──
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