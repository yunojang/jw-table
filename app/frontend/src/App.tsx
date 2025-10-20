import React, { useEffect, useMemo, useReducer, useState } from "react";

// ────────────────────────────────────────────────────────────────────────────────
// Anime Otaku Community — NEON ARCADE Prototype (React + TypeScript + Tailwind)
//  - 요구사항: 회원가입/로그인, 게시물 작성/목록/읽기, 댓글 작성, 페이징
//  - 단일 파일 프리뷰용 시안 (목업 데이터 + 라우터 대체)
//  - 실제 프로젝트에서는 폴더 분리 권장: components/, pages/, lib/, types/
//  - Dev Diagnostics(간단 테스트) 포함 — 기능 회귀 테스트용
// ────────────────────────────────────────────────────────────────────────────────

// ========== Types ==========
type ID = string;

type User = {
  id: ID;
  username: string;
  nickname: string;
  avatarHue: number; // 0~360
  createdAt: number;
};

type Comment = {
  id: ID;
  postId: ID;
  authorId: ID;
  body: string;
  createdAt: number;
};

type Post = {
  id: ID;
  title: string;
  body: string;
  tags: string[];
  authorId: ID;
  createdAt: number;
  likes: number;
};

type DB = {
  users: Record<ID, User>;
  posts: Record<ID, Post>;
  comments: Record<ID, Comment>;
  order: ID[]; // post order (newest first)
};

// ========== Simple Store (LocalStorage Persist) ==========
const LS_KEY = "neon-arcade-db-v1";
const LS_USER = "neon-arcade-current-user";

const now = () => Date.now();
const uid = () => Math.random().toString(36).slice(2, 10);

function seedDB(): DB {
  const u1: User = {
    id: uid(),
    username: "neko_dev",
    nickname: "네코",
    avatarHue: 320,
    createdAt: now() - 86400e3 * 40,
  };
  const u2: User = {
    id: uid(),
    username: "bgm_collector",
    nickname: "BGM",
    avatarHue: 200,
    createdAt: now() - 86400e3 * 28,
  };
  const u3: User = {
    id: uid(),
    username: "figure_owl",
    nickname: "올빼미",
    avatarHue: 40,
    createdAt: now() - 86400e3 * 10,
  };

  const p1: Post = {
    id: uid(),
    title: "10월 신작 1화 감상 — 오프닝 연출 미쳤다🔥",
    body: sampleText(6),
    tags: ["신작", "스포주의"],
    authorId: u1.id,
    createdAt: now() - 3600e3,
    likes: 123,
  };
  const p2: Post = {
    id: uid(),
    title: "OST 추천: 칸노 요코 편곡 모음",
    body: sampleText(4),
    tags: ["음악", "OST"],
    authorId: u2.id,
    createdAt: now() - 3 * 3600e3,
    likes: 77,
  };
  const p3: Post = {
    id: uid(),
    title: "피규어 개봉기: 1/7 스케일 리버스 블레이드",
    body: sampleText(5),
    tags: ["굿즈", "개봉기"],
    authorId: u3.id,
    createdAt: now() - 5 * 3600e3,
    likes: 36,
  };
  const p4: Post = {
    id: uid(),
    title: "작화 vs 연출 — 무엇이 더 중요한가요?",
    body: sampleText(10),
    tags: ["토론"],
    authorId: u1.id,
    createdAt: now() - 86400e3,
    likes: 201,
  };

  const c1: Comment = {
    id: uid(),
    postId: p1.id,
    authorId: u2.id,
    body: "ED는 원곡보다 현장 리듬이 더 살아있더군요.",
    createdAt: now() - 3400e3,
  };
  const c2: Comment = {
    id: uid(),
    postId: p1.id,
    authorId: u3.id,
    body: "컷 전환 속도가 원작의 템포랑 잘 맞았어요.",
    createdAt: now() - 3200e3,
  };
  const c3: Comment = {
    id: uid(),
    postId: p4.id,
    authorId: u2.id,
    body: "콘티 파워로 밀어붙인 작품들 꽤 있죠.",
    createdAt: now() - 86000e3,
  };

  const db: DB = {
    users: { [u1.id]: u1, [u2.id]: u2, [u3.id]: u3 },
    posts: { [p1.id]: p1, [p2.id]: p2, [p3.id]: p3, [p4.id]: p4 },
    comments: { [c1.id]: c1, [c2.id]: c2, [c3.id]: c3 },
    // 초기값은 임시, 아래에서 실제 시간 기준으로 정렬
    order: [p1.id, p2.id, p3.id, p4.id],
  };

  // 실제 생성 시간 기준으로 최신순 정렬
  db.order = [p1.id, p2.id, p3.id, p4.id].sort(
    (a, b) => db.posts[b].createdAt - db.posts[a].createdAt
  );
  return db;
}

