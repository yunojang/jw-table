import type { DB } from "@/types";
import { useMemo, useState } from "react";
import { Input } from "./UI/Input";
import Button from "./UI/Button";
import { Badge } from "./UI/Badge";
import { timeAgo } from "@/utils";
import Pagination from "./Pagination";

function PostList({
  db,
  setRoute,
  page = 1,
  q = "",
}: {
  db: DB;
  setRoute: (r: Route) => void;
  page?: number;
  q?: string;
}) {
  const [query, setQuery] = useState(q);
  const PAGE_SIZE = 6;

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return db.order.map((id) => db.posts[id]);
    return db.order
      .map((id) => db.posts[id])
      .filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.body.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      );
  }, [db, query]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const cur = Math.min(page, pageCount);
  const slice = filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE);

  return (
    <div>
      <div className="mb-4 flex gap-2 items-stretch">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색: 제목/본문/태그"
        />
        <Button
          className="px-7 whitespace-nowrap"
          variant="flat"
          onClick={() => setQuery("")}
        >
          지우기
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {slice.map((p) => (
          <article
            key={p.id}
            className="neon-card rounded-2xl p-5 transition duration-200"
          >
            <div className="flex items-start gap-3">
              {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 grid place-items-center font-bold">
                {db.users[p.authorId].nickname[0].toUpperCase()}
              </div> */}
              <div className="w-full">
                <h3
                  className="text-lg font-semibold leading-tight cursor-pointer"
                  onClick={() => setRoute({ name: "read", id: p.id })}
                >
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-fuchsia-100/80 line-clamp-2">
                  {p.body}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between w-full gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t}>#{t}</Badge>
                  ))}
                  <span className="ml-auto text-xs text-fuchsia-100/70">
                    {timeAgo(p.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        current={cur}
        totalPages={pageCount}
        onPage={(n) => setRoute({ name: "list", page: n, q: query })}
        className="mt-6"
      />
    </div>
  );
}

export default PostList;
