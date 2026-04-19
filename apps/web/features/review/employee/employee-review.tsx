// app/review/page.tsx
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
  Target,
  Trophy,
  AlertCircle,
  MessageSquare,
  FileText,
  Sparkles,
  Save,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { useActiveReviewCycle, useSubmitSelfReview, useSelfReviewSubmission } from '../hooks/queries';
import {
  DEFAULT_SELF_REVIEW_QUESTIONS,
  normalizeReviewQuestions,
  type ReviewFormQuestion,
} from '../review-form-defaults';

// ---------- Types ----------
interface Section extends ReviewFormQuestion {
  icon: React.ReactNode;
}

// ---------- Mock AI Suggestions (generic pool for any section) ----------
const aiSuggestionPool: string[] = [
  'Exceeded quarterly KPIs with measurable outcomes',
  'Launched a feature that improved retention or engagement',
  'Mentored teammates or led a cross‑team initiative',
  'Reduced defects or improved reliability in production',
  'Balanced competing priorities while keeping stakeholders aligned',
  'Suggested a process improvement that saved time',
];

// Quality indicator based on length and keyword presence
const getQuality = (text: string): { label: string; color: string } => {
  const len = text.trim().length;
  if (len < 20) return { label: 'Required — add more detail', color: 'text-rose-500' };
  if (len < 80) return { label: 'Good start', color: 'text-amber-500' };
  if (len < 200) return { label: 'Good detail', color: 'text-emerald-500' };
  return { label: 'Excellent detail', color: 'text-emerald-600' };
};

// Calculate a simple completeness score (0-100)
const computeScore = (data: Record<string, string>, sectionCount: number): number => {
  const fields = Object.values(data);
  const totalLength = fields.reduce((sum, val) => sum + val.trim().length, 0);
  const nonEmptyCount = fields.filter((val) => val.trim().length >= 20).length;
  const n = Math.max(1, sectionCount);
  const lengthScore = Math.min(100, (totalLength / 500) * 100);
  const sectionScore = (nonEmptyCount / n) * 100;
  return Math.floor((lengthScore + sectionScore) / 2);
};

const SELF_ICONS = [Target, Trophy, AlertCircle, MessageSquare, FileText, Sparkles] as const;

// ---------- Main Component ----------
interface SelfReviewPageProps {
  employeeId: string;
  cycleId: number;
}

