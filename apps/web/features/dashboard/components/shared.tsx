import { ChevronRight } from "lucide-react";

// ── Avatar ────────────────────────────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const sizeMap = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-7 h-7 text-[10px]",
  md: "w-8 h-8 text-[11px]",
  lg: "w-10 h-10 text-xs",
};

export function Avatar({ initials, color = "#6366f1", size = "md" }: AvatarProps) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ backgroundColor: color + "22", color }}
    >
      {initials}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
      style={{ backgroundColor: color + "1a", color }}
    >
      {label}
    </span>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <h3 className="text-[13px] font-bold text-slate-800 tracking-[-0.01em]">{title}</h3>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-0.5 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          {action}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}
