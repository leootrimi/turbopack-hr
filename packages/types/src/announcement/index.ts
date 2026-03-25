export type AnnouncementTag = "General" | "Urgent" | "HR" | "IT" | "Event";

export interface AnnouncementData {
  id: string;
  title: string;
  body: string;
  tag: AnnouncementTag;
  pinned: boolean;
  author: string;
  authorInitials: string;
  createdAt: string;
}
