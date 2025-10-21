import { useCallback, useEffect, useState } from "react";

import type { PostPublic } from "@/types";
import { fetchPosts } from "@/services/posts";

const DEFAULT_ERROR = "게시글을 불러오지 못했습니다.";

export interface UsePostsResult {
  posts: PostPublic[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePosts(): UsePostsResult {
  const [posts, setPosts] = useState<PostPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const mountedRef = useRef(true);

  // useEffect(() => {
  //   return () => {
  //     mountedRef.current = false;
  //   };
  // }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      // if (!mountedRef.current) return;
      setPosts(data);
      setError(null);
    } catch (err) {
      // if (!mountedRef.current) return;
      setPosts([]);
      setError(err instanceof Error ? err.message : DEFAULT_ERROR);
    } finally {
      // if (!mountedRef.current) return;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { posts, loading, error, refresh };
}
