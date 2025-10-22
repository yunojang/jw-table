import { useAuth } from "@/hooks/useAuth";
import Button from "./UI/Button";

interface PostsHeaderProps {
  title?: string;
  description?: string;
  totalPosts?: number;
  onWrite?: () => void;
}

function PostsHeader({
  title = "정글 커뮤니티 게시판",
  description = "최신 글을 확인하고 의견을 나눠보세요.",
  totalPosts,
  onWrite,
}: PostsHeaderProps) {
  const { isAuthenticated } = useAuth();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-black/65 p-6 md:p-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="neon-gradient blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-pink-200/70">
            <span className="glitch" data-text="PLAY GROUND">
              PLAYGROUND
            </span>
          </p>
          <h1 className="mt-2 text-3xl font-black text-white md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-fuchsia-100/75">{description}</p>

          {typeof totalPosts === "number" && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-400/40 bg-pink-500/10 px-3 py-1 text-xs text-pink-200/90">
              총 게시글 <strong className="text-white">{totalPosts}</strong> 개
            </p>
          )}
        </div>

        {onWrite && isAuthenticated && (
          <Button onClick={onWrite} className="px-6">
            글쓰기
          </Button>
        )}
      </div>
    </section>
  );
}

export default PostsHeader;
