import { useState, useEffect } from "react";
import { getState, getAgendaEmpleado } from "/src/services/EmployerService";

export function DailyAgenda() {
  const [empleados, setEmpleados] = useState([]);
  const [fecha, setFecha] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const data = await getState();
      setEmpleados(data.data);
    };
    cargar();
  }, []);

  async function consultarAgenda() {
    if (!fecha) return;
    setCargando(true);
    try {
      const resultados = await Promise.all(
        empleados.map((emp) => getAgendaEmpleado(emp.id, fecha))
      );
      setAgendas(resultados.map((r) => r.data));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-black text-gray-200 font-mono p-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="border-b border-cyan-500/30 pb-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Agenda Diaria
          </h1>

          <div className="flex gap-2">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="px-3 py-2 bg-slate-900/80 border border-cyan-500/30 text-white rounded-lg focus:outline-none focus:border-cyan-400 text-sm font-mono"
            />
            <button
              onClick={consultarAgenda}
              className="rounded-md px-5 py-2 uppercase tracking-wide text-sm bg-black/70 border border-cyan-500/50 text-cyan-300 transition-all duration-300 cursor-pointer hover:border-fuchsia-500/70 hover:text-fuchsia-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            >
              {cargando ? "Consultando..." : "Consultar"}
            </button>
          </div>
        </header>

        {agendas.length === 0 ? (
          <p className="text-gray-500">Selecciona una fecha para ver la agenda del establecimiento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.map((emp) => (
              <div key={emp.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-accent rounded-2xl blur-md opacity-30" />
                <div className="relative bg-neutral-900/90 border border-pink-500/40 rounded-2xl p-4">
                  <h3 className="text-cyan-300 font-bold uppercase text-sm">
                    {emp.usuario?.nombre} {emp.usuario?.primerApellido}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{emp.especialidad?.nombre}</p>

                  <p className="text-xs uppercase text-fuchsia-300 mb-1">Citas</p>
                  {emp.citas?.length ? (
                    emp.citas.map((cita) => (
                      <p key={cita.id} className="text-xs text-gray-300 mb-1">
                        {cita.horaInicio} - {cita.horaFin} · {cita.servicio?.nombre} ·{" "}
                        {cita.cliente?.nombre} ({cita.estadoCita?.nombre})
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">Sin citas ese día</p>
                  )}

                  <p className="text-xs uppercase text-fuchsia-300 mt-3 mb-1">Restricciones</p>
                  {emp.restricciones?.length ? (
                    emp.restricciones.map((r) => (
                      <p key={r.id} className="text-xs text-gray-300 mb-1">
                        {r.todoElDia ? "Todo el día" : `${r.horaInicio} - ${r.horaFin}`} ·{" "}
                        {r.tipoRestriccion?.nombre}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">Sin restricciones ese día</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
