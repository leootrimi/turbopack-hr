export type LeaveType = "Vacation" | "Work From Home" | "Sick Leave" | "Marriage" | "Bereavement" | "Unpaid";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  color: string;
  icon: string;
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: RequestStatus;
  submittedAt: Date;
  reviewedBy?: string;
  note?: string;  // manager note
}

export const LEAVE_CONFIG: Record<LeaveType, { color: string; bg: string; text: string; icon: string; description: string }> = {
  "Vacation":       { color: "#6366f1", bg: "#eef2ff", text: "#4338ca", icon: "✈️", description: "Annual paid vacation days" },
  "Work From Home": { color: "#14b8a6", bg: "#f0fdfa", text: "#0f766e", icon: "🏠", description: "Remote work days" },
  "Sick Leave":     { color: "#ec4899", bg: "#fdf2f8", text: "#be185d", icon: "🏥", description: "Medical & health related" },
  "Marriage":       { color: "#f59e0b", bg: "#fffbeb", text: "#b45309", icon: "💍", description: "Marriage leave allowance" },
  "Bereavement":    { color: "#8b5cf6", bg: "#f5f3ff", text: "#6d28d9", icon: "🕊️", description: "Bereavement & compassionate" },
  "Unpaid":         { color: "#94a3b8", bg: "#f8fafc", text: "#475569", icon: "📋", description: "Unpaid leave of absence" },
};

export const STATUS_CONFIG: Record<RequestStatus, { bg: string; text: string; dot: string }> = {
  Pending:  { bg: "#fefce8", text: "#854d0e", dot: "#f59e0b" },
  Approved: { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  Rejected: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
};

export const LEAVE_BALANCES: LeaveBalance[] = [
  { type: "Vacation",       total: 25, used: 9,  color: "#6366f1" },
  { type: "Work From Home", total: 48, used: 21, color: "#14b8a6" },
  { type: "Sick Leave",     total: 10, used: 2,  color: "#ec4899" },
  { type: "Marriage",       total: 5,  used: 0,  color: "#f59e0b" },
  { type: "Bereavement",    total: 5,  used: 0,  color: "#8b5cf6" },
  { type: "Unpaid",         total: 30, used: 3,  color: "#94a3b8" },
];

const daysAgo  = (n: number) => new Date(Date.now() - n * 86400000);
const fromNow  = (n: number) => {
  const d = new Date(Date.now() + n * 86400000);
  return d.toISOString().split("T")[0];
};
const past = (n: number) => {
  const d = daysAgo(n);
  return d.toISOString().split("T")[0];
};

export const MOCK_REQUESTS: LeaveRequest[] = [
  {
    id: "1",
    type: "Vacation",
    startDate: fromNow(10),
    endDate: fromNow(17),
    days: 7,
    reason: "Family holiday to Greece",
    status: "Approved",
    submittedAt: daysAgo(5),
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "2",
    type: "Work From Home",
    startDate: fromNow(3),
    endDate: fromNow(3),
    days: 1,
    reason: "",
    status: "Pending",
    submittedAt: daysAgo(1),
  },
  {
    id: "3",
    type: "Sick Leave",
    startDate: fromNow(1),
    endDate: fromNow(2),
    days: 2,
    reason: "Doctor appointment and recovery",
    status: "Pending",
    submittedAt: daysAgo(0),
  },
  {
    id: "4",
    type: "Vacation",
    startDate: past(30),
    endDate: past(25),
    days: 5,
    reason: "Summer break",
    status: "Approved",
    submittedAt: daysAgo(40),
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "5",
    type: "Sick Leave",
    startDate: past(60),
    endDate: past(60),
    days: 1,
    reason: "Flu",
    status: "Approved",
    submittedAt: daysAgo(61),
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "6",
    type: "Work From Home",
    startDate: past(14),
    endDate: past(13),
    days: 2,
    reason: "Home repairs",
    status: "Rejected",
    submittedAt: daysAgo(16),
    reviewedBy: "Sarah Johnson",
    note: "WFH limit reached for this month.",
  },
];
