import { useState } from "react";
import { Input } from "@/components/ui/input";

export function CampoPassword({ value, onChange, name, required, minLength }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="pr-16"
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
