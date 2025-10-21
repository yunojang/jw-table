import type { ID } from "@/types";
import { API_BASE, ensureOk, parseJSON } from "./utils";

export async function createComment(id: ID, content: string) {
  const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });
  await ensureOk(res, "게시글을 작성하지 못했습니다.");
  return parseJSON(res);
}
