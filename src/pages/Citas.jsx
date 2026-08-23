import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "/src/services/auth/useAuth";
import {
  ListAllCitas,
  ListCitasByCliente,
  ListCitasByEmpleado,
  CreateCita,
  updateCita,
  cambiarEstadoCita,
  cancelarCita,
  getEstadosCita,
  getEmpleadosPorServicio,
  consultarDisponibilidad,
} from "/src/services/CitaService";
import { ListAllEmployers, getAgendaEmpleado } from "/src/services/EmployerService";
import { getState as getServiciosActivos } from "/src/services/Servicios";
import { getStateAdicional } from "/src/services/additionalService";
import { listarUsuarios } from "/src/services/usuarioService";
import { Table } from "/src/components/Table";
import { Modal } from "/src/components/Modal";

const COLOR_ESTADO = {
  Pendiente: "bg-yellow-500/20 text-yellow-300 border-yellow-400/50",
  Confirmada: "bg-blue-500/20 text-blue-300 border-blue-400/50",
  Finalizada: "bg-green-500/20 text-green-300 border-green-400/50",
  Cancelada: "bg-red-500/20 text-red-300 border-red-400/50",
};

function EstadoBadge({ nombre }) {
  const clase = COLOR_ESTADO[nombre] || "bg-gray-500/20 text-gray-300 border-gray-400/50";
  return (
    <span className={`inline-block text-xs px-2 py-1 border rounded ${clase}`}>
      {nombre}
    </span>
  );
}

function sumarMinutos(horaInicio, minutos) {
  const [h, m] = horaInicio.split(":").map(Number);
  const total = h * 60 + m + Number(minutos);
  const horaFinal = Math.floor(total / 60) % 24;
  const minutoFinal = total % 60;
  return `${String(horaFinal).padStart(2, "0")}:${String(minutoFinal).padStart(2, "0")}`;
}

