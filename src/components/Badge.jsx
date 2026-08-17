const colores = {
  success: "border-success text-success",
  danger: "border-danger text-danger",
  warning: "border-warning text-warning",
  info: "border-info text-info",
};

export function Badge({ children, color = "info" }) {
  return (
    <span className={`text-xs w-fit px-2 py-1 rounded border bg-black/40 ${colores[color]}`}>
      {children}
    </span>
  );
}
