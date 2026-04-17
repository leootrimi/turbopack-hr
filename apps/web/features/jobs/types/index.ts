
// ---------- Types ----------
export type Stage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export interface Application {
  id: string;
  name: string;
  position: string;
  department: string;
  stage: Stage;
  appliedDate: string;
  email: string;
  phone: string;
  location: string;
  cvUrl: string;
  notes: string;
  timeline: { action: string; date: string }[];
}

export const stages: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

export const stageColors: Record<Stage, string> = {
    Applied: 'bg-blue-100 text-blue-800 border-blue-200',
    Screening: 'bg-purple-100 text-purple-800 border-purple-200',
    Interview: 'bg-amber-100 text-amber-800 border-amber-200',
    Offer: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Hired: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  };