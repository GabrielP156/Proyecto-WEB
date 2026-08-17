export function Label({ children, required }) {
  return (
    <label className="block text-xs uppercase tracking-wide text-muted mb-1">
      {children} {required && <span className="text-danger">*</span>}
    </label>
  );
}
