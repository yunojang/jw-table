import Button from "./UI/Button";

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="flat"
        disabled={current <= 1}
        onClick={() => onPage(current - 1)}
      >
        이전
      </Button>
      {pages.map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${
            n === current
              ? "bg-pink-600 border-pink-400 text-white"
              : "bg-black/40 border-pink-500/20 text-white hover:bg-white/10"
          }`}
        >
          {n}
        </button>
      ))}
      <Button
        variant="flat"
        disabled={current >= totalPages}
        onClick={() => onPage(current + 1)}
      >
        다음
      </Button>
    </div>
  );
}

export default Pagination;
