import { useState, useEffect } from "react";
import { getState, getAgendaEmpleado } from "/src/services/EmployerService";
import { ListAllSchedules } from "/src/services/ScheduleService";
import { ListAllRestrictions } from "/src/services/RestrictionsService";
import { Modal } from "/src/components/Modal";
import { formatFecha, normalizarFechaISO } from "@/lib/utils";

function formatHora(valor) {
  if (!valor) return "";
  return valor.length > 5 ? valor.slice(11, 16) : valor;
}

function numeroOrdenDeFecha(fecha) {
  const diaJs = new Date(`${fecha}T00:00:00Z`).getUTCDay();
  return diaJs === 0 ? 7 : diaJs;
}

const COLOR_SEGMENTO = {
  disponible: "border-emerald-400/50 bg-emerald-500/10 text-emerald-300",
  ocupado: "border-yellow-400/50 bg-yellow-500/10 text-yellow-300 cursor-pointer hover:bg-yellow-500/20",
  restringido: "border-red-400/50 bg-red-500/10 text-red-300",
};

const ETIQUETA_SEGMENTO = {
  disponible: "Disponible",
  ocupado: "Ocupado",
  restringido: "Restringido",
};

function construirSegmentos(horario, citas, restricciones) {
  if (!horario) return [];

  const eventos = [];
  (citas || [])
    .filter((c) => c.estadoCita?.nombre !== "Cancelada")
    .forEach((c) => {
      eventos.push({ tipo: "ocupado", inicio: formatHora(c.horaInicio), fin: formatHora(c.horaFin), cita: c });
    });
  (restricciones || []).forEach((r) => {
    const inicio = r.todoElDia ? formatHora(horario.horaInicio) : formatHora(r.horaInicio);
    const fin = r.todoElDia ? formatHora(horario.horaFin) : formatHora(r.horaFin);
    eventos.push({ tipo: "restringido", inicio, fin, restriccion: r });
  });
  eventos.sort((a, b) => a.inicio.localeCompare(b.inicio));

  const inicioDia = formatHora(horario.horaInicio);
  const finDia = formatHora(horario.horaFin);
  const segmentos = [];
  let cursor = inicioDia;

  for (const evento of eventos) {
    if (evento.inicio > cursor) {
      segmentos.push({ tipo: "disponible", inicio: cursor, fin: evento.inicio });
    }
    segmentos.push(evento);
    if (evento.fin > cursor) cursor = evento.fin;
  }
  if (cursor < finDia) {
    segmentos.push({ tipo: "disponible", inicio: cursor, fin: finDia });
  }
  return segmentos;
}

export function DailyAgenda() {
  const [empleados, setEmpleados] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fecha, setFecha] = useState("");
  const [agendas, setAgendas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [errorAgenda, setErrorAgenda] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const dataEmpleados = await getState();
      const dataHorarios = await ListAllSchedules();
      setEmpleados(dataEmpleados.data);
      setHorarios(dataHorarios.data);
    };
    cargar();
  }, []);

  async function consultarAgenda() {
    if (!fecha) return;
    setCargando(true);
    setErrorAgenda(null);
    try {
      const [resultados, dataRestricciones] = await Promise.all([
        Promise.all(empleados.map((emp) => getAgendaEmpleado(emp.id, fecha))),
        ListAllRestrictions(),
      ]);

      // El endpoint de agenda de cada empleado solo devuelve las
      // restricciones específicas de ese empleado (relación por empleadoId).
      // Las restricciones generales del establecimiento (empleadoId nulo)
      // aplican a todos, así que se agregan aquí manualmente.
      const restriccionesGenerales = dataRestricciones.data.filter(
        (r) => r.activo && !r.empleadoId && normalizarFechaISO(r.fecha) === fecha
      );

      setAgendas(
        resultados.map((r) => ({
          ...r.data,
          restricciones: [...(r.data.restricciones || []), ...restriccionesGenerales],
        }))
      );
    } catch (error) {
      setErrorAgenda(error.message || "No se pudo consultar la agenda");
      setAgendas([]);
    } finally {
      setCargando(false);
    }
  }

  const horarioDelDia = fecha
    ? horarios.find((h) => h.diaSemana?.numeroOrden === numeroOrdenDeFecha(fecha) && h.activo)
    : null;

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

        {/* Horario general de atención */}
        <div className="flex flex-wrap gap-2">
          {horarios.map((h) => (
            <span
              key={h.id}
              className={`text-xs px-3 py-1 border rounded font-mono uppercase ${
                fecha && h.diaSemana?.numeroOrden === numeroOrdenDeFecha(fecha)
                  ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                  : "border-white/10 text-gray-500"
              }`}
            >
              {h.diaSemana?.nombre}: {h.activo ? `${formatHora(h.horaInicio)} - ${formatHora(h.horaFin)}` : "Cerrado"}
            </span>
          ))}
        </div>

        {errorAgenda && <p className="text-fuchsia-400 text-sm">{errorAgenda}</p>}

        {agendas.length === 0 ? (
          <p className="text-gray-500">Selecciona una fecha para ver la agenda del establecimiento.</p>
        ) : !horarioDelDia ? (
          <p className="text-gray-500">El establecimiento no atiende ese día.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.map((emp) => {
              const segmentos = construirSegmentos(horarioDelDia, emp.citas, emp.restricciones);
              return (
                <div key={emp.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-accent rounded-2xl blur-md opacity-30" />
                  <div className="relative bg-neutral-900/90 border border-pink-500/40 rounded-2xl p-4">
                    <h3 className="text-cyan-300 font-bold uppercase text-sm">
                      {emp.usuario?.nombre} {emp.usuario?.primerApellido}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">{emp.especialidad?.nombre}</p>

                    <p className="text-xs uppercase text-fuchsia-300 mb-1">Línea de tiempo</p>
                    <div className="space-y-1">
                      {segmentos.map((seg, idx) => (
                        <div
                          key={idx}
                          onClick={() => seg.tipo === "ocupado" && setCitaSeleccionada(seg.cita)}
                          className={`text-xs px-2 py-1 border rounded flex justify-between gap-2 ${COLOR_SEGMENTO[seg.tipo]}`}
                        >
                          <span>{seg.inicio} - {seg.fin}</span>
                          <span className="text-right">
                            {ETIQUETA_SEGMENTO[seg.tipo]}
                            {seg.tipo === "ocupado" && ` · ${seg.cita.servicio?.nombre}`}
                            {seg.tipo === "restringido" && ` · ${seg.restriccion.tipoRestriccion?.nombre}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {citaSeleccionada && (
        <Modal onClose={() => setCitaSeleccionada(null)}>
          <h3 className="text-xl font-bold uppercase text-cyan-300">{citaSeleccionada.servicio?.nombre}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {formatFecha(citaSeleccionada.fecha)} · {formatHora(citaSeleccionada.horaInicio)} - {formatHora(citaSeleccionada.horaFin)}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Cliente</p>
          <p className="text-sm text-gray-300">
            {citaSeleccionada.cliente?.nombre} {citaSeleccionada.cliente?.primerApellido}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Adicionales</p>
          <p className="text-sm text-gray-300">
            {citaSeleccionada.adicionales?.map((a) => a.nombre).join(", ") || "Ninguno"}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Costo total</p>
          <p className="text-sm text-gray-300">${citaSeleccionada.costoTotal}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Observaciones</p>
          <p className="text-sm text-gray-300">{citaSeleccionada.observaciones || "Sin observaciones"}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Estado</p>
          <p className="text-sm text-gray-300">{citaSeleccionada.estadoCita?.nombre}</p>
        </Modal>
      )}
    </div>
  );
}
