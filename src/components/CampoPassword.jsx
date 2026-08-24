import { useState } from "react";

export function CampoPassword({ value, onChange, name, required, minLength }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="w-full border rounded px-3 py-2 pr-16"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold uppercase border border-hover text-hover rounded-full px-3 py-1"
      >
        {visible ? "Ocultar" : "Ver"}
      </button>
    </div>
  );
}
