/** @deprecated Prefer dynamic types from API; kept for styling presets. */
export type LeaveType =
  | "Vacation"
  | "Work From Home"
  | "Sick Leave"
  | "Personal Day"
  | "Marriage"
  | "Bereavement"
  | "Unpaid";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

/** Matches GET /time-off/balance (from `time_off_balance` in DB). */
export interface TimeOffBalanceApi {
  timeOffTypeId: number;
  typeName: string;
  total: string;
  used: string;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  color: string;
}

function parseBalanceNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

/** Types not tracked in `time_off_balance` — treat as effectively uncapped for validation. */
const UNTRACKED_BALANCE = { total: 9999, used: 0 };

/**
 * Map DB balance row to total/used for a leave type.
 * Vacation / Sick Leave / Personal Day use `time_off_balance` columns; others are uncapped.
 */
export function getBalanceForLeaveType(
  rows: TimeOffBalanceApi[] | undefined,
  type: string,
): { total: number; used: number } {
  if (!rows || !Array.isArray(rows)) return { ...UNTRACKED_BALANCE };
  const b = rows.find(r => r.typeName === type);
  if (b) {
    return {
      total: parseBalanceNum(b.total),
      used: parseBalanceNum(b.used),
    };
  }
  return { ...UNTRACKED_BALANCE };
}

export interface LeaveRequest {
  id: string;
  type: string;
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
  "Personal Day":   { color: "#0ea5e9", bg: "#f0f9ff", text: "#0369a1", icon: "📌", description: "Personal day allowance" },
  "Marriage":       { color: "#f59e0b", bg: "#fffbeb", text: "#b45309", icon: "💍", description: "Marriage leave allowance" },
  "Bereavement":    { color: "#8b5cf6", bg: "#f5f3ff", text: "#6d28d9", icon: "🕊️", description: "Bereavement & compassionate" },
  "Unpaid":         { color: "#94a3b8", bg: "#f8fafc", text: "#475569", icon: "📋", description: "Unpaid leave of absence" },
};

const FALLBACK_LEAVE_STYLE = {
  color: "#64748b",
  bg: "#f8fafc",
  text: "#334155",
  icon: "📋",
  description: "Time off",
} as const;

export function getLeaveTypeConfig(typeName: string): {
  color: string;
  bg: string;
  text: string;
  icon: string;
  description: string;
} {
  if (Object.prototype.hasOwnProperty.call(LEAVE_CONFIG, typeName)) {
    return LEAVE_CONFIG[typeName as LeaveType];
  }
  return { ...FALLBACK_LEAVE_STYLE, description: typeName };
}

/** Build sidebar cards for the given type names (from API), totals from DB where applicable. */
export function buildLeaveBalancesFromApi(
  rows: TimeOffBalanceApi[] | undefined,
  typeNames: string[],
): LeaveBalance[] {
  return typeNames.map((type) => {
    const { total, used } = getBalanceForLeaveType(rows, type);
    return {
      type,
      total,
      used,
      color: getLeaveTypeConfig(type).color,
    };
  });
}

export const STATUS_CONFIG: Record<RequestStatus, { bg: string; text: string; dot: string }> = {
  Pending:  { bg: "#fefce8", text: "#854d0e", dot: "#f59e0b" },
  Approved: { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  Rejected: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
};