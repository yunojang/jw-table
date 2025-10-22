import { useMemo } from "react";
import Button from "@/components/UI/Button";
import { useAuth } from "@/hooks/useAuth";

const floatingShapes = [
  { size: 80, top: "12%", left: "8%", delay: 0 },
  { size: 60, top: "68%", left: "18%", delay: 3 },
  { size: 110, top: "40%", left: "85%", delay: 1.5 },
  { size: 70, top: "15%", left: "72%", delay: 4.2 },
  { size: 90, top: "78%", left: "68%", delay: 2.4 },
];

function HeroBanner({
  onPrimary,
  onSecondary,
}: {
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const shapes = useMemo(
    () =>
      floatingShapes.map((shape, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gradient-to-tr from-pink-500/60 to-cyan-400/60 blur-lg animate-float"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            top: shape.top,
            left: shape.left,
            animationDelay: `${shape.delay}s`,
          }}
        />
      )),
    []
  );

  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-black/60 px-6 py-16 shadow-[0_0_60px_rgba(255,0,155,0.35)] md:px-10">
      {/* 오로라 배경 */}
      <div className="absolute inset-0 opacity-80">
        <div className="aurora-scroll pointer-events-none" />
      </div>

      {/* 떠다니는 도형 */}
      {shapes}

      {/* 콘텐츠 */}
      <div className="relative mx-auto max-w-3xl text-center text-fuchsia-100">
        <p className="inline-flex items-center gap-2 rounded-full border border-pink-400/40 bg-pink-500/10 px-4 py-1 text-xs tracking-widest uppercase text-pink-200 shadow-[0_0_25px_rgba(255,0,155,0.35)]">
          ✨{" "}
          <span className="glitch" data-text="PLAY GROUND">
            PLAY GROUND
          </span>{" "}
          • Anime × Manga × 1조
        </p>
        <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
          15주차 풀스택 학습
          <span className="mx-2 inline-block bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            정글 커뮤니티
          </span>
        </h1>
        <p className="mt-6 text-base text-fuchsia-100/80 sm:text-lg">
          최신 개발소식 부터 채용 공고까지. 지금 바로 정글 커뮤니티에서 소식을
          나누고 새로운 동료를 만나보세요!
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={onPrimary} className="px-8 py-3 text-base">
            게시판 둘러보기
          </Button>
          {isAuthenticated && (
            <Button
              variant="flat"
              onClick={onSecondary}
              className="border border-pink-400/40 px-8 py-3 text-base text-white hover:bg-white/10"
            >
              지금 글쓰기
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
