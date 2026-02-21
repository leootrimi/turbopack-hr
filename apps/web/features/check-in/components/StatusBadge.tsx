import { STATUS_CONFIG } from "./config";

type Status = keyof typeof STATUS_CONFIG;

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex text-[11px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}
