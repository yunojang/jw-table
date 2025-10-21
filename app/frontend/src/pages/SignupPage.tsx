import { useState, type FC } from "react";

import Signup from "@/components/Singnup";
import Container from "@/layouts/Container";
import { signup, type SignupPayload } from "@/services/auth";
import { useNavigate } from "react-router-dom";

interface SignupPageProps {}

const SignupPage: FC<SignupPageProps> = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const handleSignup = async (values: SignupPayload) => {
    try {
      await signup(values);
      navigate("/");
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <Container>
      <Signup onSignup={handleSignup} />
      {error && (
        <div className="w-80 font-semibold text-md text-red-500">{error}</div>
      )}
    </Container>
  );
};

export default SignupPage;
