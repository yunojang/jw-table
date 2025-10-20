import { useState } from "react";
import { Input } from "./UI/Input";
import Button from "./UI/Button";

function Login({
  onLogin,
  gotoSignup,
}: {
  onLogin: (username: string) => void;
  gotoSignup: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-sm neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">로그인</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="패스워드"
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button onClick={() => onLogin(username.trim())}>로그인</Button>
        <Button variant="flat" onClick={gotoSignup}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default Login;
