import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import Login from "@/components/Login";
import AuthHero from "@/components/AuthHero";
import Container from "@/layouts/Container";
import type { LoginPayload } from "@/types";
import { login } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { fetchCurrentUser } from "@/services/users";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_480px]">
        <AuthHero
          mode="login"
          onToggle={() => navigate("/signup", { replace: true })}
        />
        <div className="space-y-4">
          <Login
            onLogin={async (v: LoginPayload) => {
              try {
                await login(v);
                setUser(await fetchCurrentUser());
                navigate("/");
              } catch (err) {
                setError(String(err));
              }
            }}
            gotoSignup={() => navigate("/signup")}
          />

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 shadow-[0_0_18px_rgba(255,0,155,0.15)]">
              {error}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;
