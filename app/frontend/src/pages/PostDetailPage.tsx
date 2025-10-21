import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Container from "@/layouts/Container";
import PostDetailView from "@/components/PostDetail";
import type { ID, PostDetail } from "@/types";
import { fetchPostDetail } from "@/services/posts";
import Button from "@/components/UI/Button";
import { createComment } from "@/services/comment";

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
    const load = async () => {
      try {
        const data = await fetchPostDetail(postId);
        setPost(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "게시글을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [postId]);

  return (
    <div>
      <Container>
        <div className="mb-4">
          <Button variant="flat" onClick={() => navigate(-1)}>
            뒤로 가기
          </Button>
        </div>
        {loading && (
          <div className="text-sm text-fuchsia-100/80">
            게시글을 불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-sm text-red-400 font-semibold">{error}</div>
        )}
        {!loading && !error && post && (
          <PostDetailView
            post={post}
            onBack={() => navigate("/posts")}
            onSubmitComment={async (pid: ID, content: string) => {
              await createComment(pid, content);
              const updated = await fetchPostDetail(pid);
              setPost(updated);
            }}
          />
        )}
      </Container>
    </div>
  );
};

export default PostDetailPage;
