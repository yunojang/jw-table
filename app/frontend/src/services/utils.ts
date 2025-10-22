import type { ListQuery } from "@/types";

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

const DEFAULT_PAGE = 1;

export function listQuery(params: ListQuery = {}) {
  const { page, limit, ...rest } = params;
  const search = new URLSearchParams();

  // set limit
  if (limit !== undefined && limit !== null) {
    search.set("limit", String(limit));
  }

  // page to offset
  if (page !== undefined && page !== null) {
    const pageNumber = Number(page);
    const safePage =
      Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : DEFAULT_PAGE;
    const limitNumber = Number(limit ?? 0);
    const offset =
      limitNumber > 0 ? (safePage - 1) * limitNumber : safePage - DEFAULT_PAGE;
    search.set("offset", String(Math.max(0, offset)));
  }

  // set rest
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    search.set(key, String(value));
  });

  return search.toString();
}