export default function SelfReviewPage({ employeeId, cycleId }: SelfReviewPageProps) {
  const { data: activeCycle } = useActiveReviewCycle();

  const sections: Section[] = useMemo(() => {
    const qs = normalizeReviewQuestions(
      activeCycle?.selfReviewQuestions,
      DEFAULT_SELF_REVIEW_QUESTIONS,
    );
    return qs.map((q, i) => {
      const IconComp = SELF_ICONS[i % SELF_ICONS.length];
      return {
        ...q,
        placeholder: q.placeholder ?? '',
        tip: q.tip ?? '',
        icon: createElement(IconComp as ComponentType<{ size?: number }>, {
          size: 18,
        }),
      };
    });
  }, [activeCycle?.selfReviewQuestions]);

  const [currentSection, setCurrentSection] = useState<string>('');
  const [reviewData, setReviewData] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showReuseMenu, setShowReuseMenu] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const { data: existingSubmission, isLoading: isLoadingSubmission } = useSelfReviewSubmission(cycleId, parseInt(employeeId));
  const submitMutation = useSubmitSelfReview();

  useEffect(() => {
    if (existingSubmission?.answers) {
      setReviewData(existingSubmission.answers);
      if (existingSubmission.status === 'submitted') {
        setSubmitted(true);
      }
    }
  }, [existingSubmission]);

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({
        employeeId: parseInt(employeeId),
        reviewCycleId: cycleId,
        answers: reviewData,
        status: 'submitted'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  useEffect(() => {
    setReviewData((prev) => {
      const next: Record<string, string> = {};
      for (const s of sections) {
        next[s.id] = prev[s.id] ?? '';
      }
      return next;
    });
  }, [sections]);

  useEffect(() => {
    if (!sections.length) return;
    const firstId = sections[0]!.id;
    setCurrentSection((cur) => (cur && sections.some((s) => s.id === cur) ? cur : firstId));
  }, [sections]);

  const current = sections.find((s) => s.id === currentSection);

  // Update score whenever data changes
  useEffect(() => {
    setScore(computeScore(reviewData, sections.length));
  }, [reviewData, sections.length]);

  // Auto-save simulation
  const handleContentChange = (value: string) => {
    if (!currentSection) return;
    setReviewData((prev) => ({ ...prev, [currentSection]: value }));
    setSavedStatus('saving');
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(async () => {
      try {
        await submitMutation.mutateAsync({
          employeeId: parseInt(employeeId),
          reviewCycleId: cycleId,
          answers: { ...reviewData, [currentSection]: value },
          status: 'draft'
        });
        setSavedStatus('saved');
        setLastSaved(new Date());
      } catch (err) {
        setSavedStatus('error');
      }
    }, 1000);
  };

  // AI suggestion (mock)
  const fetchAiSuggestion = useCallback(() => {
    const random =
      aiSuggestionPool[Math.floor(Math.random() * aiSuggestionPool.length)] ?? '';
    setAiSuggestion(random);
    setTimeout(() => setAiSuggestion(''), 5000);
  }, []);

  const insertSuggestion = () => {
    if (!currentSection || !aiSuggestion) return;
    const existing = reviewData[currentSection] ?? '';
    const newText = existing ? `${existing} ${aiSuggestion}` : aiSuggestion;
    handleContentChange(newText);
    setAiSuggestion('');
  };

  // Reuse past answers (mock)
  const reusePastAnswer = (sectionId: string) => {
    const snippets = [
      'Achieved agreed objectives and supported team priorities.',
      'Delivered key milestones on time with clear communication.',
      'Learned from blockers and applied improvements in the next iteration.',
    ];
    const pick = snippets[Math.floor(Math.random() * snippets.length)] ?? snippets[0]!;
    setReviewData((prev) => ({ ...prev, [sectionId]: pick }));
    setSavedStatus('saving');
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      setSavedStatus('saved');
      setLastSaved(new Date());
    }, 800);
    setShowReuseMenu(false);
  };

  // Helper to check if a section is incomplete (too short)
  const isIncomplete = (sectionId: string) => {
    return (reviewData[sectionId] ?? '').trim().length < 20;
  };

  const isAllComplete =
    sections.length > 0 && sections.every((s) => !isIncomplete(s.id));

  // Character count and quality
  const currentText = currentSection ? (reviewData[currentSection] ?? '') : '';
  const charCount = currentText.length;
  const quality = getQuality(currentText);

  if (!current || isLoadingSubmission) {
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
        <h2 className="text-xl font-bold text-slate-800 mb-2">Self-review submitted!</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          Your self-reflection has been recorded. Your manager will be able to see it once they start their part of the review.
        </p>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-600">Step {sections.findIndex(s => s.id === currentSection) + 1} of {sections.length}</span>
            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${((sections.findIndex(s => s.id === currentSection) + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-slate-50/80 border-r border-slate-200 p-4">
              <div className="space-y-1">
                {sections.map((section) => {
                  const isActive = currentSection === section.id;
                  const incomplete = isIncomplete(section.id);
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                        ${isActive
                          ? 'bg-white shadow-sm border border-slate-200 text-indigo-700 font-medium'
                          : 'text-slate-600 hover:bg-white/70'
                        }
                      `}
                    >
                      <span className={isActive ? 'text-indigo-500' : 'text-slate-400'}>
                        {section.icon}
                      </span>
                      <span className="flex-1 text-sm">{section.label}</span>
                      {incomplete ? (
                        <AlertCircle size={14} className="text-rose-400" aria-label="Incomplete" />
                      ) : (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Review Score Preview */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">Completion score</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-800">{score}</span>
                  <span className="text-sm text-slate-400">/100</span>
                </div>
                <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {score < 40 ? 'Add more detail to improve' : score < 70 ? 'Good progress' : 'Excellent reflection'}
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 md:p-8">
              {/* Header with prompt and auto-save status */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    {current.icon}
                    {current.label}
                    <span className="text-rose-500 text-sm">*</span>
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{current.prompt}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
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

              {/* Text area with AI suggestion */}
              <div className="relative">
                <textarea
                  value={currentText}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={current.placeholder || 'Write your reflection…'}
                  rows={6}
                  className={`w-full px-4 py-3 text-slate-700 border rounded-xl focus:outline-none focus:ring-2 resize-y transition-all placeholder:text-slate-400 ${
                    isIncomplete(currentSection)
                      ? 'border-rose-200 focus:ring-rose-500/20 focus:border-rose-400'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                  }`}
                />
                {aiSuggestion && (
                  <div className="absolute bottom-2 left-2 right-2 bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-xs text-indigo-700 flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      {aiSuggestion}
                    </span>
                    <button
                      onClick={insertSuggestion}
                      className="px-2 py-0.5 bg-indigo-100 rounded-md hover:bg-indigo-200 transition"
                    >
                      Use
                    </button>
                  </div>
                )}
              </div>

              {/* Footer: character count, quality, actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{charCount} characters</span>
                  <span className={`font-medium ${quality.color}`}>{quality.label}</span>
                  {isIncomplete(currentSection) && (
                    <span className="text-rose-600 flex items-center gap-1 font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fetchAiSuggestion}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                  >
                    <Sparkles size={12} />
                    <span>AI suggestion</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowReuseMenu(!showReuseMenu)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                    >
                      <RotateCcw size={12} />
                      <span>Reuse past</span>
                    </button>
                    {showReuseMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-10">
                        {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => reusePastAnswer(section.id)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl"
                          >
                            {section.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contextual tip always visible */}
              <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-start gap-2">
                <Lightbulb size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>{current.tip || 'Add enough detail so your manager can give useful feedback.'}</span>
              </div>

              {/* Navigation between sections */}
              <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    const idx = sections.findIndex(s => s.id === currentSection);
                    if (idx > 0) {
                      const prev = sections[idx - 1];
                      if (prev) setCurrentSection(prev.id);
                    }
                  }}
                  disabled={sections.findIndex(s => s.id === currentSection) === 0}
                  className="px-4 py-2 text-sm text-slate-500 disabled:opacity-30 hover:text-slate-700 transition"
                >
                  ← Previous
                </button>
                {sections.findIndex(s => s.id === currentSection) === sections.length - 1 ? (
                  <button
                    disabled={!isAllComplete || submitMutation.isPending}
                    onClick={handleSubmit}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
                      isAllComplete
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Self-Review'} <CheckCircle2 size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const idx = sections.findIndex(s => s.id === currentSection);
                      if (idx < sections.length - 1) {
                        const nxt = sections[idx + 1];
                        if (nxt) setCurrentSection(nxt.id);
                      }
                    }}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
                  >
                    Next Section <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global incomplete warning */}
        {!isAllComplete && (
          <div className="mt-4 text-center text-xs text-rose-600 bg-rose-50 w-fit mx-auto px-4 py-2 rounded-full border border-rose-100 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>Please complete all sections with at least 20 characters to enable submission.</span>
          </div>
        )}
      </div>
    </div>
  );
}