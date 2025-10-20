export const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border border-pink-500/30 text-fuchsia-100/90 bg-gradient-to-br from-pink-500 to-fuchsia-600 ${className}`}
  >
    {children}
  </span>
);
