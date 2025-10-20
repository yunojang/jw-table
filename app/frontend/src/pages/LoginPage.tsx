import Login from "@/components/Login";
import Container from "@/layouts/Container";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="w-1/3 mx-auto">
        <Login
          onLogin={() => {
            // dispatch({ type: "login", username });
            // setRoute({ name: "list", page: 1 });
          }}
          gotoSignup={() => navigate("/signup")}
        />
      </div>
    </Container>
  );
};

export default LoginPage;
