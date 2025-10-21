import type { PublicUser } from "@/types/user";

export async function fetchCurrentUser(): Promise<PublicUser | null> {
  const res = await fetch("http://localhost:8000/users/me", {
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return res.json();
}
