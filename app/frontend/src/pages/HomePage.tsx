import { useEffect, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Container from "@/layouts/Container";
import Button from "@/components/UI/Button";
import PostList from "@/components/PostList";
import { usePosts } from "@/hooks/usePosts";
import HeroBanner from "@/components/HeroBanner";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { posts, count, loading, error } = usePosts({ defaultLimit: 6 });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("limit", "6");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <div className="py-12">
      <Container>
        <HeroBanner
          onPrimary={() => navigate("/posts")}
          onSecondary={() => navigate("/posts/write")}
        />

        <section className="mt-12">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">최신 게시글</h2>
            <Button variant="ghost" onClick={() => navigate("/posts")}>
              전체 보기
            </Button>
          </header>
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
        </section>
      </Container>
    </div>
  );
};

export default HomePage;
