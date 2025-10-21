import type { User } from "@/types";

export function Avatar({ user }: { user: User }) {
  const hue = user.avatarHue ?? 320;
  const initial = user.nickname?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white"
        style={{ background: `hsl(${hue} 90% 50%)` }}
      >
        {initial}
      </div>
      <span className="text-sm text-white/90">{user.nickname}</span>
    </div>
  );
}
