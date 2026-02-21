export function AuthorAvatar({ initials }: { initials: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
      {initials}
    </div>
  );
}
