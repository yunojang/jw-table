export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function parseJSON<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error("Invalid server response");
  }
}

export async function ensureOk(res: Response, fallbackMessage: string) {
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
