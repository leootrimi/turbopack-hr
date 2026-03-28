export type ReportsRange =
  | 'this_week'
  | 'this_month'
  | 'last_3_months'
  | 'this_year';

export const CHART_COLORS = [
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f43f5e',
] as const;

export function normalizeReportsRange(raw: string): ReportsRange {
  const allowed: ReportsRange[] = [
    'this_week',
    'this_month',
    'last_3_months',
    'this_year',
  ];
  return allowed.includes(raw as ReportsRange)
    ? (raw as ReportsRange)
    : 'this_month';
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function getRangeBounds(range: ReportsRange): {
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
} {
  const now = new Date();
  const to = endOfDay(now);
  let from: Date;

  switch (range) {
    case 'this_week': {
      const d = new Date(now);
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      d.setDate(d.getDate() + diff);
      from = startOfDay(d);
      break;
    }
    case 'this_month':
      from = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      break;
    case 'last_3_months':
      from = startOfDay(
        new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
      );
      break;
    case 'this_year':
      from = startOfDay(new Date(now.getFullYear(), 0, 1));
      break;
  }

  const durationMs = to.getTime() - from.getTime();
  const prevTo = endOfDay(new Date(from.getTime() - 86400000));
  const prevFrom = startOfDay(new Date(prevTo.getTime() - durationMs));

  return { from, to, prevFrom, prevTo };
}

export function filterLogsByRange<
  T extends { checkinTime: Date | null },
>(logs: T[], from: Date, to: Date): T[] {
  return logs.filter((l) => {
    if (!l.checkinTime) return false;
    const t = new Date(l.checkinTime);
    return t >= from && t <= to;
  });
}

export function buildCheckInTrend(
  range: ReportsRange,
  logs: { employeeId: number; checkinTime: Date | null }[],
  totalEmployees: number,
  from: Date,
  to: Date,
): { label: string; checkedIn: number; absent: number }[] {
  const logsInRange = filterLogsByRange(logs, from, to);
  const labelsWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (range === 'this_week') {
    const out: { label: string; checkedIn: number; absent: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(from);
      day.setDate(from.getDate() + i);
      const ds = startOfDay(day);
      const de = endOfDay(day);
      const set = new Set(
        logsInRange
          .filter((l) => {
            const t = new Date(l.checkinTime!);
            return t >= ds && t <= de;
          })
          .map((l) => l.employeeId),
      );
      const checkedIn = set.size;
      out.push({
        label: labelsWeek[i]!,
        checkedIn,
        absent: Math.max(0, totalEmployees - checkedIn),
      });
    }
    return out;
  }

  if (range === 'this_month') {
    const dim = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
    const numBuckets = Math.min(5, Math.max(1, Math.ceil(dim / 7)));
    const daysPer = Math.ceil(dim / numBuckets);
    const out: { label: string; checkedIn: number; absent: number }[] = [];
    for (let b = 0; b < numBuckets; b++) {
      const startD = 1 + b * daysPer;
      const endD = Math.min(startD + daysPer - 1, dim);
      const bStart = startOfDay(
        new Date(from.getFullYear(), from.getMonth(), startD),
      );
      const bEnd = endOfDay(
        new Date(from.getFullYear(), from.getMonth(), endD),
      );
      const set = new Set(
        logsInRange
          .filter((l) => {
            const t = new Date(l.checkinTime!);
            return t >= bStart && t <= bEnd;
          })
          .map((l) => l.employeeId),
      );
      out.push({
        label: `Part ${b + 1}`,
        checkedIn: set.size,
        absent: Math.max(0, totalEmployees - set.size),
      });
    }
    return out;
  }

  if (range === 'last_3_months') {
    const out: { label: string; checkedIn: number; absent: number }[] = [];
    for (let m = 2; m >= 0; m--) {
      const ref = new Date(to.getFullYear(), to.getMonth() - m, 1);
      const mStart = startOfDay(ref);
      const mEnd = endOfDay(new Date(ref.getFullYear(), ref.getMonth() + 1, 0));
      const label = ref.toLocaleString('en-US', { month: 'short' });
      const set = new Set(
        logsInRange
          .filter((l) => {
            const t = new Date(l.checkinTime!);
            return t >= mStart && t <= mEnd;
          })
          .map((l) => l.employeeId),
      );
      out.push({
        label,
        checkedIn: set.size,
        absent: Math.max(0, totalEmployees - set.size),
      });
    }
    return out;
  }

  const out: { label: string; checkedIn: number; absent: number }[] = [];
  for (let month = 0; month <= to.getMonth(); month++) {
    const mStart = startOfDay(new Date(to.getFullYear(), month, 1));
    const mEnd = endOfDay(new Date(to.getFullYear(), month + 1, 0));
    const label = mStart.toLocaleString('en-US', { month: 'short' });
    const set = new Set(
      logsInRange
        .filter((l) => {
          const t = new Date(l.checkinTime!);
          return t >= mStart && t <= mEnd;
        })
        .map((l) => l.employeeId),
    );
    out.push({
      label,
      checkedIn: set.size,
      absent: Math.max(0, totalEmployees - set.size),
    });
  }
  return out;
}

export function buildCheckInByHour(
  logs: { checkinTime: Date | null }[],
): { hour: string; count: number }[] {
  const hourMap = new Map<number, number>();
  for (const l of logs) {
    if (!l.checkinTime) continue;
    const d = new Date(l.checkinTime);
    const h = d.getHours();
    hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
  }
  const hours = [...hourMap.keys()].sort((a, b) => a - b);
  if (hours.length === 0) {
    return [
      { hour: '09:00', count: 0 },
      { hour: '12:00', count: 0 },
    ];
  }
  return hours.map((h) => ({
    hour: `${String(h).padStart(2, '0')}:00`,
    count: hourMap.get(h) ?? 0,
  }));
}

export function leaveTypeShort(type: string): string {
  const map: Record<string, string> = {
    Vacation: 'Vacation',
    'Sick Leave': 'Sick',
    'Work From Home': 'WFH',
    Unpaid: 'Unpaid',
    Bereavement: 'Bereavement',
    Marriage: 'Marriage',
    'Personal Day': 'Personal',
  };
  return map[type] ?? type;
}
