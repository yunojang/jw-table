import { useState } from "react";
import Button from "./UI/Button";
import { Input } from "./UI/Input";

function Signup({
  onSignup,
}: {
  onSignup: (username: string, nickname: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  return (
    <div className="max-w-sm neon-card rounded-2xl p-6">
      <h1 className="text-xl font-extrabold">회원가입</h1>
      <div className="mt-4 space-y-3">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디(영문/숫자)"
        />
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            onSignup(username.trim(), nickname.trim() || username.trim())
          }
        >
          가입하기
        </Button>
      </div>
    </div>
  );
}

export default Signup;
