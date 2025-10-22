const rotatingWords = [
  "Story",
  "TIL",
  "React",
  "Pintos",
  "Python",
  "Algorithm",
];

function WriteInspiration({ onWrite }: { onWrite?: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-black/60 px-6 py-12 shadow-[0_0_45px_rgba(255,0,155,0.25)] md:px-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="write-portal" />
        <div className="write-portal-ring" />
      </div>

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-pink-400/50 bg-pink-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-pink-200">
            Create Mode
          </p>
          <h1 className="text-3xl font-black text-white md:text-4xl">
            당신의 이야기가 <span className="write-gradient-text">정글</span>을
            채우도록.
          </h1>
          <p className="text-sm text-fuchsia-100/80 md:text-base">
            정글에서 익힌 실험과 실패, 정글러들의 피드백까지. 이곳에 모인 경험은
            보다 강력한 프로젝트 이야기로 진화합니다.
          </p>
          {onWrite && (
            <button
              type="button"
              onClick={onWrite}
              className="typewriter-button"
            >
              <span className="typewriter-icon">⌨</span>
              <span className="typewriter-line" />
              <span className="typewriter-label">바로 작성 시작</span>
            </button>
          )}
        </div>

        <div className="relative flex h-56 w-full max-w-sm items-center justify-center">
          <div className="rotating-keywords">
            {rotatingWords.map((word, index) => (
              <span
                key={word}
                className="rotating-keyword"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="write-orb" />
          <span className="write-pen">🧭</span>
        </div>
      </div>
    </section>
  );
}

export default WriteInspiration;
