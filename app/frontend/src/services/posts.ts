import type {
  ID,
  LikeResult,
  PostCreatePayload,
  PostDetail,
  PostPublic,
  PostsPublic,
} from "@/types";
import { API_BASE, listQuery, ensureOk, parseJSON } from "./utils";

interface PostReadQueryParameter {
  page?: number;
  limit?: number;
}

export async function fetchPosts(
  params?: PostReadQueryParameter
): Promise<PostsPublic> {
  const query = listQuery({
    page: params?.page,
    limit: params?.limit,
    sort: "-created_at",
  });

  const res = await fetch(`${API_BASE}/posts?${query}`);
  await ensureOk(res, "게시글 목록을 불러오지 못했습니다.");
  const payload = await parseJSON<{ data: PostPublic[]; count: number }>(res);
  return payload;
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

export async function likePost(id: ID) {
  const res = await fetch(`${API_BASE}/posts/${id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  await ensureOk(res, "좋아요 실패");
  return parseJSON<LikeResult>(res);
}
