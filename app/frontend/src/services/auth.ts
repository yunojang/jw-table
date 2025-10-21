import type { LoginPayload } from "@/types";

// src/services/auth.ts
export interface SignupPayload {
  email: string;
  nickname: string;
  password: string;
}

async function handleError(res: Response, defaultDetail: string = "요청 실패") {
  let detail = defaultDetail;
  try {
    const data = await res.json();
    const raw = data?.detail;

    if (typeof raw === "string") {
      detail = raw;
    } else if (Array.isArray(raw)) {
      detail = raw.map((item) => item.msg ?? JSON.stringify(item)).join(", ");
    } else if (raw && typeof raw === "object") {
      detail = raw.message ?? JSON.stringify(raw);
    } else {
      detail = JSON.stringify(data);
    }
  } catch {
    detail = await res.text();
  }
  throw new Error(detail);
}

export async function login(payload: LoginPayload) {
  const res = await fetch("http://localhost:8000/login/access-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    await handleError(res, "로그인 실패");
  }

  return res.json();
}

export async function signup(payload: SignupPayload) {
  const res = await fetch("http://localhost:8000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    await handleError(res, "회원가입 실패");
  }

  return res.json();
}
