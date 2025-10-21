import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Container from "@/layouts/Container";
import PostDetailView from "@/components/PostDetail";
import type { PostDetail } from "@/types";
import { fetchPostDetail } from "@/services/posts";
import Button from "@/components/UI/Button";

const PostDetailPage: FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("잘못된 경로입니다.");
      setLoading(false);
      return;
    }
    let ignore = false;
    (async () => {
      try {
        const data = await fetchPostDetail(postId);
        if (!ignore) setPost(data);
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "게시글을 불러오지 못했습니다."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [postId]);

  return (
    <Container>
      <div className="mb-4">
        <Button variant="flat" onClick={() => navigate(-1)}>
          뒤로 가기
        </Button>
      </div>
      {loading && (
        <div className="text-sm text-fuchsia-100/80">게시글을 불러오는 중...</div>
      )}
      {error && (
        <div className="text-sm text-red-400 font-semibold">{error}</div>
      )}
      {!loading && !error && post && (
        <PostDetailView post={post} onBack={() => navigate("/posts")} />
      )}
    </Container>
  );
};

export default PostDetailPage;
