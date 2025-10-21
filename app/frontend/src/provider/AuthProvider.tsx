import {
  useEffect,
  useMemo,
  useState,
  type JSX,
  type PropsWithChildren,
} from "react";

import type { PublicUser } from "@/types/user";
import { fetchCurrentUser } from "@/services/users";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false; // 이펙트가 현재 유효한지 알려준다.

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCurrentUser();
        if (ignore) return; // 비동기 끝나고 state가 바뀌는 일 방지
        setUser(data);
      } catch {
        if (ignore) return;
        setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