function loadDB(): DB {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return seedDB();
  try {
    return JSON.parse(raw) as DB;
  } catch {
    return seedDB();
  }
}
function saveDB(db: DB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}
function loadCurrentUser(): User | null {
  const raw = localStorage.getItem(LS_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
function saveCurrentUser(u: User | null) {
  if (!u) localStorage.removeItem(LS_USER);
  else localStorage.setItem(LS_USER, JSON.stringify(u));
}

// ========== Reducer (pseudo-backend) ==========

type State = {
  db: DB;
  currentUser: User | null;
};

type Action =
  | { type: "signup"; username: string; nickname: string }
  | { type: "login"; username: string }
  | { type: "logout" }
  | { type: "create_post"; title: string; body: string; tags: string[] }
  | { type: "create_comment"; postId: ID; body: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "signup": {
      const exists = Object.values(state.db.users).some(
        (u) => u.username === action.username
      );
      if (exists) return state; // 단순 처리
      const user: User = {
        id: uid(),
        username: action.username,
        nickname: action.nickname || action.username,
        avatarHue: Math.floor(Math.random() * 360),
        createdAt: now(),
      };
      const db: DB = {
        ...state.db,
        users: { ...state.db.users, [user.id]: user },
      };
      saveDB(db);
      saveCurrentUser(user);
      return { db, currentUser: user };
    }
    case "login": {
      const user =
        Object.values(state.db.users).find(
          (u) => u.username === action.username
        ) || null;
      saveCurrentUser(user);
      return { ...state, currentUser: user };
    }
    case "logout": {
      saveCurrentUser(null);
      return { ...state, currentUser: null };
    }
    case "create_post": {
      if (!state.currentUser) return state;
      const id = uid();
      const post: Post = {
        id,
        title: action.title,
        body: action.body,
        tags: action.tags,
        authorId: state.currentUser.id,
        createdAt: now(),
        likes: 0,
      };
      const db: DB = {
        ...state.db,
        posts: { ...state.db.posts, [id]: post },
        order: [id, ...state.db.order],
      };
      saveDB(db);
      return { ...state, db };
    }
    case "create_comment": {
      if (!state.currentUser) return state;
      const id = uid();
      const c: Comment = {
        id,
        postId: action.postId,
        authorId: state.currentUser.id,
        body: action.body,
        createdAt: now(),
      };
      const db: DB = {
        ...state.db,
        comments: { ...state.db.comments, [id]: c },
      };
      saveDB(db);
      return { ...state, db };
    }
    default:
      return state;
  }
}

// ========== Utilities ==========
function timeAgo(ts: number) {
  const s = Math.floor((now() - ts) / 1000);
  if (s < 60) return `${s}초 전`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return `${d}일 전`;
}

function sampleText(paragraphs = 3) {
  const p = `작품의 장면 전환과 타이밍, 그리고 사운드 연출이 서로 얽히며 만들어내는 리듬이 인상적입니다.\n\n원작 대비 일부 컷 구성이 변경되었지만, 애니메이션 문법에 맞게 재배열된 지점들이 호평을 받는 듯합니다. 액션 파트의 모션 블러와 이펙트 레이어 겹침이 과하지 않으면서도 탄력을 살려 줍니다.`;
  return Array.from({ length: paragraphs })
    .map(() => p)
    .join("\n\n");
}

// ========== Router (in-file) ==========

type Route =
  | { name: "list"; page?: number; q?: string }
  | { name: "read"; id: ID }
  | { name: "new" }
  | { name: "login" }
  | { name: "signup" };

// ========== UI Primitives ==========
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "flat";
  }
