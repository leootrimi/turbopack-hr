// ── Check-in analytics ────────────────────────────────────────────────────────
export const checkInTrend = [
  { day: "Mon", checkedIn: 38, absent: 4 },
  { day: "Tue", checkedIn: 40, absent: 2 },
  { day: "Wed", checkedIn: 35, absent: 7 },
  { day: "Thu", checkedIn: 42, absent: 0 },
  { day: "Fri", checkedIn: 30, absent: 12 },
  { day: "Sat", checkedIn: 10, absent: 2 },
];

export const checkInByHour = [
  { hour: "07:00", count: 3 },
  { hour: "08:00", count: 11 },
  { hour: "08:30", count: 18 },
  { hour: "09:00", count: 9 },
  { hour: "09:30", count: 4 },
  { hour: "10:00", count: 2 },
  { hour: "11:00", count: 1 },
];

export const locationSplit = [
  { name: "In Office",   value: 28, fill: "#6366f1" },
  { name: "Remote",      value: 10, fill: "#14b8a6" },
  { name: "Out / Field", value: 4,  fill: "#f59e0b" },
];

// ── User / headcount stats ────────────────────────────────────────────────────
export const headcountByTeam = [
  { team: "Engineering", count: 14, fill: "#6366f1" },
  { team: "Design",      count: 6,  fill: "#ec4899" },
  { team: "Product",     count: 5,  fill: "#f59e0b" },
  { team: "Sales",       count: 9,  fill: "#14b8a6" },
  { team: "HR",          count: 4,  fill: "#8b5cf6" },
  { team: "Finance",     count: 4,  fill: "#06b6d4" },
];

export const headcountGrowth = [
  { month: "Aug", count: 32 },
  { month: "Sep", count: 35 },
  { month: "Oct", count: 36 },
  { month: "Nov", count: 38 },
  { month: "Dec", count: 38 },
  { month: "Jan", count: 42 },
];

export const turnoverData = [
  { month: "Aug", joined: 3, left: 1 },
  { month: "Sep", joined: 4, left: 1 },
  { month: "Oct", joined: 2, left: 2 },
  { month: "Nov", joined: 3, left: 1 },
  { month: "Dec", joined: 1, left: 1 },
  { month: "Jan", joined: 5, left: 1 },
];

// ── Time-off analytics ────────────────────────────────────────────────────────
export const timeOffByType = [
  { name: "Vacation",  days: 42, fill: "#6366f1" },
  { name: "Sick",      days: 18, fill: "#ec4899" },
  { name: "WFH",       days: 35, fill: "#14b8a6" },
  { name: "Unpaid",    days: 6,  fill: "#f59e0b" },
];

export const timeOffTrend = [
  { month: "Aug", days: 12 },
  { month: "Sep", days: 8  },
  { month: "Oct", days: 14 },
  { month: "Nov", days: 20 },
  { month: "Dec", days: 30 },
  { month: "Jan", days: 16 },
];

// ── KPI summary cards ─────────────────────────────────────────────────────────
export const kpis = [
  { label: "Total Employees",    value: "42",   delta: "+5",   deltaType: "up",      sub: "vs last month"   },
  { label: "Avg Attendance",     value: "91%",  delta: "+3%",  deltaType: "up",      sub: "this week"       },
  { label: "Open Requests",      value: "7",    delta: "-2",   deltaType: "down",    sub: "pending approval" },
  { label: "Avg Check-in Time",  value: "08:54",delta: "-4m",  deltaType: "up",      sub: "earlier than last week" },
];
