export type CheckInStatus = "in" | "late" | "absent" | "leave";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface Employee {
  id: number;
  name: string;
  initials: string;
  team: string;
  time?: string;
  status: CheckInStatus;
  location: "office" | "remote" | "—";
}

export interface LeaveCard {
  id: number;
  name: string;
  initials: string;
  type: string;
  icon: string;
  from: string;
  to: string;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  tag: "General" | "Urgent" | "HR" | "IT" | "Event";
  time: string;
}

export interface Request {
  id: number;
  name: string;
  initials: string;
  type: string;
  days: number;
  submitted: string;
  status: RequestStatus;
}

export interface Milestone {
  id: number;
  name: string;
  initials: string;
  event: string;
  date: string;
  icon: string;
  color: string;
}

export const TODAY_CHECKINS: Employee[] = [
  { id: 1, name: "Sarah Johnson",  initials: "SJ", team: "Engineering", time: "08:42", status: "in",     location: "office" },
  { id: 2, name: "Marcus Lee",     initials: "ML", team: "Design",      time: "08:55", status: "in",     location: "office" },
  { id: 3, name: "Priya Patel",    initials: "PP", team: "Engineering", time: "09:03", status: "in",     location: "remote" },
  { id: 4, name: "Tom Nguyen",     initials: "TN", team: "Product",     time: "09:11", status: "in",     location: "office" },
  { id: 5, name: "Elena Ruiz",     initials: "ER", team: "Sales",                      status: "late",   location: "office" },
  { id: 6, name: "James Carter",   initials: "JC", team: "Design",                     status: "absent", location: "—"      },
  { id: 7, name: "Aisha Mohammed", initials: "AM", team: "HR",                         status: "leave",  location: "—"      },
];

export const UPCOMING_LEAVES: LeaveCard[] = [
  { id: 1, name: "Priya Patel",   initials: "PP", type: "Vacation",   icon: "✈️", from: "Mar 18", to: "Mar 25" },
  { id: 2, name: "Marcus Lee",    initials: "ML", type: "WFH",        icon: "🏠", from: "Mar 14", to: "Mar 14" },
  { id: 3, name: "Elena Ruiz",    initials: "ER", type: "Sick Leave", icon: "🏥", from: "Mar 15", to: "Mar 16" },
  { id: 4, name: "Tom Nguyen",    initials: "TN", type: "Vacation",   icon: "✈️", from: "Mar 22", to: "Mar 29" },
  { id: 5, name: "Sarah Johnson", initials: "SJ", type: "WFH",        icon: "🏠", from: "Mar 19", to: "Mar 19" },
  { id: 6, name: "Lucas Silva",   initials: "LS", type: "Marriage",   icon: "💍", from: "Apr 1",  to: "Apr 5" },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: "Office closed Monday — Public Holiday", body: "The office will be closed this coming Monday. Remote work is permitted. All requests must be submitted by Friday EOD.", tag: "General", time: "2h ago" },
  { id: 2, title: "VPN credentials expiring this week",    body: "All VPN credentials expire Friday. Update via the IT portal before 5pm Thursday to avoid access issues.",              tag: "Urgent",  time: "5h ago" },
  { id: 3, title: "Health insurance enrollment open",      body: "Annual open enrollment begins today and closes in two weeks. Log in to the HR portal to review your options.",          tag: "HR",      time: "1d ago" },
];

export const INITIAL_REQUESTS: Request[] = [
  { id: 1, name: "James Carter",   initials: "JC", type: "Vacation",   days: 5, submitted: "Today, 09:00", status: "pending"  },
  { id: 2, name: "Aisha Mohammed", initials: "AM", type: "Sick Leave", days: 2, submitted: "Today, 08:30", status: "pending"  },
  { id: 3, name: "Lucas Silva",    initials: "LS", type: "WFH",        days: 1, submitted: "Yesterday",    status: "pending"  },
  { id: 4, name: "Mei Chen",       initials: "MC", type: "Vacation",   days: 3, submitted: "2 days ago",   status: "approved" },
];

export const MILESTONES: Milestone[] = [
  { id: 1, name: "Tom Nguyen",    initials: "TN", event: "Birthday",       date: "Tomorrow", icon: "🎂", color: "#f43f5e" },
  { id: 2, name: "Sarah Johnson", initials: "SJ", event: "3yr Anniversary",date: "Mar 18",   icon: "⭐", color: "#f59e0b" },
  { id: 3, name: "Priya Patel",   initials: "PP", event: "Birthday",       date: "Mar 20",   icon: "🎂", color: "#f43f5e" },
  { id: 4, name: "Marcus Lee",    initials: "ML", event: "5yr Anniversary",date: "Mar 22",   icon: "⭐", color: "#6366f1" },
];

export const ATTENDANCE_DATA = [
  { day: "Mon", present: 38, absent: 4,  wfh: 6  },
  { day: "Tue", present: 40, absent: 2,  wfh: 5  },
  { day: "Wed", present: 35, absent: 7,  wfh: 8  },
  { day: "Thu", present: 42, absent: 0,  wfh: 4  },
  { day: "Fri", present: 30, absent: 12, wfh: 10 },
];

export const DEPT_DATA = [
  { dept: "Engineering", pct: 94, color: "#6366f1" },
  { dept: "Design",      pct: 87, color: "#14b8a6" },
  { dept: "Product",     pct: 91, color: "#f59e0b" },
  { dept: "Sales",       pct: 78, color: "#f43f5e" },
  { dept: "HR",          pct: 100,color: "#22c55e" },
];
