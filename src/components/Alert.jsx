const estilos = {
  success: "border-success text-success",
  danger: "border-danger text-danger",
};

export function Alert({ children, type = "danger" }) {
  return (
    <p className={`text-sm border rounded px-3 py-2 ${estilos[type]}`}>
      {children}
    </p>
  );
}
