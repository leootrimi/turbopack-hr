import { CheckedInUser } from "./mock";
import { getTeamColor } from "./config";
import { Avatar } from "./Avatar";
import { TeamPill } from "./TeamPill";
import { LocationBadge } from "./LocationBadge";

interface CheckedInRowProps {
  user: CheckedInUser;
}

export function CheckedInRow({ user }: CheckedInRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
      <Avatar name={user.name} surname={user.surname} color={getTeamColor(user.team)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {user.name} {user.surname}
        </p>
        <TeamPill team={user.team} />
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-mono text-slate-500">{user.checkInTime}</p>
        <LocationBadge isOut={user.isOut} />
      </div>
    </div>
  );
}
