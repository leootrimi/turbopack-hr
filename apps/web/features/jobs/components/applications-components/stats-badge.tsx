import { Stage, stageColors } from "../../types";
import { stages } from "../../types";
    
// Stage Badge
export function StageBadge({ stage }: { stage: Stage }) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${stageColors[stage]}`}>
        {stage}
      </span>
    );
  }