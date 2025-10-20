import Button from "@/components/UI/Button";
import type { User } from "@/types";

function Footer({
  currentUser,
  onLogout,
}: {
  currentUser: User | null;
  onLogout: () => void;
}) {
  return (
    <footer className="mt-10 border-t border-pink-500/20 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center gap-3">
        <p className="text-xs text-fuchsia-100/80">
          © {new Date().getFullYear()} Table Prototype
        </p>
        <div className="ml-auto flex items-center gap-2">
          {currentUser ? (
            <>
              <span className="text-xs text-fuchsia-100/80">
                {currentUser.nickname}님 로그인 중
              </span>
              <Button variant="flat" onClick={onLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <span className="text-xs text-fuchsia-100/60">로그인하지 않음</span>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
