import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/layouts/Container";
import PostList from "@/components/PostList";
import { usePosts } from "@/hooks/usePosts";
import PostsHeader from "@/components/PostsHeader";

interface PostsPageProps {}

const PostsPage: FC<PostsPageProps> = () => {
  const navigate = useNavigate();
  const { posts, count, loading, error } = usePosts({ defaultLimit: 12 });

  return (
    <div>
      <Container>
        <div className="mb-10">
          <PostsHeader
            totalPosts={count}
            onWrite={() => navigate("/posts/write")}
          />
        </div>

        {loading && (
          <div className="text-sm text-fuchsia-100/80">
            게시글을 불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-sm text-red-400 font-semibold">{error}</div>
        )}

        {!loading && !error && (
          <PostList
            posts={posts}
            postsCount={count}
            onSelectPost={(id) => navigate(`/posts/${id}`)}
          />
        )}
      </Container>
    </div>
  );
};

export default PostsPage;
