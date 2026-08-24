import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// La API a veces devuelve `fecha` como YYYY-MM-DD y otras como datetime ISO
// completo; esto normaliza cualquiera de los dos a YYYY-MM-DD real, para
// poder comparar fechas de forma confiable (no solo recortar el string).
export function normalizarFechaISO(valor) {
  if (!valor) return "";
  const soloFecha = valor.length > 10 ? valor.slice(0, 10) : valor;
  const fecha = new Date(`${soloFecha}T00:00:00Z`);
  if (Number.isNaN(fecha.getTime())) return soloFecha;
  return fecha.toISOString().slice(0, 10);
}

// Igual que normalizarFechaISO pero para mostrar en pantalla (DD/MM/AAAA).
export function formatFecha(valor) {
  if (!valor) return "";
  const soloFecha = valor.length > 10 ? valor.slice(0, 10) : valor;
  const fecha = new Date(`${soloFecha}T00:00:00Z`);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-CR", { timeZone: "UTC" });
}
