export type AnnouncementTag = "General" | "Urgent" | "HR" | "IT" | "Event";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  tag: AnnouncementTag;
  author: string;
  authorInitials: string;
  createdAt: Date;
  pinned?: boolean;
}

export const TAG_CONFIG: Record<AnnouncementTag, { bg: string; text: string }> = {
  General: { bg: "#eff6ff", text: "#1d4ed8" },
  Urgent:  { bg: "#fef2f2", text: "#991b1b" },
  HR:      { bg: "#f0fdf4", text: "#166534" },
  IT:      { bg: "#fdf4ff", text: "#6b21a8" },
  Event:   { bg: "#fff7ed", text: "#9a3412" },
};

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Office closed on Monday — Public Holiday",
    body: "Please note the office will be closed this coming Monday due to a public holiday. Remote work is permitted. All requests should be submitted by Friday EOD.",
    tag: "General",
    author: "Sarah Johnson",
    authorInitials: "SJ",
    createdAt: daysAgo(1),
    pinned: true,
  },
  {
    id: "2",
    title: "Urgent: VPN credentials expiring this week",
    body: "All VPN credentials will expire on Friday. Please update your credentials via the IT portal before 5pm Thursday to avoid access issues.",
    tag: "Urgent",
    author: "Dmitri Volkov",
    authorInitials: "DV",
    createdAt: daysAgo(2),
    pinned: true,
  },
  {
    id: "3",
    title: "New health insurance enrollment period open",
    body: "The annual health insurance open enrollment period begins today and closes in two weeks. Log in to the HR portal to review your options and make any changes.",
    tag: "HR",
    author: "Aisha Mohammed",
    authorInitials: "AM",
    createdAt: daysAgo(3),
  },
  {
    id: "4",
    title: "Team lunch this Friday — sign up!",
    body: "We're organising a team lunch this Friday at 12:30pm. Please add your name to the shared sheet by Wednesday so we can confirm numbers with the restaurant.",
    tag: "Event",
    author: "Elena Ruiz",
    authorInitials: "ER",
    createdAt: daysAgo(4),
  },
  {
    id: "5",
    title: "Slack workspace migration complete",
    body: "The Slack workspace migration has been completed successfully. If you encounter any issues please raise a ticket with IT.",
    tag: "IT",
    author: "Dmitri Volkov",
    authorInitials: "DV",
    createdAt: daysAgo(12),
  },
  {
    id: "6",
    title: "Updated remote work policy — please review",
    body: "The updated remote work policy is now live on the HR portal. Key changes include the new home-office equipment allowance and updated core hours guidance.",
    tag: "HR",
    author: "Aisha Mohammed",
    authorInitials: "AM",
    createdAt: daysAgo(18),
  },
  {
    id: "7",
    title: "Q4 all-hands meeting recap",
    body: "Thank you to everyone who joined the Q4 all-hands. The recording and slide deck are available in the shared drive under /Company/All-Hands.",
    tag: "General",
    author: "Sarah Johnson",
    authorInitials: "SJ",
    createdAt: daysAgo(25),
  },
  {
    id: "8",
    title: "Holiday party — save the date!",
    body: "Our annual holiday party will be held on December 20th. Venue and further details to follow. Partners welcome — please RSVP by December 10th.",
    tag: "Event",
    author: "Elena Ruiz",
    authorInitials: "ER",
    createdAt: daysAgo(40),
  },
  {
    id: "9",
    title: "Mandatory security training due by end of month",
    body: "All employees must complete the annual security awareness training by the end of this month. The course takes approximately 30 minutes and is available in the learning portal.",
    tag: "IT",
    author: "Dmitri Volkov",
    authorInitials: "DV",
    createdAt: daysAgo(55),
  },
];
