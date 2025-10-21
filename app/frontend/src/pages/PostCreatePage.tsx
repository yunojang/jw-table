import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import Container from "@/layouts/Container";
import PostCreate from "@/components/PostCreate";
import { createPost } from "@/services/posts";
import type { PostCreatePayload } from "@/types";

const PostCreatePage: FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: PostCreatePayload) => {
    if (!values.title || !values.content) return;
    try {
      setSubmitting(true);
      setError(null);
      const created = await createPost(values);
      navigate(`/posts/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "게시글을 작성하지 못했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Container>
        {error && (
          <div className="mb-4 text-sm text-red-400 font-semibold">{error}</div>
        )}
        <PostCreate
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          disabled={submitting}
        />
      </Container>
    </div>
  );
};

export default PostCreatePage;
