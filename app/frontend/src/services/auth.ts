// src/services/auth.ts
export interface SignupPayload {
  email: string;
  nickname: string;
  password: string;
}

export async function signup(payload: SignupPayload) {
  const res = await fetch("http://localhost:8000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "회원가입 실패");
  }
  return res.json();
}
