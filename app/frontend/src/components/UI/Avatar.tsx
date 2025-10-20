import type { User } from "@/types";

export function Avatar({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold text-white"
        style={{ background: `hsl(${user.avatarHue} 90% 50%)` }}
      >
        {user.nickname[0].toUpperCase()}
      </div>
      <span className="text-sm text-white/90">{user.nickname}</span>
    </div>
  );
}
