export interface Announcement {
  id: number;
  title: string;
  date: string;
  description: string;
}

export interface AbsentUser {
  id: number;
  name: string;
  reason: string;
  department: string;
}

export interface CheckIn {
  id: number;
  name: string;
  time: string;
  department: string;
}

export type Employee = {
  id: number;
  name: string;
  position: string;
  department: string;
};

export interface Team {
  id: number;
  name: string;
  description?: string;
  leaderId?: number | null;
  team_type?: string | null;
  createdAt: string;
}