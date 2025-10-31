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