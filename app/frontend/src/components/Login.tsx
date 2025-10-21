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
    <div className="max-w-md neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">로그인</h1>
      <div className="mt-4 space-y-3">
        <Input
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="이메일"
        />
        <Input
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="패스워드"
          type="password"
        />
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button onClick={() => onLogin(values)}>로그인</Button>
        <Button variant="flat" onClick={gotoSignup}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default Login;
