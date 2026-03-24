import { Avatar, SectionHeader } from "../components/shared";
import { MILESTONES } from "./mock";

export function MilestonesWidget() {
  return (
    <div>
      <SectionHeader title="Milestones" />
      <div className="flex flex-col gap-2">
        {MILESTONES.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border" 
            
          >
            <span className="text-base w-5 text-center leading-none shrink-0">
              {m.icon}
            </span>
            <Avatar initials={m.initials} color={m.color} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate">
                {m.name}
              </p>
              <p
                className="text-[10px] font-semibold"
                style={{ color: m.color }}
              >
                {m.event}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">
              {m.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
