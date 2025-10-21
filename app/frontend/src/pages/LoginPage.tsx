import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

import Login from "@/components/Login";
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
        <div className="w-80 font-semibold text-md text-red-500">{error}</div>
      )}
    </Container>
  );
};

export default LoginPage;
