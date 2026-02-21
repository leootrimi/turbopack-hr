export const TEAM_COLORS: Record<string, string> = {
  Engineering: "#6366f1",
  Design:      "#ec4899",
  Product:     "#f59e0b",
  Sales:       "#14b8a6",
  HR:          "#8b5cf6",
};

export const STATUS_CONFIG = {
  Pending: { bg: "#eff6ff", text: "#1d4ed8", label: "Pending" },
  Late:    { bg: "#fefce8", text: "#854d0e", label: "Late"    },
  Absent:  { bg: "#fef2f2", text: "#991b1b", label: "Absent"  },
} as const;

export function getTeamColor(team: string): string {
  return TEAM_COLORS[team] ?? "#94a3b8";
}

export function getInitials(name: string, surname: string): string {
  return `${name[0]}${surname[0]}`.toUpperCase();
}