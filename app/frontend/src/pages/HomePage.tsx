import React, { useEffect, useReducer, useState } from "react";
import Button from "@/components/UI/Button";
import type { Comment, DB, ID, Post, User } from "@/types";
import { now, sampleText, timeAgo, uid } from "@/utils";
import { Avatar } from "@/components/UI/Avatar";
import { Input } from "@/components/UI/Input";
import { Badge } from "@/components/UI/Badge";
import { TextArea } from "@/components/UI/TextArea";
import Footer from "@/layouts/Footer";
import PostList from "@/components/PostList";
import Container from "@/layouts/Container";

// ────────────────────────────────────────────────────────────────────────────────
// Anime Otaku Community — NEON ARCADE Prototype (React + TypeScript + Tailwind)
//  - 요구사항: 회원가입/로그인, 게시물 작성/목록/읽기, 댓글 작성, 페이징
//  - 단일 파일 프리뷰용 시안 (목업 데이터 + 라우터 대체)
//  - 실제 프로젝트에서는 폴더 분리 권장: components/, pages/, lib/, types/
//  - Dev Diagnostics(간단 테스트) 포함 — 기능 회귀 테스트용
// ────────────────────────────────────────────────────────────────────────────────

// ========== Simple Store (LocalStorage Persist) ==========
const LS_KEY = "neon-arcade-db-v1";
const LS_USER = "neon-arcade-current-user";

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

// ========== Router (in-file) ==========

type Route =
  | { name: "list"; page?: number; q?: string }
  | { name: "read"; id: ID }
  | { name: "new" }
  | { name: "login" }
  | { name: "signup" };

// ========== Theme Shell (NEON ARCADE) ==========

// ========== App Shell ==========

// ========== Feature: Post List with Search + Paging ==========

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
    <>
      {/* <Header
        route={route}
        setRoute={setRoute}
        currentUser={state.currentUser}
      /> */}
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

        <Footer
          currentUser={state.currentUser}
          onLogout={() => {
            dispatch({ type: "logout" });
          }}
        />
      </Container>
    </>
  );
}
