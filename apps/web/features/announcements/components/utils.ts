import { Announcement } from "./mock";

export function formatRelative(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return `${diff} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatFull(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function groupAnnouncements(list: Announcement[]) {
  const now    = Date.now();
  const weekMs = 7  * 86400000;
  const monMs  = 30 * 86400000;

  const thisWeek:  Announcement[] = [];
  const thisMonth: Announcement[] = [];
  const older:     Announcement[] = [];

  [...list]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .forEach((a) => {
      const age = now - startOf(a.createdAt);
      if (age <= weekMs)       thisWeek.push(a);
      else if (age <= monMs)   thisMonth.push(a);
      else                     older.push(a);
    });

  return { thisWeek, thisMonth, older };
}
