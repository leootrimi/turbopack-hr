import { getInitials } from "./config";

interface AvatarProps {
  name: string;
  surname: string;
  color: string;
}

export function Avatar({ name, surname, color }: AvatarProps) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {getInitials(name, surname)}
    </div>
  );
}
