import { AnnouncementTag, TAG_CONFIG } from "./mock";

export function TagBadge({ tag }: { tag: AnnouncementTag }) {
  const { bg, text } = TAG_CONFIG[tag];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {tag}
    </span>
  );
}
