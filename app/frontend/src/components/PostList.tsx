import type { ID, PostPublic } from "@/types";
import { Input } from "./UI/Input";
import Button from "./UI/Button";
import { Avatar } from "./UI/Avatar";
import { timeAgo } from "@/utils";
import Pagination from "./Pagination";
import { usePagenation } from "@/hooks/usePagenation";
import useForm from "@/hooks/useForm";

interface SearchQueryPalyoad {
  q: string;
}
interface PostListProps {
  posts: PostPublic[];
  postsCount: number;
  onSearch?(payload: SearchQueryPalyoad): void;
  onSelectPost?: (id: ID) => void;
  defaultSearch?: Partial<SearchQueryPalyoad>;
}

function PostList({
  posts,
  postsCount,
  onSelectPost,
  onSearch,
  defaultSearch,
}: PostListProps) {
  const handleSelect = (id: ID) => {
    if (onSelectPost) {
      onSelectPost(id);
    }
  };

  const { paginationProps } = usePagenation(postsCount, { defaultLimit: 12 });

  const { values, handleChange, resetForm } = useForm({
    q: defaultSearch?.q ?? "",
  });

  return (
    <div className="w-full">
      {onSearch && (
        <form
          className="mb-4 flex gap-2 items-stretch"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(values);
          }}
        >
          <Input
            name="q"
            placeholder="검색: 제목 / 내용"
            onChange={handleChange}
            value={values.q}
          />
          <Button
            className="px-5 whitespace-nowrap"
            variant="primary"
            type="submit"
          >
            검색
          </Button>
          <Button
            className="px-5 whitespace-nowrap"
            variant="flat"
            type="button"
            onClick={() => {
              resetForm();
            }}
          >
            지우기
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="neon-card rounded-2xl p-5 transition duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg/60 h-[200px]"
            onClick={() => handleSelect(post.id)}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between gap-3">
                <Avatar user={post.author} />
                <span className="text-xs text-fuchsia-100/70 whitespace-nowrap">
                  {timeAgo(new Date(post.created_at).getTime())}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold leading-tight text-white">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-fuchsia-100/80 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                {/* <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={`${post.id}-${tag}`}>#{tag}</Badge>
                  ))}
                </div> */}
                <span className="text-xs font-semibold text-fuchsia-100/70">
                  ♥ {post.likes.toLocaleString() ?? 0}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pagination {...paginationProps} className="mt-20" />
    </div>
  );
}

export default PostList;
