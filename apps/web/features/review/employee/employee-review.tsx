// app/review/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

// ---------- Types ----------
type SectionId = 'goals' | 'achievements' | 'challenges' | 'feedback' | 'summary';

interface Section {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  placeholder: string;
  tip: string;
}

interface ReviewData {
  goals: string;
  achievements: string;
  challenges: string;
  feedback: string;
  summary: string;
}

// ---------- Mock AI Suggestions ----------
const aiSuggestions: Record<SectionId, string[]> = {
  goals: ['Exceeded quarterly KPIs by 15%', 'Launched a new feature that improved retention', 'Mentored two junior developers'],
  achievements: ['Reduced bug rate by 30%', 'Led cross‑team initiative to redesign onboarding'],
  challenges: ['Time management across multiple projects', 'Legacy code migration complexity'],
  feedback: ['More frequent 1:1s would help alignment', 'Great at unblocking team members'],
  summary: ['Ready for promotion next cycle', 'Consistently exceeds expectations'],
};

// Quality indicator based on length and keyword presence
const getQuality = (text: string): { label: string; color: string } => {
  const len = text.trim().length;
  if (len < 20) return { label: 'Too short', color: 'text-rose-500' };
  if (len < 80) return { label: 'Good start', color: 'text-amber-500' };
  if (len < 200) return { label: 'Good detail', color: 'text-emerald-500' };
  return { label: 'Excellent detail', color: 'text-emerald-600' };
};

// Calculate a simple completeness score (0-100)
const computeScore = (data: ReviewData): number => {
  const fields = Object.values(data);
  const totalLength = fields.reduce((sum, val) => sum + val.trim().length, 0);
  const nonEmptyCount = fields.filter((val) => val.trim().length > 20).length;
  // Score: 50% based on total length (up to 500 chars), 50% based on number of substantial sections
  const lengthScore = Math.min(100, (totalLength / 500) * 100);
  const sectionScore = (nonEmptyCount / 5) * 100;
  return Math.floor((lengthScore + sectionScore) / 2);
};

// ---------- Main Component ----------
export default function SelfReviewPage() {
  const [currentSection, setCurrentSection] = useState<SectionId>('goals');
  const [reviewData, setReviewData] = useState<ReviewData>({
    goals: '',
    achievements: '',
    challenges: '',
    feedback: '',
    summary: '',
  });
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showReuseMenu, setShowReuseMenu] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [score, setScore] = useState(0);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sections definition
  const sections: Section[] = [
    { id: 'goals', label: 'Goals', icon: <Target size={18} />, prompt: 'What were your main objectives this quarter?', placeholder: 'E.g., Increase user engagement by 20%...', tip: 'Managers love specific, measurable goals.' },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={18} />, prompt: 'What impact did you have?', placeholder: 'Describe outcomes, not just activities.', tip: 'Highlight results – numbers speak louder.' },
    { id: 'challenges', label: 'Challenges', icon: <AlertCircle size={18} />, prompt: 'What obstacles did you face?', placeholder: 'Be honest – how did you overcome them?', tip: 'Showing growth from challenges is valuable.' },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare size={18} />, prompt: 'How can we improve collaboration?', placeholder: 'Constructive feedback for team/process.', tip: 'Focus on systems, not people.' },
    { id: 'summary', label: 'Summary', icon: <FileText size={18} />, prompt: 'Overall reflection and next steps.', placeholder: 'What do you want to achieve next?', tip: 'This helps leadership plan development.' },
  ];

  const current = sections.find((s) => s.id === currentSection)!;

  // Update score whenever data changes
  useEffect(() => {
    setScore(computeScore(reviewData));
  }, [reviewData]);

  // Auto-save simulation
  const handleContentChange = (value: string) => {
    setReviewData((prev) => ({ ...prev, [currentSection]: value }));
    setSavedStatus('saving');
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      setSavedStatus('saved');
      setLastSaved(new Date());
    }, 800);
  };

  // AI suggestion (mock)
  const fetchAiSuggestion = useCallback(() => {
    const suggestions = aiSuggestions[currentSection];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setAiSuggestion(random);
    // Auto-clear after 3 seconds or allow click to insert
    setTimeout(() => setAiSuggestion(''), 5000);
  }, [currentSection]);

  const insertSuggestion = () => {
    if (aiSuggestion) {
      const newText = reviewData[currentSection]
        ? `${reviewData[currentSection]} ${aiSuggestion}`
        : aiSuggestion;
      handleContentChange(newText);
      setAiSuggestion('');
    }
  };

  // Reuse past answers (mock)
  const reusePastAnswer = (section: SectionId) => {
    const pastAnswers: Record<SectionId, string> = {
      goals: 'Achieved 100% of OKRs last quarter.',
      achievements: 'Launched two major features on time.',
      challenges: 'Handled tight deadlines with team support.',
      feedback: 'Improve documentation process.',
      summary: 'Ready for more responsibility.',
    };
    handleContentChange(pastAnswers[section]);
    setShowReuseMenu(false);
  };

  // Helper to check if a section is incomplete (too short)
  const isIncomplete = (sectionId: SectionId) => {
    return reviewData[sectionId].trim().length < 20;
  };

  // Character count and quality
  const currentText = reviewData[currentSection];
  const charCount = currentText.length;
  const quality = getQuality(currentText);

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
                      {incomplete && !isActive && (
                        <div className="w-2 h-2 rounded-full bg-amber-400" title="Incomplete" />
                      )}
                      {!incomplete && reviewData[section.id].trim().length > 20 && !isActive && (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Review Score Preview */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">Review score</div>
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
                  placeholder={current.placeholder}
                  rows={6}
                  className="w-full px-4 py-3 text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-y transition-all placeholder:text-slate-400"
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
                  {quality.label === 'Too short' && (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Lightbulb size={12} /> {current.tip}
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
                <span>{current.tip}</span>
              </div>

              {/* Navigation between sections */}
              <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    const idx = sections.findIndex(s => s.id === currentSection);
                    if (idx > 0) setCurrentSection(sections[idx - 1].id);
                  }}
                  disabled={sections.findIndex(s => s.id === currentSection) === 0}
                  className="px-4 py-2 text-sm text-slate-500 disabled:opacity-30 hover:text-slate-700 transition"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    const idx = sections.findIndex(s => s.id === currentSection);
                    if (idx < sections.length - 1) setCurrentSection(sections[idx + 1].id);
                  }}
                  disabled={sections.findIndex(s => s.id === currentSection) === sections.length - 1}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 disabled:opacity-50"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gentle reminder for incomplete sections */}
        {Object.values(reviewData).every(v => v.trim().length < 20) && (
          <div className="mt-4 text-center text-xs text-amber-600 bg-amber-50 w-fit mx-auto px-3 py-1.5 rounded-full">
            ✍️ Try adding a few more details – your reflection helps your manager understand your impact.
          </div>
        )}
      </div>
    </div>
  );
}