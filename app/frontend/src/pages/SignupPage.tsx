import { useState, type FC } from "react";

import Signup from "@/components/Singnup";
import Container from "@/layouts/Container";
import { signup, type SignupPayload } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import AuthHero from "@/components/AuthHero";

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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_480px]">
        <AuthHero
          mode="signup"
          onToggle={() => navigate("/login", { replace: true })}
        />

        <div className="space-y-4">
          <Signup onSignup={handleSignup} />

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

export default SignupPage;