> = ({ className = "", variant = "primary", ...props }) => {
  const base =
    "px-4 py-2 rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2";
  const map = {
    primary: "bg-pink-600 hover:bg-pink-500 text-white focus:ring-pink-400",
    ghost: "bg-transparent hover:bg-white/5 text-white focus:ring-pink-400",
    flat: "bg-white/10 hover:bg-white/20 text-white focus:ring-white/40",
  } as const;
  return (
    <button className={`${base} ${map[variant]} ${className}`} {...props} />
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full bg-black/50 text-white placeholder-white/50 border border-pink-500/30 focus:ring-2 focus:ring-pink-400 rounded-xl px-4 py-2 ${className}`}
    {...props}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className = "",
  ...props
}) => (
  <textarea
    className={`w-full min-h-[120px] bg-black/50 text-white placeholder-white/50 border border-pink-500/30 focus:ring-2 focus:ring-pink-400 rounded-xl px-4 py-3 ${className}`}
    {...props}
  />
);

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border border-pink-500/30 text-fuchsia-100/90 bg-gradient-to-br from-pink-500 to-fuchsia-600 ${className}`}
  >
    {children}
  </span>
);

function Avatar({ user }: { user: User }) {
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

// ========== Theme Shell (NEON ARCADE) ==========
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

// ========== App Shell ==========
function Header({
  route,
  setRoute,
  currentUser,
}: {
  route: Route;
  setRoute: (r: Route) => void;
  currentUser: User | null;
}) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-black/40 border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="text-xl font-extrabold tracking-tight select-none">
          <span className="glitch" data-text="NEON ARCADE">
            NEON ARCADE
          </span>
        </div>
        <nav className="ml-6 flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => setRoute({ name: "list", page: 1 })}
          >
            게시판
          </Button>
          <Button variant="ghost" onClick={() => setRoute({ name: "new" })}>
            글쓰기
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {currentUser ? (
            <>
              <Avatar user={currentUser} />
              <span className="text-xs text-white/70 hidden sm:block">
                어서오세요!
              </span>
            </>
          ) : (
            <>
              <Button
                variant="flat"
                onClick={() => setRoute({ name: "login" })}
              >
                로그인
              </Button>
              <Button onClick={() => setRoute({ name: "signup" })}>
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <main className="max-w-7xl mx-auto px-4 py-6 flex-1">{children}</main>;
}

// ========== Feature: Post List with Search + Paging ==========
function PostList({
  db,
  setRoute,
  page = 1,
  q = "",
}: {
  db: DB;
  setRoute: (r: Route) => void;
  page?: number;
  q?: string;
}) {
  const [query, setQuery] = useState(q);
  const PAGE_SIZE = 6;

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return db.order.map((id) => db.posts[id]);
    return db.order
      .map((id) => db.posts[id])
      .filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.body.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      );
  }, [db, query]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cur = Math.min(page, pageCount);
  const slice = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);

  return (
    <div>
      <div className="mb-4 flex gap-2 items-stretch">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색: 제목/본문/태그"
        />
        <Button
          className="px-7 whitespace-nowrap"
          variant="flat"
          onClick={() => setQuery("")}
        >
          지우기
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {slice.map((p) => (
          <article
            key={p.id}
            className="neon-card rounded-2xl p-5 transition duration-200"
          >
            <div className="flex items-start gap-3">
              {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 grid place-items-center font-bold">
                {db.users[p.authorId].nickname[0].toUpperCase()}
              </div> */}
              <div className="w-full">
                <h3
                  className="text-lg font-semibold leading-tight cursor-pointer"
                  onClick={() => setRoute({ name: "read", id: p.id })}
                >
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-fuchsia-100/80 line-clamp-2">
                  {p.body}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between w-full gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t}>#{t}</Badge>
                  ))}
                  <span className="ml-auto text-xs text-fuchsia-100/70">
                    {timeAgo(p.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        current={cur}
        totalPages={pageCount}
        onPage={(n) => setRoute({ name: "list", page: n, q: query })}
        className="mt-6"
      />
    </div>
  );
}

