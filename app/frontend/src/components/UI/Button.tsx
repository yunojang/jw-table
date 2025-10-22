const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "flat";
  }
> = ({ className = "", variant = "primary", ...props }) => {
  const base =
    "px-4 py-2 rounded-xl text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-50  disabled:cursor-not-allowed";
  const map = {
    primary: "bg-pink-600 hover:bg-pink-500 text-white focus:ring-pink-400",
    ghost: "bg-transparent hover:bg-white/5 text-white focus:ring-pink-400",
    flat: "bg-white/10 hover:bg-white/20  text-white focus:ring-white/40",
  } as const;

  return (
    <button className={`${base} ${map[variant]} ${className} `} {...props} />
  );
};

export default Button;