export function Citas() {
  const { usuario } = useAuth();
  const rol = usuario?.rol?.nombre;
  const esStaff = rol === "Administrador" || rol === "Empleado";

  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [adicionales, setAdicionales] = useState([]);
  const [empleadosServicio, setEmpleadosServicio] = useState([]);
  const [estados, setEstados] = useState([]);

  const [modal, setModal] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const [modalDetalles, setModalDetalles] = useState(false);
  const [cita, setCita] = useState(null);
  const [ordenColumna, setOrdenColumna] = useState("fecha");
  const [ordenAsc, setOrdenAsc] = useState(false);
  const [agendaEmpleado, setAgendaEmpleado] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [consultandoDisponibilidad, setConsultandoDisponibilidad] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      clienteId: "",
      servicioId: "",
      empleadoId: "",
      fecha: "",
      horaInicio: "",
      observaciones: "",
      adicionalIds: [],
    },
  });

  const servicioIdSeleccionado = watch("servicioId");
  const empleadoIdSeleccionado = watch("empleadoId");
  const fechaSeleccionada = watch("fecha");
  const horaInicioSeleccionada = watch("horaInicio");
  const adicionalesSeleccionados = watch("adicionalIds") || [];
  const hoy = new Date().toISOString().slice(0, 10);

  const servicioActual = servicios.find((s) => String(s.id) === String(servicioIdSeleccionado));
  const precioServicio = servicioActual ? Number(servicioActual.precioBase) : 0;
  const duracionMinutos = servicioActual ? Number(servicioActual.duracionMinutos) : 0;
  const costoAdicionales = adicionales
    .filter((a) => adicionalesSeleccionados.includes(String(a.id)))
    .reduce((total, a) => total + Number(a.precio), 0);
  const costoTotal = precioServicio + costoAdicionales;
  const horaFin = horaInicioSeleccionada && duracionMinutos
    ? sumarMinutos(horaInicioSeleccionada, duracionMinutos)
    : "";

  async function cargarCitas() {
    if (rol === "Cliente") {
      const data = await ListCitasByCliente(usuario.id);
      setCitas(data.data);
    } else if (rol === "Empleado") {
      const dataEmpleados = await ListAllEmployers();
      const miEmpleado = dataEmpleados.data.find((e) => e.usuarioId === usuario.id);
      if (miEmpleado) {
        const data = await ListCitasByEmpleado(miEmpleado.id);
        setCitas(data.data);
      }
    } else {
      const data = await ListAllCitas();
      setCitas(data.data);
    }
  }

  useEffect(() => {
    if (!usuario) return;
    cargarCitas();
    if (esStaff) {
      listarUsuarios("Cliente").then((data) => setClientes(data.data));
      getServiciosActivos().then((data) => setServicios(data.data));
      getStateAdicional().then((data) => setAdicionales(data.data));
      getEstadosCita().then((data) => setEstados(data.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  useEffect(() => {
    if (!servicioIdSeleccionado) {
      setEmpleadosServicio([]);
      return;
    }
    getEmpleadosPorServicio(servicioIdSeleccionado).then((data) => setEmpleadosServicio(data.data));
  }, [servicioIdSeleccionado]);

  useEffect(() => {
    if (!empleadoIdSeleccionado || !fechaSeleccionada) {
      setAgendaEmpleado(null);
      return;
    }
    getAgendaEmpleado(empleadoIdSeleccionado, fechaSeleccionada).then((data) => setAgendaEmpleado(data.data));
  }, [empleadoIdSeleccionado, fechaSeleccionada]);

  useEffect(() => {
    if (!empleadoIdSeleccionado || !servicioIdSeleccionado || !fechaSeleccionada || !horaInicioSeleccionada || !horaFin) {
      setDisponibilidad(null);
      return;
    }
    setConsultandoDisponibilidad(true);
    consultarDisponibilidad({
      empleadoId: Number(empleadoIdSeleccionado),
      servicioId: Number(servicioIdSeleccionado),
      fecha: fechaSeleccionada,
      horaInicio: horaInicioSeleccionada,
      horaFin,
      citaIdExcluir: citaEditando?.id ?? null,
    })
      .then((data) => setDisponibilidad(data.data))
      .catch((error) => setDisponibilidad({ disponible: false, motivo: error.message }))
      .finally(() => setConsultandoDisponibilidad(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleadoIdSeleccionado, servicioIdSeleccionado, fechaSeleccionada, horaInicioSeleccionada, horaFin]);

  function cerrarModal() {
    setModal(false);
    setCitaEditando(null);
    setAgendaEmpleado(null);
    setDisponibilidad(null);
    reset();
  }

  function abrirCrear() {
    setCitaEditando(null);
    setAgendaEmpleado(null);
    setDisponibilidad(null);
    reset({
      clienteId: "",
      servicioId: "",
      empleadoId: "",
      fecha: "",
      horaInicio: "",
      observaciones: "",
      adicionalIds: [],
    });
    setModal(true);
  }

  function abrirEditar(citaAEditar) {
    setModalDetalles(false);
    setCitaEditando(citaAEditar);
    reset({
      clienteId: citaAEditar.clienteId,
      servicioId: citaAEditar.servicioId,
      empleadoId: citaAEditar.empleadoId,
      fecha: citaAEditar.fecha?.slice(0, 10),
      horaInicio: citaAEditar.horaInicio,
      observaciones: citaAEditar.observaciones || "",
      adicionalIds: citaAEditar.adicionales?.map((a) => String(a.id)) ?? [],
    });
    setModal(true);
  }

  async function onSubmit(data) {
    setErrorGeneral(null);
    if (disponibilidad && disponibilidad.disponible === false) {
      setErrorGeneral(disponibilidad.motivo || "El empleado no está disponible en ese horario");
      return;
    }
    setEnviando(true);
    try {
      const estadoPendiente = estados.find((e) => e.nombre === "Pendiente");

      const citaData = {
        clienteId: Number(data.clienteId),
        empleadoId: Number(data.empleadoId),
        servicioId: Number(data.servicioId),
        fecha: data.fecha,
        horaInicio: data.horaInicio,
        horaFin,
        duracionMinutos,
        precioServicio,
        costoAdicionales,
        costoTotal,
        observaciones: data.observaciones?.trim() || null,
        adicionalIds: (data.adicionalIds || []).map(Number),
      };

      if (citaEditando) {
        await updateCita(citaEditando.id, citaData);
      } else {
        await CreateCita({
          ...citaData,
          estadoCitaId: estadoPendiente?.id,
          creadoPorUsuarioId: usuario.id,
        });
      }

      await cargarCitas();
      cerrarModal();
    } catch (error) {
      setErrorGeneral(error.message || "Ocurrió un error al guardar la cita");
    } finally {
      setEnviando(false);
    }
  }

  function verDetalles(citaSeleccionada) {
    setCita(citaSeleccionada);
    setModalDetalles(true);
  }

  async function handleCambiarEstado(nuevoEstadoId) {
    try {
      await cambiarEstadoCita(cita.id, { estadoCitaId: Number(nuevoEstadoId) });
      await cargarCitas();
      setModalDetalles(false);
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado");
    }
  }

  async function handleCancelar() {
    const motivo = window.prompt("Motivo de la cancelación:");
    if (!motivo) return;
    try {
      await cancelarCita(cita.id, { motivoCancelacion: motivo });
      await cargarCitas();
      setModalDetalles(false);
    } catch (error) {
      alert(error.message || "No se pudo cancelar la cita");
    }
  }

  const inputClass =
    "w-full px-3 py-2 bg-slate-900/80 border border-cyan-500/30 text-white rounded-lg " +
    "focus:outline-none focus:border-cyan-400 text-sm font-mono placeholder:text-gray-500";
  const labelClass = "block text-xs font-mono uppercase tracking-wide text-cyan-300 mb-1";
  const botonNeon =
    "rounded-md px-5 py-2 uppercase tracking-wide text-sm bg-black/70 border border-cyan-500/50 " +
    "text-cyan-300 transition-all duration-300 cursor-pointer hover:border-fuchsia-500/70 " +
    "hover:text-fuchsia-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]";

  function ordenarPor(columna) {
    if (ordenColumna === columna) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenColumna(columna);
      setOrdenAsc(true);
    }
  }

  const citasOrdenadas = [...citas].sort((a, b) => {
    let valorA, valorB;
    if (ordenColumna === "fecha") {
      valorA = `${a.fecha?.slice(0, 10)} ${a.horaInicio}`;
      valorB = `${b.fecha?.slice(0, 10)} ${b.horaInicio}`;
    } else if (ordenColumna === "cliente") {
      valorA = a.cliente?.nombre || "";
      valorB = b.cliente?.nombre || "";
    } else if (ordenColumna === "servicio") {
      valorA = a.servicio?.nombre || "";
      valorB = b.servicio?.nombre || "";
    } else {
      valorA = a.estadoCita?.nombre || "";
      valorB = b.estadoCita?.nombre || "";
    }
    if (valorA < valorB) return ordenAsc ? -1 : 1;
    if (valorA > valorB) return ordenAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="relative w-full min-h-screen bg-black text-gray-200 font-mono p-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="border-b border-cyan-500/30 pb-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Citas
          </h1>
          {esStaff && (
            <button onClick={abrirCrear} className={botonNeon}>+ Nueva Cita</button>
          )}
        </header>

        <Table
          columns={[
            { key: "fecha", label: "Fecha", sortable: true, render: (item) => item.fecha?.slice(0, 10) },
            { key: "hora", label: "Hora", render: (item) => `${item.horaInicio} - ${item.horaFin}` },
            { key: "cliente", label: "Cliente", sortable: true, render: (item) => `${item.cliente?.nombre} ${item.cliente?.primerApellido}` },
            { key: "servicio", label: "Servicio", sortable: true, render: (item) => item.servicio?.nombre },
            { key: "estado", label: "Estado", sortable: true, render: (item) => <EstadoBadge nombre={item.estadoCita?.nombre} /> },
          ]}
          data={citasOrdenadas}
          onRowClick={verDetalles}
          sortColumn={ordenColumna}
          sortAsc={ordenAsc}
          onSort={ordenarPor}
          emptyMessage="Sin citas registradas"
          minWidth="600px"
        />
      </div>

      {/* Modal ver Detalle */}
      {modalDetalles && cita && (
        <Modal onClose={() => setModalDetalles(false)}>
          <h3 className="text-xl font-bold uppercase text-cyan-300">{cita.servicio?.nombre}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {cita.fecha?.slice(0, 10)} · {cita.horaInicio} - {cita.horaFin}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Cliente</p>
          <p className="text-sm text-gray-300">{cita.cliente?.nombre} {cita.cliente?.primerApellido}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Encargado</p>
          <p className="text-sm text-gray-300">
            {cita.empleado?.usuario?.nombre} {cita.empleado?.usuario?.primerApellido}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Adicionales</p>
          <p className="text-sm text-gray-300">
            {cita.adicionales?.map((a) => a.nombre).join(", ") || "Ninguno"}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Costo total</p>
          <p className="text-sm text-gray-300">${cita.costoTotal}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Observaciones</p>
          <p className="text-sm text-gray-300">{cita.observaciones || "Sin observaciones"}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Estado</p>
          <EstadoBadge nombre={cita.estadoCita?.nombre} />

          <div className="flex flex-wrap gap-2 mt-4">
            {esStaff && cita.estadoCita?.permiteEdicion && (
              <button onClick={() => abrirEditar(cita)} className="text-xs px-3 py-1 border border-cyan-400/50 rounded text-cyan-300 hover:bg-cyan-500/20">
                Editar
              </button>
            )}

            {esStaff && (
              <select
                defaultValue=""
                onChange={(e) => e.target.value && handleCambiarEstado(e.target.value)}
                className="text-xs px-2 py-1 bg-slate-900/80 border border-cyan-400/50 rounded text-cyan-300"
              >
                <option value="">Cambiar estado...</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            )}

            {(esStaff || cita.estadoCita?.permiteCancelacionCliente) && cita.estadoCita?.nombre !== "Cancelada" && cita.estadoCita?.nombre !== "Finalizada" && (
              <button onClick={handleCancelar} className="text-xs px-3 py-1 border border-fuchsia-400/50 rounded text-fuchsia-300 hover:bg-fuchsia-500/20">
                Cancelar cita
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Modal Crear/Editar */}
      {modal && (
        <Modal onClose={cerrarModal} maxWidth="max-w-md" maxHeight="max-h-[90vh]" dark>
          <h2 className="text-sm uppercase text-fuchsia-300 mb-4">
            {citaEditando ? "Editar Cita" : "Nueva Cita"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Cliente *</label>
              <select className={inputClass} {...register("clienteId", { required: "Selecciona un cliente" })}>
                <option value="">-- Selecciona --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.primerApellido}</option>
                ))}
              </select>
              {errors.clienteId && <span className="text-xs text-fuchsia-400">{errors.clienteId.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Juego *</label>
              <select className={inputClass} {...register("servicioId", { required: "Selecciona un juego" })}>
                <option value="">-- Selecciona --</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre} (${s.precioBase} / {s.duracionMinutos} min)</option>
                ))}
              </select>
              {errors.servicioId && <span className="text-xs text-fuchsia-400">{errors.servicioId.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Encargado *</label>
              <select className={inputClass} {...register("empleadoId", { required: "Selecciona un encargado" })}>
                <option value="">-- Selecciona --</option>
                {empleadosServicio.map((e) => (
                  <option key={e.id} value={e.id}>{e.usuario?.nombre} {e.usuario?.primerApellido}</option>
                ))}
              </select>
              {errors.empleadoId && <span className="text-xs text-fuchsia-400">{errors.empleadoId.message}</span>}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass}>Fecha *</label>
                <input type="date" min={hoy} className={inputClass} {...register("fecha", { required: "Obligatorio" })} />
                {errors.fecha && <span className="text-xs text-fuchsia-400">{errors.fecha.message}</span>}
              </div>
              <div className="flex-1">
                <label className={labelClass}>Hora inicio *</label>
                <input type="time" className={inputClass} {...register("horaInicio", { required: "Obligatorio" })} />
                {errors.horaInicio && <span className="text-xs text-fuchsia-400">{errors.horaInicio.message}</span>}
              </div>
            </div>

            {agendaEmpleado && (
              <div className="text-xs text-gray-400 border border-cyan-500/20 rounded-lg p-3 space-y-2 bg-slate-900/60">
                <p className="uppercase text-fuchsia-300">Agenda del empleado ese día</p>
                {agendaEmpleado.citas?.length ? (
                  agendaEmpleado.citas
                    .filter((c) => c.estadoCita?.nombre !== "Cancelada")
                    .map((c) => (
                      <p key={c.id}>{c.horaInicio} - {c.horaFin} · {c.servicio?.nombre} ({c.estadoCita?.nombre})</p>
                    ))
                ) : (
                  <p>Sin citas registradas ese día</p>
                )}
                <p className="uppercase text-fuchsia-300 pt-1">Restricciones ese día</p>
                {agendaEmpleado.restricciones?.length ? (
                  agendaEmpleado.restricciones.map((r) => (
                    <p key={r.id}>{r.todoElDia ? "Todo el día" : `${r.horaInicio} - ${r.horaFin}`} · {r.tipoRestriccion?.nombre}</p>
                  ))
                ) : (
                  <p>Sin restricciones ese día</p>
                )}
              </div>
            )}

            {(consultandoDisponibilidad || disponibilidad) && (
              <p className={`text-xs ${disponibilidad?.disponible === false ? "text-fuchsia-400" : "text-emerald-400"}`}>
                {consultandoDisponibilidad
                  ? "Consultando disponibilidad..."
                  : disponibilidad?.disponible
                    ? "Horario disponible"
                    : disponibilidad?.motivo || "Horario no disponible"}
              </p>
            )}

            {adicionales.length > 0 && (
              <div>
                <label className={labelClass}>Adicionales</label>
                <div className="border border-cyan-500/30 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1 bg-slate-900/60">
                  {adicionales.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input type="checkbox" value={a.id} {...register("adicionalIds")} className="accent-cyan-400" />
                      {a.nombre} (${a.precio})
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Observaciones</label>
              <input className={inputClass} {...register("observaciones")} />
            </div>

            <div className="text-xs text-gray-400 border-t border-cyan-500/20 pt-3 space-y-1">
              <p>Duración total: {duracionMinutos || 0} minutos</p>
              <p>Hora fin: {horaFin || "--:--"}</p>
              <p>Costo total: ${costoTotal}</p>
            </div>

            {errorGeneral && <p className="text-fuchsia-400 text-sm">{errorGeneral}</p>}

            <button type="submit" disabled={enviando || disponibilidad?.disponible === false} className={botonNeon}>
              {enviando ? "Guardando..." : citaEditando ? "Guardar Cambios" : "Crear Cita"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
