// ========== Types ==========
export type ID = string;

export type Comment = {
  id: ID;
  postId: ID;
  authorId: ID;
  body: string;
  createdAt: number;
};

export type Post = {
  id: ID;
  title: string;
  body: string;
  tags: string[];
  authorId: ID;
  createdAt: number;
  likes: number;
};

export type DB = {
  users: Record<ID, null>;
  posts: Record<ID, Post>;
  comments: Record<ID, Comment>;
  order: ID[]; // post order (newest first)
};

export interface LoginPayload {
  email: string;
  password: string;
}
