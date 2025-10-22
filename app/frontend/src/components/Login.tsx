import { Input } from "./UI/Input";
import Button from "./UI/Button";
import useForm from "@/hooks/useForm";
import type { LoginPayload } from "@/types";

function Login({
  onLogin,
  gotoSignup,
}: {
  onLogin: (values: LoginPayload) => void;
  gotoSignup: () => void;
}) {
  const { values, handleChange } = useForm({
    email: "",
    password: "",
  });

  return (
    <form
      className="auth-panel max-w-md h-full"
      onSubmit={(event) => {
        event.preventDefault();
        onLogin(values);
      }}
    >
      <header className="auth-panel__header">
        <span className="text-xs uppercase tracking-[0.35em] text-pink-200/80">
          Login
        </span>
        <h2 className="auth-panel__title">정글 공간으로</h2>
        <p className="auth-panel__subtitle">이메일과 비밀번호로 접속하세요</p>
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
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="패스워드"
            type="password"
            autoComplete="current-password"
          />
        </div>
      </div>

      <div className="auth-actions mt-6">
        <Button type="button" variant="flat" onClick={gotoSignup}>
          회원가입
        </Button>
        <Button type="submit">로그인</Button>
      </div>
    </form>
  );
}

export default Login;
