const loginKeywords = ["Pair", "Review", "Retro", "Skill-up"];
const signupKeywords = ["Team", "Sprint", "Growth", "Ship it"];

interface AuthHeroProps {
  mode: "login" | "signup";
  onToggle?: () => void;
}

function AuthHero({ mode, onToggle }: AuthHeroProps) {
  const isLogin = mode === "login";
  const keywords = isLogin ? loginKeywords : signupKeywords;

  return (
    <section className="auth-hero relative overflow-hidden rounded-3xl border border-pink-500/20 bg-black/60 px-6 py-12 shadow-[0_0_55px_rgba(255,0,155,0.2)] md:px-12">
      <div className="auth-hero__bg" />

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-5">
          <p className="auth-hero__eyebrow">
            {isLogin ? "Welcome Back" : "New Crew"}
          </p>
          <h1 className="auth-hero__title">
            {isLogin ? "정글러의 하루를 다시 연결해요." : "정글에서의 여정을 함께 떠나요."}
          </h1>
          <p className="auth-hero__subtitle">
            {isLogin
              ? "정글에서 쌓은 기록과 피드백, 오늘의 인사이트까지. 다시 접속하면 새로운 모험이 이어집니다."
              : "실험과 실패, 성장과 공유를 함께 경험할 정글 팀을 찾고 있다면 지금 합류하세요."}
          </p>
          {onToggle && (
            <button type="button" onClick={onToggle} className="auth-hero__toggle">
              {isLogin ? "계정이 없나요? 가입하러 가기" : "이미 회원인가요? 로그인하기"}
            </button>
          )}
        </div>

        <div className="relative flex h-48 w-full max-w-sm items-center justify-center md:h-52">
          <div className="auth-hero__rings" />
          <span className="auth-hero__icon">{isLogin ? "🔐" : "🚀"}</span>
          <div className="auth-hero__keywords">
            {keywords.map((word, index) => (
              <span
                key={word}
                className="auth-hero__keyword"
                style={{ animationDelay: `${index * 0.35}s` }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthHero;
