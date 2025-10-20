// ========== Types ==========
export type ID = string;

export type User = {
  id: ID;
  username: string;
  nickname: string;
  avatarHue: number; // 0~360
  createdAt: number;
};

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
  users: Record<ID, User>;
  posts: Record<ID, Post>;
  comments: Record<ID, Comment>;
  order: ID[]; // post order (newest first)
};
