export type ID = string;

export interface UserSummary {
  id: ID;
  nickname: string;
  avatarHue?: number;
}

export type User = UserSummary;

export interface PostBase {
  title: string;
  content: string;
}

export interface PostPublic extends PostBase {
  id: ID;
  created_at: string;
  likes: number;
  author: UserSummary;
  excerpt: string;
}

export interface PostCreatePayload extends PostBase {}

export interface PostComment {
  id: ID;
  author: UserSummary;
  content: string;
  created_at: string;
}

export interface PostDetail extends PostPublic {
  comments: PostComment[];
}

export interface LoginPayload {
  email: string;
  password: string;
}
