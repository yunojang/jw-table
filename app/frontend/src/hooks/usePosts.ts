import { useCallback, useEffect, useState } from "react";

import type { PostPublic } from "@/types";
import { fetchPosts } from "@/services/posts";
import { useSearchParams } from "react-router-dom";

const DEFAULT_ERROR = "게시글을 불러오지 못했습니다.";

export interface UsePostsResult {
  posts: PostPublic[];
  count: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UsePostsOptions {
  defaultLimit?: number;
}

export function usePosts({ defaultLimit }: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<PostPublic[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit") ?? defaultLimit);
  const q = String(searchParams.get("q") ?? "");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await fetchPosts({ page, limit, q });

      setPosts(data);
      setCount(count);
      setError(null);
    } catch (err) {
      setPosts([]);
      setCount(0);
      setError(err instanceof Error ? err.message : DEFAULT_ERROR);
    } finally {
      setLoading(false);
    }
  }, [page, limit, q]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { posts, count, loading, error, refresh };
}
