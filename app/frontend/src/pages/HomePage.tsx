import { useMemo, type FC } from "react";
import { useNavigate } from "react-router-dom";

import Container from "@/layouts/Container";
import Button from "@/components/UI/Button";
import PostList from "@/components/PostList";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { posts, loading, error } = usePosts();

  const featured = useMemo(
    () => (Array.isArray(posts) ? posts.slice(0, 6) : []),
    [posts]
  );

  const { isAuthenticated } = useAuth();

  return (
    <div className="py-12">
      <Container>
        <section className="text-center space-y-4 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Neon Arcade - Table
          </h1>
          {/* <p className="text-base text-fuchsia-100/80 max-w-3xl mx-auto">
            애니메이션과 굿즈, 사운드를 사랑하는 팬들과 함께 최신 소식과 감상을
            나눠보세요. 토론, 리뷰, 추천을 한 번에 즐길 수 있는 공간을
            준비했습니다.
          </p> */}
          <div className="flex justify-center gap-3 mt-4">
            <Button onClick={() => navigate("/posts")}>게시판 전체보기</Button>
            {isAuthenticated && (
              <Button variant="flat" onClick={() => navigate("/posts/write")}>
                글쓰기
              </Button>
            )}
          </div>
        </section>

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
              posts={featured}
              onSelectPost={(id) => navigate(`/posts/${id}`)}
              pageSize={6}
            />
          )}
        </section>
      </Container>
    </div>
  );
};

export default HomePage;
