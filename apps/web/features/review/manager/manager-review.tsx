// app/team/review/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  Star,
  Target,
  Trophy,
  Users,
  MessageSquare,
  TrendingUp,
  Save,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

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
  strengths: string;
  improvements: string;
  goals: string;
  feedback: string;
  competencies: Competency[];
}

// Mock teammate data
const teammate = {
  id: '1',
  name: 'Alex Morgan',
  role: 'Senior Frontend Engineer',
  avatar: 'AM',
  department: 'Engineering',
};

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
  if (len < 20) return { label: 'Add more detail', color: 'text-amber-500' };
  if (len < 80) return { label: 'Good start', color: 'text-emerald-500' };
  return { label: 'Excellent', color: 'text-emerald-600' };
};

// ---------- Main Component ----------
export default function ManagerReviewPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'competencies'>('overview');
  const [reviewData, setReviewData] = useState<ReviewData>({
    strengths: '',
    improvements: '',
    goals: '',
    feedback: '',
    competencies: defaultCompetencies,
  });
  const [savedStatus, setSavedStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [overallScore, setOverallScore] = useState(0);
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
      // In real app: API call here
    }, 800);
  }, []);

  const updateTextField = (field: keyof Omit<ReviewData, 'competencies'>, value: string) => {
    setReviewData(prev => {
      const updated = { ...prev, [field]: value };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with teammate info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {teammate.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{teammate.name}</h1>
              <p className="text-sm text-slate-500">
                 {teammate.role} • {teammate.department}
              </p>
            </div>
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

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 px-6 pt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('competencies')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                activeTab === 'competencies'
                  ? 'bg-white text-indigo-600 border-b-2 border-indigo-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Competencies & Rating
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'overview' ? (
              <div className="space-y-8">
                {/* Strengths */}
                <Section
                  icon={<Trophy size={18} />}
                  title="Strengths"
                  prompt="What did they do exceptionally well?"
                  tip="Highlight specific achievements or behaviors."
                  value={reviewData.strengths}
                  onChange={(val) => updateTextField('strengths', val)}
                />
                {/* Areas for improvement */}
                <Section
                  icon={<Target size={18} />}
                  title="Areas for improvement"
                  prompt="What could they develop further?"
                  tip="Be constructive and actionable."
                  value={reviewData.improvements}
                  onChange={(val) => updateTextField('improvements', val)}
                />
                {/* Goals for next period */}
                <Section
                  icon={<TrendingUp size={18} />}
                  title="Goals for next quarter"
                  prompt="What should they focus on in the coming months?"
                  tip="Set SMART goals together."
                  value={reviewData.goals}
                  onChange={(val) => updateTextField('goals', val)}
                />
                {/* Additional feedback */}
                <Section
                  icon={<MessageSquare size={18} />}
                  title="Additional feedback"
                  prompt="Any other comments or context?"
                  tip="This is confidential between you and HR."
                  value={reviewData.feedback}
                  onChange={(val) => updateTextField('feedback', val)}
                />
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
                  return (
                    <div key={comp.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="font-medium text-slate-800">{comp.name}</h4>
                          <p className="text-xs text-slate-500">{comp.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
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
                        placeholder="Add a comment to support your rating..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
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

          {/* Submit button */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end">
            <button
              onClick={() => alert('Review submitted (mock)')}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
            >
              Submit Review
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Gentle reminder */}
        <div className="mt-4 text-center text-xs text-slate-400">
          Your feedback helps {teammate.name} grow. Be specific and kind.
        </div>
      </div>
    </div>
  );
}

// Reusable section component for text fields
function Section({
  icon,
  title,
  prompt,
  tip,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  prompt: string;
  tip: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const quality = getQuality(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="text-sm text-slate-500">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-y transition"
        placeholder="Write your feedback here..."
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