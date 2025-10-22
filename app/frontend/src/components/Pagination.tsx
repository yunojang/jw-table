function Pagination({
  current,
  totalPages,
  onPage,
  className = "",
}: {
  current: number;
  totalPages: number;
  onPage: (n: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={`relative flex items-center justify-center gap-2 rounded-2xl border border-pink-400/20 bg-black/60 px-4 py-3 shadow-[0_0_25px_rgba(255,0,155,0.2)] ${className}`}
    >
      <span className="pagination-glow" />

      <button
        type="button"
        className="pagination-arrow"
        disabled={current <= 1}
        onClick={() => onPage(Math.max(1, current - 1))}
      >
        <span className="arrow-line arrow-line--left" />
        이전
      </button>

      <div className="flex items-center gap-2">
        {pages.map((n) => {
          const isActive = n === current;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPage(n)}
              className={`pagination-dot ${isActive ? "is-active" : ""}`}
            >
              <span className="pagination-dot__glow" />
              <span className="pagination-dot__label">{n}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pagination-arrow"
        disabled={current >= totalPages}
        onClick={() => onPage(Math.min(totalPages, current + 1))}
      >
        다음
        <span className="arrow-line arrow-line--right" />
      </button>
    </div>
  );
}

export default Pagination;
