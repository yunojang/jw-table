import type { ID, PostCreatePayload, PostDetail, PostPublic } from "@/types";
import { API_BASE, ensureOk, parseJSON } from "./utils";

export async function fetchPosts(): Promise<PostPublic[]> {
  const res = await fetch(`${API_BASE}/posts`, { credentials: "include" });
  await ensureOk(res, "게시글 목록을 불러오지 못했습니다.");
  const payload = await parseJSON<{ data: PostPublic[] }>(res);
  return payload.data ?? [];
}

export async function fetchPostDetail(id: ID): Promise<PostDetail> {
  const res = await fetch(`${API_BASE}/posts/${id}`);
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
