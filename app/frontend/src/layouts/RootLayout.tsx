import type { FC } from "react";
import { Link, Outlet } from "react-router-dom";
import Button from "@/components/UI/Button";
import { Avatar } from "@/components/UI/Avatar";
import { useAuth } from "@/hooks/useAuth";
import type { PublicUser } from "@/types/user";
import Footer from "./Footer";
import { logout } from "@/services/auth";

interface RootLayoutProps {}

function NeonShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full text-white relative overflow-x-hidden flex flex-col">
      <div className="absolute inset-0 -z-10 bg-[#06040a]" />
      <div className="absolute inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_10%_10%,#ff2d95_0%,transparent_35%),radial-gradient(circle_at_90%_10%,#00d4ff_0%,transparent_35%),radial-gradient(circle_at_50%_100%,#7c3aed_0%,transparent_45%)]" />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ boxShadow: "inset 0 0 180px rgba(0,0,0,0.6)" }}
      />
      {children}
      <style>{`
.neon-card { background: rgba(0,0,0,.5); border: 1px solid rgba(244,114,182,.25); box-shadow: 0 0 30px rgba(255,45,149,.12); }
.neon-card:hover { transform: translateY(-2px); box-shadow: 1px 1px 42px rgba(255,45,149,.31); }


/* Improved, production-friendly glitch */
.glitch {
position: relative;
display: inline-block;
line-height: 1;
white-space: nowrap;
--offset: 2px;
--c1: #00d4ff; /* cyan */
--c2: #ff2d95; /* magenta */
text-shadow: 0 0 0 #fff, 0 0 10px rgba(255,45,149,.25);
}
.glitch::before, .glitch::after {
content: attr(data-text);
position: absolute;
inset: 0;
overflow: hidden;
pointer-events: none;
}
/* upper slice — cyan */
.glitch::before {
color: var(--c1);
transform: translate(calc(var(--offset) * -1), 0);
clip-path: polygon(0 0, 100% 0, 100% 48%, 0 48%);
mix-blend-mode: screen;
animation: glitch-top 1.6s steps(2, end) infinite, glitch-flicker 2.8s linear infinite;
}
/* lower slice — magenta */
.glitch::after {
color: var(--c2);
transform: translate(var(--offset), 0);
clip-path: polygon(0 52%, 100% 52%, 100% 100%, 0 100%);
mix-blend-mode: screen;
animation: glitch-btm 1.6s steps(2, end) infinite, glitch-flicker 3.2s linear infinite;
}
/* subtle skew on hover for extra punch */
.glitch:hover { animation: glitch-skew .8s steps(2, end) infinite; }


@keyframes glitch-top {
0% { transform: translate(-2px, -1px); }
15% { transform: translate(-3px, 0px); }
30% { transform: translate(-1px, 1px); }
45% { transform: translate(-4px, 2px); }
60% { transform: translate(-2px, -1px); }
75% { transform: translate(-3px, 1px); }
100% { transform: translate(-2px, 0px); }
}
@keyframes glitch-btm {
0% { transform: translate(2px, 1px); }
15% { transform: translate(3px, 0px); }
30% { transform: translate(1px,-1px); }
45% { transform: translate(4px,-2px); }
60% { transform: translate(2px, 1px); }
75% { transform: translate(3px,-1px); }
100% { transform: translate(2px, 0px); }
`}</style>
    </div>
  );
}

function Header({ currentUser }: { currentUser: PublicUser | null }) {
  const { isAuthenticated } = useAuth();
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-black/40 border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to={"/"}>
          <div className="text-xl font-extrabold tracking-tight select-none">
            <span className="glitch" data-text="NEON ARCADE">
              NEON ARCADE
            </span>
          </div>
        </Link>
        <nav className="ml-6 flex items-center gap-1">
          <Link to={"/posts"}>
            <Button variant="ghost">게시판</Button>
          </Link>
          {isAuthenticated && (
            <Link to={"/posts/write"}>
              <Button variant="ghost">글쓰기</Button>
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2 pr-3">
          {currentUser ? (
            <>
              <Avatar user={currentUser} />
              <span className="text-xs text-white/70 hidden sm:block">
                어서오세요!
              </span>
            </>
          ) : (
            <>
              <Link to={"/login"}>
                <Button variant="flat">로그인</Button>
              </Link>
              <Link to={"/signup"}>
                <Button>회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const RootLayout: FC<RootLayoutProps> = () => {
  const { user, setUser } = useAuth();
  return (
    <NeonShell>
      <Header currentUser={user} />
      <main className="w-full h-full flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer
        currentUser={user}
        onLogout={async () => {
          await logout();
          setUser(null);
        }}
      />
    </NeonShell>
  );
};

export default RootLayout;
