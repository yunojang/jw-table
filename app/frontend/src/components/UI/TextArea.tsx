export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className = "", ...props }) => (
  <textarea
    className={`w-full min-h-[120px] bg-black/50 text-white placeholder-white/50 border border-pink-500/30 focus:ring-2 focus:ring-pink-400 rounded-xl px-4 py-3 ${className}`}
    {...props}
  />
);
