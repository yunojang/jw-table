import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import Login from "@/components/Login";
import Container from "@/layouts/Container";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Login
        onLogin={() => {
          // dispatch({ type: "login", username });
          // setRoute({ name: "list", page: 1 });
        }}
        gotoSignup={() => navigate("/signup")}
      />
    </Container>
  );
};

export default LoginPage;
