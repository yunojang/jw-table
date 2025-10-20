export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full bg-black/50 text-white placeholder-white/50 border border-pink-500/30 focus:ring-2 focus:ring-pink-400 rounded-xl px-4 py-2 ${className}`}
    {...props}
  />
);
