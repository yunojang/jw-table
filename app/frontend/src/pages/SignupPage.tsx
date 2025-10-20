import type { FC } from "react";

import Signup from "@/components/Singnup";
import Container from "@/layouts/Container";
import { signup, type SignupPayload } from "@/services/auth";
import { useNavigate } from "react-router-dom";

interface SignupPageProps {}

const SignupPage: FC<SignupPageProps> = () => {
  const navigate = useNavigate();

  const handleSignup = async (values: SignupPayload) => {
    try {
      await signup(values);
      navigate("/");
    } catch (error) {
      // 에러 핸들링
      throw Error(`Error: ${error}`);
    }
  };

  return (
    <Container>
      <Signup onSignup={handleSignup} />
    </Container>
  );
};

export default SignupPage;
