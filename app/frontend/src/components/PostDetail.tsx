import { useMemo, useState } from "react";
import type { ID, PostDetail } from "@/types";
import Button from "./UI/Button";
import { Avatar } from "./UI/Avatar";
import { Badge } from "./UI/Badge";
import { TextArea } from "./UI/TextArea";
import { timeAgo } from "@/utils";

interface PostDetailProps {
  post: PostDetail;
  onBack?: () => void;
  onSubmitComment?: (postId: ID, body: string) => Promise<void> | void;
  submitting?: boolean;
}

function PostDetailView({
  post,
  onBack,
  onSubmitComment,
  submitting = false,
}: PostDetailProps) {
  const [body, setBody] = useState("");

  const sortedComments = useMemo(
    () =>
      [...post.comments].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [post.comments]
  );

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed || !onSubmitComment) return;
    await onSubmitComment(post.id, trimmed);
    setBody("");
  };

  return (
    <article className="space-y-6">
      <div className="neon-card rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {post.title}
          </h1>
          <span className="text-xs text-fuchsia-100/80 whitespace-nowrap">
            {timeAgo(new Date(post.createdAt).getTime())}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Avatar user={post.author} />
          {/* <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={`${post.id}-${tag}`}>#{tag}</Badge>
            ))}
          </div> */}
        </div>
        <div className="mt-5 whitespace-pre-wrap leading-relaxed text-fuchsia-100/90">
          {post.body}
        </div>
        {onBack && (
          <div className="mt-6">
            <Button variant="flat" onClick={onBack}>
              목록으로
            </Button>
          </div>
        )}
      </div>

      <section className="neon-card rounded-2xl p-6">
        <h2 className="text-lg font-bold">댓글 {sortedComments.length}</h2>
        <div className="mt-4 space-y-4">
          {sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-pink-500/20 pb-4 last:border-none"
            >
              <div className="flex items-center justify-between">
                <Avatar user={comment.author} />
                <span className="text-xs text-fuchsia-100/70">
                  {timeAgo(new Date(comment.createdAt).getTime())}
                </span>
              </div>
              <p className="mt-2 text-fuchsia-100/90 whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          ))}
          {!sortedComments.length && (
            <p className="text-sm text-fuchsia-100/70">
              첫 번째 댓글을 작성해 보세요.
            </p>
          )}
        </div>
        {onSubmitComment && (
          <div className="mt-4">
            <TextArea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <div className="mt-2 flex items-center justify-end">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "작성 중..." : "댓글 작성"}
              </Button>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}

export default PostDetailView;
