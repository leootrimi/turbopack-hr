export type EquipmentCategory = "Laptop" | "Monitor" | "Phone" | "Tablet" | "Keyboard" | "Mouse" | "Headset" | "Desk" | "Chair" | "Other";
export type EquipmentCondition = "New" | "Used" | "Refurbished";
export type EquipmentStatus    = "Available" | "Assigned" | "Under Repair" | "Retired";
export type EquipmentLocation  = "Office" | "Remote" | "Warehouse";



export const CATEGORIES: EquipmentCategory[] = [
  "Laptop", "Monitor", "Phone", "Tablet", "Keyboard", "Mouse", "Headset", "Desk", "Chair", "Other",
];

export const CATEGORY_ICONS: Record<EquipmentCategory, string> = {
  Laptop:   "💻", Monitor: "🖥️",  Phone:   "📱", Tablet:   "📲",
  Keyboard: "⌨️",  Mouse:   "🖱️",  Headset: "🎧", Desk:     "🪑",
  Chair:    "🪑",  Other:   "📦",
};

export const CONDITIONS: EquipmentCondition[] = ["New", "Used", "Refurbished"];
export const STATUSES: EquipmentStatus[]       = ["Available", "Assigned", "Under Repair", "Retired"];
export const LOCATIONS: EquipmentLocation[]    = ["Office", "Remote", "Warehouse"];

export const STATUS_CONFIG: Record<EquipmentStatus, { bg: string; text: string; dot: string }> = {
  Available:     { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  Assigned:      { bg: "#eef2ff", text: "#4338ca", dot: "#6366f1" },
  "Under Repair":{ bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  Retired:       { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
};

export const CONDITION_CONFIG: Record<EquipmentCondition, { bg: string; text: string }> = {
  New:         { bg: "#f0fdf4", text: "#166534" },
  Used:        { bg: "#fefce8", text: "#854d0e" },
  Refurbished: { bg: "#eff6ff", text: "#1d4ed8" },
};

export const EMPLOYEES = [
  "Sarah Johnson", "Marcus Lee", "Priya Patel", "Tom Nguyen",
  "Elena Ruiz", "Dmitri Volkov", "Aisha Mohammed", "Lucas Silva",
];

export interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const STEPS: Step[] = [
  { id: 1, title: "Basic Information",      subtitle: "What is the equipment?",        icon: "📋" },
  { id: 2, title: "Purchase & Status",      subtitle: "Ownership & lifecycle",          icon: "🧾" },
  { id: 3, title: "Assignment",             subtitle: "Who has it & where is it?",      icon: "👤" },
];
