import type { ID, PostDetail } from "@/types";
import Button from "./UI/Button";
import { Avatar } from "./UI/Avatar";
import { timeAgo } from "@/utils";
import CommentList from "./CommentList";
import { useAuth } from "@/hooks/useAuth";

interface PostDetailProps {
  post: PostDetail;
  onBack?: () => void;
  onLike?: () => void;
  onSubmitComment?: (postId: ID, body: string) => Promise<void> | void;
  submitting?: boolean;
}

function PostDetailView({
  post,
  onBack,
  onLike,
  onSubmitComment,
  submitting = false,
}: PostDetailProps) {
  const { isAuthenticated } = useAuth();
  return (
    <article className="space-y-6">
      <div className="neon-card rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            {post.title}
          </h1>
          <span className="text-xs text-fuchsia-100/80 whitespace-nowrap">
            {timeAgo(new Date(post.created_at).getTime())}
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
          {post.content}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {onLike && isAuthenticated && (
            <Button variant={post.liked ? "primary" : "flat"} onClick={onLike}>
              좋아요
            </Button>
          )}
          {onBack && (
            <Button variant="flat" onClick={onBack}>
              목록으로
            </Button>
          )}
        </div>
      </div>

      <CommentList
        comments={post.comments}
        postId={post.id}
        onSubmitComment={onSubmitComment}
        submitting={submitting}
      />
    </article>
  );
}

export default PostDetailView;
