import { useState } from "react";
import Button from "./UI/Button";
import { Input } from "./UI/Input";
import type { SignupPayload } from "@/services/auth";

function Signup({
  onSignup,
  loading,
}: {
  onSignup: (payload: SignupPayload) => void;
  loading?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [nickname, setNickname] = useState("");
  return (
    <div className="max-w-sm neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">회원가입</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <Input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="패스워드"
        />
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button
          onClick={() =>
            onSignup({
              email: email.trim(),
              nickname: nickname.trim(),
              password: pwd.trim(),
            })
          }
        >
          {loading ? "Loading..." : "가입하기"}
        </Button>
      </div>
    </div>
  );
}

export default Signup;
