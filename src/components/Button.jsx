export function Button({ children, variant = "primary", className = "", ...props }) {
  const estilos = {
    primary:
      "bg-gradient-to-r from-accent via-secondary to-hover text-black font-extrabold shadow-[0_0_20px_-4px_var(--color-secondary)] hover:opacity-90",
    accent: "bg-accent text-black font-bold shadow-[0_0_10px_var(--color-accent)] hover:opacity-90",
    secondary: "bg-secondary text-white font-bold shadow-[0_0_10px_var(--color-secondary)] hover:opacity-90",
    outline: "border border-secondary text-secondary hover:bg-secondary hover:text-white",
  };

  return (
    <button
      className={` cursor-pointer font-display rounded px-3 py-2 text-sm uppercase tracking-wide disabled:opacity-50 transition hover:-translate-y-0.5 ${estilos[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
