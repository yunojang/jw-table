import { Link } from "react-router-dom";
import Button from "./UI/Button";

const GuardLogin = (feature: React.ReactNode) => {
  const b = false;
  return b ? (
    feature
  ) : (
    <div className="text-white/80">
      이 기능은 로그인 후 이용 가능합니다.
      <div className="mt-3 flex gap-2">
        <Link to={"/login"}>
          <Button>로그인</Button>
        </Link>
        <Link to={"/login"}>
          <Button variant="flat">회원가입</Button>
        </Link>
      </div>
    </div>
  );
};

export default GuardLogin;
