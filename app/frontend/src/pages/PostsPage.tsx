import type { FC } from "react";

import Container from "@/layouts/Container";
import PostList from "@/components/PostList";

interface PostsPageProps {}

const PostsPage: FC<PostsPageProps> = () => {
  return (
    <Container>
      <PostList
        db={{ comments: [], order: [], posts: [], users: [] }}
        setRoute={() => {}}
        // page={route.page ?? 1}
        // q={route.q}
        page={1}
        q={""}
      />
    </Container>
  );
};

export default PostsPage;