function Pagination({
  current,
  totalPages,
  onPage,
  className = "",
}: {
  current: number;
  totalPages: number;
  onPage: (n: number) => void;
  className?: string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="flat"
        disabled={current <= 1}
        onClick={() => onPage(current - 1)}
      >
        이전
      </Button>
      {pages.map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
            n === current
              ? "bg-pink-600 border-pink-400 text-white"
              : "bg-black/40 border-pink-500/20 text-white hover:bg-white/10"
          }`}
        >
          {n}
        </button>
      ))}
      <Button
        variant="flat"
        disabled={current >= totalPages}
        onClick={() => onPage(current + 1)}
      >
        다음
      </Button>
    </div>
  );
}

// ========== Feature: Post Read + Comments ==========
function PostRead({
  db,
  id,
  setRoute,
  onComment,
}: {
  db: DB;
  id: ID;
  setRoute: (r: Route) => void;
  onComment: (postId: ID, body: string) => void;
}) {
  const post = db.posts[id];
  if (!post)
    return <div className="text-white/80">해당 글을 찾을 수 없습니다.</div>;
  const author = db.users[post.authorId];
  const comments = Object.values(db.comments)
    .filter((c) => c.postId === id)
    .sort((a, b) => a.createdAt - b.createdAt);
  const [body, setBody] = useState("");

  return (
    <article className="space-y-6">
      <div className="neon-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {post.title}
          </h1>
          <span className="text-xs text-fuchsia-100/80">
            {timeAgo(post.createdAt)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Avatar user={author} />
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t}>#{t}</Badge>
            ))}
          </div>
        </div>
        <div className="mt-5 whitespace-pre-wrap leading-relaxed text-fuchsia-100/90">
          {post.body}
        </div>
        <div className="mt-6">
          <Button
            variant="flat"
            onClick={() => setRoute({ name: "list", page: 1 })}
          >
            목록으로
          </Button>
        </div>
      </div>

      <section className="neon-card rounded-2xl p-6">
        <h2 className="text-lg font-bold">댓글 {comments.length}</h2>
        <div className="mt-4 space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="border-b border-pink-500/20 pb-4 last:border-none"
            >
              <div className="flex items-center justify-between">
                <Avatar user={db.users[c.authorId]} />
                <span className="text-xs text-fuchsia-100/70">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-fuchsia-100/90 whitespace-pre-wrap">
                {c.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <div className="mt-2 flex items-center justify-end">
            <Button
              onClick={() => {
                if (body.trim().length) {
                  onComment(id, body.trim());
                  setBody("");
                }
              }}
            >
              댓글 작성
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}

// ========== Feature: Post Create ==========
function PostCreate({
  onSubmit,
  onCancel,
}: {
  onSubmit: (title: string, body: string, tags: string[]) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="neon-card rounded-2xl p-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-xl font-extrabold">새 글 작성</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
        />
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="태그(쉼표로 구분: 예) 신작, 스포주의)"
        />
        <TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="본문을 입력하세요"
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="flat" onClick={onCancel}>
          취소
        </Button>
        <Button
          onClick={() =>
            onSubmit(
              title.trim(),
              body.trim(),
              tags
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
        >
          등록
        </Button>
      </div>
    </div>
  );
}

// ========== Feature: Auth (Login/Signup) ==========
function Login({
  onLogin,
  gotoSignup,
}: {
  onLogin: (username: string) => void;
  gotoSignup: () => void;
}) {
  const [username, setUsername] = useState("");
  return (
    <div className="max-w-sm neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">로그인</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button onClick={() => onLogin(username.trim())}>로그인</Button>
        <Button variant="flat" onClick={gotoSignup}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

function Signup({
  onSignup,
}: {
  onSignup: (username: string, nickname: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  return (
    <div className="max-w-sm neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">회원가입</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디(영문/숫자)"
        />
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button
          onClick={() =>
            onSignup(username.trim(), nickname.trim() || username.trim())
          }
        >
          가입하기
        </Button>
      </div>
    </div>
  );
}

// ========== Dev Diagnostics (Mini Tests) ==========

type TestResult = { name: string; ok: boolean; detail?: string };

function runDiagnostics(): TestResult[] {
  const results: TestResult[] = [];

  // 1) seed DB sanity
  const db = seedDB();
  results.push({
    name: "seedDB: posts count",
    ok: Object.keys(db.posts).length === 4,
  });
  results.push({
    name: "seedDB: order sorted desc",
    ok: db.order.every(
      (id, i, arr) =>
        i === 0 || db.posts[arr[i - 1]].createdAt >= db.posts[id].createdAt
    ),
  });

  // 2) sampleText paragraphs
  const sample = sampleText(3);
  results.push({
    name: "sampleText: paragraph join",
    ok: sample.split("\n\n").length === 3,
  });

  // 3) timeAgo suffixes
  const ago30s = timeAgo(now() - 30 * 1000);
  const ago2m = timeAgo(now() - 2 * 60 * 1000);
  results.push({
    name: "timeAgo: seconds",
    ok: /초 전$/.test(ago30s),
    detail: ago30s,
  });
  results.push({
    name: "timeAgo: minutes",
    ok: /분 전$/.test(ago2m),
    detail: ago2m,
  });

  // 4) reducer flows: signup -> login -> create_post -> create_comment
  const initial: State = { db, currentUser: null };
  const signed = reducer(initial, {
    type: "signup",
    username: "tester",
    nickname: "스터",
  });
  const logged = reducer(signed, { type: "login", username: "tester" });
  const beforeCount = Object.keys(logged.db.posts).length;
  const afterCreate = reducer(logged, {
    type: "create_post",
    title: "t",
    body: "b",
    tags: ["x"],
  });
  const afterCount = Object.keys(afterCreate.db.posts).length;
  const createdPostId = afterCreate.db.order[0];
  const afterComment = reducer(afterCreate, {
    type: "create_comment",
    postId: createdPostId,
    body: "hello",
  });
  const commentAdded = Object.values(afterComment.db.comments).some(
    (c) => c.postId === createdPostId && c.body === "hello"
  );

  results.push({
    name: "reducer: signup+login",
    ok: !!logged.currentUser && logged.currentUser.username === "tester",
  });
  results.push({
    name: "reducer: create_post count+order",
    ok:
      afterCount === beforeCount + 1 &&
      afterCreate.db.order[0] in afterCreate.db.posts,
  });
  results.push({ name: "reducer: create_comment", ok: commentAdded });

  return results;
}

// ========== Root App ==========
export default function NeonArcadeBoardApp() {
  const [state, dispatch] = useReducer(reducer, null as any, () => ({
    db: loadDB(),
    currentUser: loadCurrentUser(),
  }));
  const [route, setRoute] = useState<Route>({ name: "list", page: 1 });

  // persist on change
  useEffect(() => {
    saveDB(state.db);
  }, [state.db]);

  const guardLogin = (feature: React.ReactNode) =>
    state.currentUser ? (
      feature
    ) : (
      <div className="text-white/80">
        이 기능은 로그인 후 이용 가능합니다.
        <div className="mt-3 flex gap-2">
          <Button onClick={() => setRoute({ name: "login" })}>로그인</Button>
          <Button variant="flat" onClick={() => setRoute({ name: "signup" })}>
            회원가입
          </Button>
        </div>
      </div>
    );

  return (
    <NeonShell>
      <Header
        route={route}
        setRoute={setRoute}
        currentUser={state.currentUser}
      />
      <Container>
        {route.name === "list" && (
          <PostList
            db={state.db}
            setRoute={setRoute}
            page={route.page ?? 1}
            q={route.q}
          />
        )}
        {route.name === "read" && (
          <PostRead
            db={state.db}
            id={route.id}
            setRoute={setRoute}
            onComment={(postId, body) =>
              dispatch({ type: "create_comment", postId, body })
            }
          />
        )}
        {route.name === "new" &&
          guardLogin(
            <PostCreate
              onSubmit={(title, body, tags) => {
                if (!title || !body) return;
                dispatch({ type: "create_post", title, body, tags });
                setRoute({ name: "list", page: 1 });
              }}
              onCancel={() => setRoute({ name: "list", page: 1 })}
            />
          )}
        {route.name === "login" && (
          <Login
            onLogin={(username) => {
              dispatch({ type: "login", username });
              setRoute({ name: "list", page: 1 });
            }}
            gotoSignup={() => setRoute({ name: "signup" })}
          />
        )}
        {route.name === "signup" && (
          <Signup
            onSignup={(username, nickname) => {
              if (!username) return;
              dispatch({ type: "signup", username, nickname });
              setRoute({ name: "list", page: 1 });
            }}
          />
        )}
      </Container>
      <Footer
        currentUser={state.currentUser}
        onLogout={() => {
          dispatch({ type: "logout" });
        }}
      />
    </NeonShell>
  );
}

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
