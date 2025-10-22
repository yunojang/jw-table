import { useState } from "react";
import type { ID, PostComment } from "@/types";
import { Avatar } from "./UI/Avatar";
import { TextArea } from "./UI/TextArea";
import Button from "./UI/Button";
import { timeAgo } from "@/utils";
import PostDetailGlow from "./UI/PostDetailGlow";

interface CommentListProps {
  comments?: PostComment[];
  postId: ID;
  onSubmitComment?: (postId: ID, body: string) => Promise<void> | void;
  submitting?: boolean;
}

function CommentList({
  comments,
  postId,
  onSubmitComment,
  submitting = false,
}: CommentListProps) {
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    const trimmed = body.trim();
    if (!trimmed || !onSubmitComment) return;
    await onSubmitComment(postId, trimmed);
    setBody("");
  };

  const hasComments = Boolean(comments && comments.length);

  return (
    <section className="neon-card rounded-2xl p-6 relative overflow-hidden">
      <PostDetailGlow />
      <PostDetailGlow />

      <h2 className="text-lg font-bold">댓글 {comments?.length ?? 0}</h2>
      <div className="mt-4 space-y-4">
        {hasComments &&
          comments!.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-pink-500/20 pb-4 last:border-none"
            >
              <div className="flex items-center justify-between">
                <Avatar user={comment.author} />
                <span className="text-xs text-fuchsia-100/70">
                  {timeAgo(new Date(comment.created_at).getTime())}
                </span>
              </div>
              <p className="mt-2 text-fuchsia-100/90 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        {!hasComments && (
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
  );
}

export default CommentList;
