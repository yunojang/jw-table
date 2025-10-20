import Signup from "@/components/Singnup";
import Container from "@/layouts/Container";
import type { FC } from "react";

interface SignupPageProps {}

const SignupPage: FC<SignupPageProps> = () => {
  return (
    <Container>
      <div className="w-1/3 mx-auto">
        <Signup
          onSignup={() => {
            // if (!username) return;
            // dispatch({ type: "signup", username, nickname });
            // setRoute({ name: "list", page: 1 });
          }}
        />
      </div>
    </Container>
  );
};

export default SignupPage;
