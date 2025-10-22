import { useRef, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import Container from "@/layouts/Container";
import PostCreate, { type PostCreateHandle } from "@/components/PostCreate";
import { createPost } from "@/services/posts";
import type { PostCreatePayload } from "@/types";
import WriteInspiration from "@/components/WriteInspiration";

const PostCreatePage: FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formAnchorRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<PostCreateHandle | null>(null);

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

  const handleScrollToForm = () => {
    formAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    requestAnimationFrame(() => {
      // 조금 기다렸다가 포커스
      setTimeout(() => {
        formRef.current?.focusTitle();
      }, 50);
    });
  };

  return (
    <Container>
      <div className="flex flex-col gap-3 ">
        <WriteInspiration onWrite={handleScrollToForm} />

        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 shadow-[0_0_25px_rgba(255,0,155,0.1)]">
            {error}
          </div>
        )}

        <div ref={formAnchorRef}>
          <PostCreate
            ref={formRef}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            disabled={submitting}
          />
        </div>
      </div>
    </Container>
  );
};

export default PostCreatePage;
