import { MapPin } from "lucide-react";

interface LocationBadgeProps {
  isOut: boolean;
}

export function LocationBadge({ isOut }: LocationBadgeProps) {
  if (isOut) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-md mt-0.5">
        Out
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md mt-0.5">
      <MapPin size={10} /> In office
    </span>
  );
}
