export type ReviewFormQuestion = {
  id: string;
  label: string;
  prompt: string;
  placeholder?: string;
  tip?: string;
};

export const DEFAULT_SELF_REVIEW_QUESTIONS: ReviewFormQuestion[] = [
  {
    id: "goals",
    label: "Goals",
    prompt: "What were your main objectives this quarter?",
    placeholder: "E.g., Increase user engagement by 20%...",
    tip: "Managers love specific, measurable goals.",
  },
  {
    id: "achievements",
    label: "Achievements",
    prompt: "What impact did you have?",
    placeholder: "Describe outcomes, not just activities.",
    tip: "Highlight results – numbers speak louder.",
  },
  {
    id: "challenges",
    label: "Challenges",
    prompt: "What obstacles did you face?",
    placeholder: "Be honest – how did you overcome them?",
    tip: "Showing growth from challenges is valuable.",
  },
  {
    id: "feedback",
    label: "Feedback",
    prompt: "How can we improve collaboration?",
    placeholder: "Constructive feedback for team/process.",
    tip: "Focus on systems, not people.",
  },
  {
    id: "summary",
    label: "Summary",
    prompt: "Overall reflection and next steps.",
    placeholder: "What do you want to achieve next?",
    tip: "This helps leadership plan development.",
  },
];

export const DEFAULT_MANAGER_OVERVIEW_QUESTIONS: ReviewFormQuestion[] = [
  {
    id: "strengths",
    label: "Strengths",
    prompt: "What did they do exceptionally well?",
    placeholder: "Write your feedback here... (minimum 20 characters)",
    tip: "Highlight specific achievements or behaviors.",
  },
  {
    id: "improvements",
    label: "Areas for improvement",
    prompt: "What could they develop further?",
    placeholder: "Write your feedback here... (minimum 20 characters)",
    tip: "Be constructive and actionable.",
  },
  {
    id: "goals",
    label: "Goals for next quarter",
    prompt: "What should they focus on in the coming months?",
    placeholder: "Write your feedback here... (minimum 20 characters)",
    tip: "Set SMART goals together.",
  },
  {
    id: "feedback",
    label: "Additional feedback",
    prompt: "Any other comments or context?",
    placeholder: "Write your feedback here... (minimum 20 characters)",
    tip: "This is confidential between you and HR.",
  },
];

export function normalizeReviewQuestions(
  fromApi: ReviewFormQuestion[] | null | undefined,
  fallback: ReviewFormQuestion[],
): ReviewFormQuestion[] {
  if (!fromApi?.length) return fallback;
  const cleaned = fromApi.filter(
    (q) =>
      q &&
      typeof q.id === "string" &&
      q.id.trim() &&
      typeof q.label === "string" &&
      q.label.trim() &&
      typeof q.prompt === "string" &&
      q.prompt.trim(),
  );
  return cleaned.length ? cleaned : fallback;
}
