export interface CheckedInUser {
  id: number;
  name: string;
  surname: string;
  team: string;
  checkInTime: string;
  isOut: boolean;
}

export interface NotCheckedInUser {
  id: number;
  name: string;
  surname: string;
  team: string;
  expectedTime: string;
  status: "Pending" | "Late" | "Absent";
}

export const checkedIn: CheckedInUser[] = [
  { id: 1,  name: "Sarah",  surname: "Johnson",  team: "Engineering", checkInTime: "08:42 AM", isOut: false },
  { id: 2,  name: "Marcus", surname: "Lee",      team: "Design",      checkInTime: "08:55 AM", isOut: false },
  { id: 3,  name: "Priya",  surname: "Patel",    team: "Engineering", checkInTime: "09:03 AM", isOut: true  },
  { id: 4,  name: "Tom",    surname: "Nguyen",   team: "Product",     checkInTime: "09:11 AM", isOut: false },
  { id: 5,  name: "Elena",  surname: "Ruiz",     team: "Sales",       checkInTime: "09:20 AM", isOut: false },
  { id: 6,  name: "Dmitri", surname: "Volkov",   team: "Engineering", checkInTime: "09:33 AM", isOut: true  },
];

export const notCheckedIn: NotCheckedInUser[] = [
  { id: 7,  name: "James", surname: "Carter",   team: "Design",      expectedTime: "09:00 AM", status: "Late"    },
  { id: 8,  name: "Aisha", surname: "Mohammed", team: "HR",          expectedTime: "09:00 AM", status: "Pending" },
  { id: 9,  name: "Lucas", surname: "Silva",    team: "Sales",       expectedTime: "09:00 AM", status: "Absent"  },
  { id: 10, name: "Mei",   surname: "Chen",     team: "Engineering", expectedTime: "10:00 AM", status: "Pending" },
];
