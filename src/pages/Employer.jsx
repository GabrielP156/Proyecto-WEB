import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {getEspecialidad,ListAllEmployers,CreateEmployer,updateEmployer,setStateEmployer,getAgendaEmpleado} from "/src/services/EmployerService";
import { ListAllService } from "/src/services/Servicios";
import { useAuth } from "/src/services/auth/useAuth";
import { Table } from "/src/components/Table";
import { Modal } from "/src/components/Modal";

export default function Employer() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol?.nombre === "Administrador";
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const [modal, setModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const [modalDetalles, setModalDetalles] = useState(false);
  const [empleado, setEmpleado] = useState(null);
  const [fechaAgenda, setFechaAgenda] = useState("");
  const [agenda, setAgenda] = useState(null);
  const [ordenColumna, setOrdenColumna] = useState("usuario");
  const [ordenAsc, setOrdenAsc] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      usuarioId: "",
      especialidadId: "",
      codigoEmpleado: "",
      descripcion: "",
      servicioIds: [],
    },
  });

  useEffect(() => {
    const cargar = async () => {
      const dataEmpleados = await ListAllEmployers();
      const dataServicios = await ListAllService();
      const dataEspecialidades = await getEspecialidad();
      setEmpleados(dataEmpleados.data);
      setServicios(dataServicios.data);
      setEspecialidades(dataEspecialidades.data);
    };
    cargar();
  }, []);

  function cerrarModal() {
    setModal(false);
    setEmpleadoEditando(null);
    reset();
  }

  function abrirCrear() {
    setEmpleadoEditando(null);
    reset();
    setModal(true);
  }

  function abrirEditar(emp) {
    setModalDetalles(false);
    setEmpleadoEditando(emp);
    reset({
      usuarioId: emp.usuarioId,
      especialidadId: emp.especialidadId,
      codigoEmpleado: emp.codigoEmpleado,
      descripcion: emp.descripcion ?? "",
      servicioIds: emp.servicios?.map((s) => String(s.id)) ?? [],
    });
    setModal(true);
  }

  async function onSubmit(data) {
    setErrorGeneral(null);
    setEnviando(true);
    try {
      const empleadoData = {
        usuarioId: Number(data.usuarioId),
        especialidadId: Number(data.especialidadId),
        codigoEmpleado: data.codigoEmpleado,
        descripcion: data.descripcion?.trim() || null,
        servicioIds: data.servicioIds.map(Number),
      };

      if (empleadoEditando) {
        await updateEmployer(empleadoEditando.id, empleadoData);
      } else {
        await CreateEmployer(empleadoData);
      }

      const actualizados = await ListAllEmployers();
      setEmpleados(actualizados.data);
      reset();
      cerrarModal();
    } catch (error) {
      setErrorGeneral(error.message || "Ocurrió un error al guardar el empleado");
    } finally {
      setEnviando(false);
    }
  }

  function verDetalles(emp) {
    setEmpleado(emp);
    setModalDetalles(true);
    setAgenda(null);
    setFechaAgenda("");
  }

  async function activarDesactivar(emp) {
    const nuevoEstado = !emp.activo;
    try {
      await setStateEmployer(emp.id, { activo: nuevoEstado });
      setEmpleado((prev) => ({ ...prev, activo: nuevoEstado }));
      setEmpleados((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, activo: nuevoEstado } : e))
      );
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado");
    }
  }

  async function consultarAgenda() {
    if (!fechaAgenda) return;
    try {
      const resultado = await getAgendaEmpleado(empleado.id, fechaAgenda);
      setAgenda(resultado.data);
    } catch (error) {
      alert(error.message || "No se pudo consultar la agenda");
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

  const empleadosOrdenados = [...empleados].sort((a, b) => {
    let valorA, valorB;
    if (ordenColumna === "especialidad") {
      valorA = a.especialidad?.nombre || "";
      valorB = b.especialidad?.nombre || "";
    } else if (ordenColumna === "codigo") {
      valorA = a.codigoEmpleado || "";
      valorB = b.codigoEmpleado || "";
    } else if (ordenColumna === "estado") {
      valorA = a.activo ? 1 : 0;
      valorB = b.activo ? 1 : 0;
    } else {
      valorA = a.usuario?.nombre || "";
      valorB = b.usuario?.nombre || "";
    }
    if (valorA < valorB) return ordenAsc ? -1 : 1;
    if (valorA > valorB) return ordenAsc ? 1 : -1;
    return 0;
  });

      return (
    <div className="relative w-full min-h-screen bg-black text-gray-200 font-mono p-6 overflow-hidden">
      <div className="absolute top-[8%] left-[4%] -z-0 [animation-delay:-1s] after:content-[''] after:block after:w-28 after:h-28 after:rounded-full after:bg-pink-500 after:border-4 after:border-pink-500 after:shadow-[0_0_20px_rgba(236,72,153,0.9),0_0_40px_rgba(236,72,153,0.6)] animate-flotar1"></div>
      <div className="absolute top-[40%] right-[5%] -z-0 [animation-delay:-4s] after:content-[''] after:block after:w-24 after:h-24 after:rounded-full after:bg-accent after:border-4 after:border-accent after:shadow-[0_0_15px_var(--color-accent,#8b5cf6),0_0_20px_var(--color-accent,#8b5cf6)] animate-flotar3"></div>
      <div className="absolute bottom-[6%] left-[15%] -z-0 [animation-delay:-6s] after:content-[''] after:block after:w-32 after:h-32 after:rounded-full after:bg-[rgba(138,43,226)] after:border-4 after:border-[#8a2be2] after:shadow-[0_0_20px_rgba(138,43,226,0.8),0_0_40px_rgba(138,43,226,0.4)] animate-flotar5"></div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="border-b border-cyan-500/30 pb-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] bg-[length:200%_auto] [animation:shimmer_4s_ease-in-out_infinite]">
            Gestión Empleados
          </h1>
          {esAdmin && (
            <button onClick={abrirCrear} className={botonNeon}>+ Nuevo Empleado</button>
          )}
        </header>

        <Table
          columns={[
            { key: "usuario", label: "Usuario", sortable: true, render: (item) => `${item.usuario?.nombre} ${item.usuario?.primerApellido}` },
            { key: "especialidad", label: "Especialidad", sortable: true, render: (item) => item.especialidad?.nombre },
            { key: "codigo", label: "Código", sortable: true, render: (item) => item.codigoEmpleado },
            { key: "estado", label: "Estado", sortable: true, render: (item) => (item.activo ? "Activo" : "Desactivado") },
          ]}
          data={empleadosOrdenados}
          onRowClick={verDetalles}
          sortColumn={ordenColumna}
          sortAsc={ordenAsc}
          onSort={ordenarPor}
          emptyMessage="Sin empleados aún"
        />
      </div>

      {/* Modal ver Detalle */}
      {modalDetalles && empleado && (
        <Modal onClose={() => setModalDetalles(false)}>
          <h3 className="text-xl font-bold uppercase text-cyan-300">{empleado.usuario?.nombre} {empleado.usuario?.primerApellido}</h3>
          <p className="text-sm text-gray-400 mt-1">{empleado.codigoEmpleado} — {empleado.especialidad?.nombre}</p>

          <div className="flex gap-2 mt-4">
            {esAdmin ? (
              <>
                <button onClick={() => abrirEditar(empleado)} className="text-xs px-3 py-1 border border-cyan-400/50 rounded text-cyan-300 hover:bg-cyan-500/20">Editar</button>
                <button onClick={() => activarDesactivar(empleado)} className="text-xs px-3 py-1 border border-cyan-400/50 rounded text-cyan-300 hover:bg-cyan-500/20">
                  {empleado.activo ? "Activo" : "Desactivado"}
                </button>
              </>
            ) : (
              <span className="text-xs px-3 py-1 border border-cyan-400/50 rounded text-cyan-300">
                {empleado.activo ? "Activo" : "Desactivado"}
              </span>
            )}
          </div>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Servicios</p>
          <p className="text-sm text-gray-300">{empleado.servicios?.map((s) => s.nombre).join(", ") || "Ninguno"}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Restricciones</p>
          <p className="text-sm text-gray-300">
            {empleado.restricciones?.length ? `${empleado.restricciones.length} registradas` : "Sin restricciones"}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Agenda</p>
          <div className="flex gap-2">
            <input type="date" value={fechaAgenda} onChange={(e) => setFechaAgenda(e.target.value)} className={inputClass} />
            <button onClick={consultarAgenda} className="text-xs px-3 py-2 border border-cyan-500/50 rounded text-cyan-300 hover:bg-cyan-500/20">Ver</button>
          </div>
          {agenda && (
            <p className="text-xs text-gray-300 mt-2">
              {agenda.citas?.length ? `${agenda.citas.length} citas ese día` : "Sin citas ese día"}
            </p>
          )}
        </Modal>
      )}

      {/* Modal Crear/Editar */}
      {modal && (
        <Modal onClose={cerrarModal} maxWidth="max-w-md" maxHeight="max-h-[90vh]" dark>
          <h2 className="text-sm uppercase text-fuchsia-300 mb-4">
            {empleadoEditando ? "Editar Empleado" : "Crear Empleado"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>ID de Usuario</label>
              <input type="number" className={inputClass} {...register("usuarioId", { required: "Obligatorio" })} />
              {errors.usuarioId && <span className="text-xs text-fuchsia-400">{errors.usuarioId.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Especialidad *</label>
              <select className={inputClass} {...register("especialidadId", { required: "Selecciona una" })}>
                <option value="">-- Selecciona --</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                ))}
              </select>
              {errors.especialidadId && <span className="text-xs text-fuchsia-400">{errors.especialidadId.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Código Empleado *</label>
              <input
                placeholder="EMP-001"
                className={inputClass}
                {...register("codigoEmpleado", {
                  required: "Obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  pattern: { value: /^[a-zA-Z0-9_-]+$/, message: "Solo letras, números, guion y guion bajo" },
                })}
              />
              {errors.codigoEmpleado && <span className="text-xs text-fuchsia-400">{errors.codigoEmpleado.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Descripción</label>
              <input className={inputClass} {...register("descripcion")} />
            </div>

            <div>
              <label className={labelClass}>Servicios *</label>
              <div className="border border-cyan-500/30 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1 bg-slate-900/60">
                {servicios.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" value={s.id} {...register("servicioIds", { validate: (v) => v?.length > 0 || "Selecciona al menos uno" })} className="accent-cyan-400" />
                    {s.nombre}
                  </label>
                ))}
              </div>
              {errors.servicioIds && <span className="text-xs text-fuchsia-400">{errors.servicioIds.message}</span>}
            </div>

            {errorGeneral && <p className="text-fuchsia-400 text-sm">{errorGeneral}</p>}

            <button type="submit" disabled={enviando} className={botonNeon}>
              {enviando ? "Guardando..." : empleadoEditando ? "Guardar Cambios" : "Crear Empleado"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
