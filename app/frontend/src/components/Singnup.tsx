import type { FormEvent } from "react";
import Button from "./UI/Button";
import { Input } from "./UI/Input";
import type { SignupPayload } from "@/services/auth";
import useForm from "@/hooks/useForm";

function Signup({
  onSignup,
  loading,
}: {
  onSignup: (payload: SignupPayload) => void;
  loading?: boolean;
}) {
  const { values, handleChange } = useForm({
    email: "",
    password: "",
    nickname: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSignup({
      email: values.email.trim(),
      password: values.password.trim(),
      nickname: values.nickname.trim(),
    });
  };

  return (
    <form className="auth-panel max-w-md" onSubmit={handleSubmit}>
      <header className="auth-panel__header">
        <span className="text-xs uppercase tracking-[0.35em] text-pink-200/80">
          Signup
        </span>
        <h2 className="auth-panel__title">정글의 새로운 동료가 되세요</h2>
        <p className="auth-panel__subtitle">
          같은 목표를 향해 달릴 크루와 연결되고 싶다면, 지금 바로 계정을 만들어
          보세요.
        </p>
      </header>

      <div className="space-y-4">
        <div className="sparkle-field p-0.5 rounded-2xl">
          <Input
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="이메일"
            autoComplete="email"
          />
        </div>
        <div className="sparkle-field p-0.5 rounded-2xl">
          <Input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="패스워드"
            autoComplete="new-password"
          />
        </div>
        <div className="sparkle-field p-0.5 rounded-2xl">
          <Input
            name="nickname"
            value={values.nickname}
            onChange={handleChange}
            placeholder="닉네임"
            autoComplete="nickname"
          />
        </div>
      </div>

      <div className="auth-actions mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "가입하기"}
        </Button>
      </div>
    </form>
  );
}

export default Signup;
