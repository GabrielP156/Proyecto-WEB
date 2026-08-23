import { useState, useEffect } from "react";
import { ListAllSchedules } from "/src/services/ScheduleService";

function formatHora(valor) {
  if (!valor) return "";
  return valor.length > 5 ? valor.slice(11, 16) : valor;
}

export function Schedules() {
  const [horarios, setHorarios] = useState([]);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [horario, setHorario] = useState(null);
  const [ordenColumna, setOrdenColumna] = useState("dia");
  const [ordenAsc, setOrdenAsc] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const data = await ListAllSchedules();
      setHorarios(data.data);
    };
    cargar();
  }, []);

  function verDetalles(item) {
    setHorario(item);
    setModalDetalles(true);
  }

  function ordenarPor(columna) {
    if (ordenColumna === columna) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenColumna(columna);
      setOrdenAsc(true);
    }
  }

  const horariosOrdenados = [...horarios].sort((a, b) => {
    let valorA, valorB;
    if (ordenColumna === "inicio") {
      valorA = a.horaInicio || "";
      valorB = b.horaInicio || "";
    } else if (ordenColumna === "estado") {
      valorA = a.activo ? 1 : 0;
      valorB = b.activo ? 1 : 0;
    } else {
      valorA = a.diaSemana?.numeroOrden ?? a.diaSemana?.nombre ?? "";
      valorB = b.diaSemana?.numeroOrden ?? b.diaSemana?.nombre ?? "";
    }
    if (valorA < valorB) return ordenAsc ? -1 : 1;
    if (valorA > valorB) return ordenAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="relative w-full min-h-screen bg-black text-gray-200 font-mono p-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="border-b border-cyan-500/30 pb-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Horarios de Atención
          </h1>
        </header>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-accent rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition duration-500" />
          <div className="relative bg-neutral-900/90 border border-pink-500/40 rounded-2xl p-6 min-h-[400px] overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm text-gray-300">
              <thead className="text-pink-300 uppercase text-xs border-b border-pink-500/30">
                <tr>
                  <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => ordenarPor("dia")}>
                    Día {ordenColumna === "dia" && (ordenAsc ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => ordenarPor("inicio")}>
                    Hora inicio {ordenColumna === "inicio" && (ordenAsc ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-3">Hora fin</th>
                  <th className="px-4 py-3 cursor-pointer select-none hover:text-white" onClick={() => ordenarPor("estado")}>
                    Estado {ordenColumna === "estado" && (ordenAsc ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {horariosOrdenados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      Sin horarios registrados
                    </td>
                  </tr>
                ) : (
                  horariosOrdenados.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => verDetalles(item)}
                      className="border-b border-pink-500/10 hover:bg-pink-500/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">{item.diaSemana?.nombre}</td>
                      <td className="px-4 py-3">{formatHora(item.horaInicio)}</td>
                      <td className="px-4 py-3">{formatHora(item.horaFin)}</td>
                      <td className="px-4 py-3">{item.activo ? "Activo" : "Desactivado"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalDetalles && horario && (
        <div
          onClick={() => setModalDetalles(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative group max-h-[85vh] w-full max-w-lg"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur-md opacity-60" />
            <div className="relative bg-neutral-900/90 border border-cyan-500/30 rounded-2xl p-6 overflow-y-auto max-h-[85vh]">
              <button
                onClick={() => setModalDetalles(false)}
                className="absolute top-3 right-3 text-white bg-black/60 hover:bg-fuchsia-600 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold uppercase text-cyan-300">{horario.diaSemana?.nombre}</h3>

              <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Horario</p>
              <p className="text-sm text-gray-300">
                {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
              </p>

              <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Estado</p>
              <p className="text-sm text-gray-300">{horario.activo ? "Activo" : "Desactivado"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
