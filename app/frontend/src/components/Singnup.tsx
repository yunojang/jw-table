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

  const handleSubmit = () => {
    onSignup({
      email: values.email.trim(),
      password: values.password.trim(),
      nickname: values.nickname.trim(),
    });
  };

  return (
    <div className="max-w-sm neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">회원가입</h1>
      <div className="mt-4 space-y-3">
        <Input
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="이메일"
        />
        <Input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="패스워드"
        />
        <Input
          name="nickname"
          value={values.nickname}
          onChange={handleChange}
          placeholder="닉네임"
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button onClick={handleSubmit}>
          {loading ? "Loading..." : "가입하기"}
        </Button>
      </div>
    </div>
  );
}

export default Signup;
