import { getTeamColor } from "./config";

interface TeamPillProps {
  team: string;
}

export function TeamPill({ team }: TeamPillProps) {
  const color = getTeamColor(team);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ backgroundColor: color + "18", color }}
    >
      {team}
    </span>
  );
}