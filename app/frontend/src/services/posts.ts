import type { ID, PostCreatePayload, PostDetail, PostPublic } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function parseJSON<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error("Invalid server response");
  }
}

async function ensureOk(res: Response, fallbackMessage: string) {
  if (res.ok) {
    return;
  }

  let detail = fallbackMessage;
  try {
    const data = await res.json();
    const raw = (data as { detail?: unknown }).detail;
    if (typeof raw === "string") {
      detail = raw;
    } else if (Array.isArray(raw)) {
      detail = raw
        .map((item) =>
          typeof item === "object" && item !== null && "msg" in item
            ? (item as { msg?: string }).msg ?? JSON.stringify(item)
            : JSON.stringify(item)
        )
        .join(", ");
    }
  } catch {
    detail = await res.text();
  }

  throw new Error(detail || fallbackMessage);
}

export async function fetchPosts(): Promise<PostPublic[]> {
  const res = await fetch(`${API_BASE}/posts`, { credentials: "include" });
  await ensureOk(res, "게시글 목록을 불러오지 못했습니다.");
  const payload = await parseJSON<{ data: PostPublic[] }>(res);
  return payload.data ?? [];
}

export async function fetchPostDetail(id: ID): Promise<PostDetail> {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    credentials: "include",
  });
  await ensureOk(res, "게시글을 불러오지 못했습니다.");
  return parseJSON<PostDetail>(res);
}

export async function createPost(payload: PostCreatePayload) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  await ensureOk(res, "게시글을 작성하지 못했습니다.");
  return parseJSON<PostDetail>(res);
}
