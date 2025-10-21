import type { PublicUser } from "@/types/user";
import { createContext } from "react";

export interface AuthContextValue {
  user: PublicUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: PublicUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
