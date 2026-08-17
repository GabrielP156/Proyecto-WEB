import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getEspecialidad, ListAllEmployers } from "/src/services/EmployerService";

export default function Employer() {
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const cargarServicios = async () => {
      const data = await getEspecialidad();
      const listaEmpleado = await ListAllEmployers();
      setServicios(data.data);
      setEmpleados(listaEmpleado.data);
    };
    cargarServicios();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    nuevoCliente: {
      usuario: "",
      especialidadId: "",
      codigoEmpleado: "",
      descripcion: "",
      servicioIds: {},
    },
  });

  const inputClass =
    "w-full px-3 py-2 bg-slate-900/80 border border-cyan-500/30 text-white rounded-lg " +
    "focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-sm font-mono " +
    "placeholder:text-gray-500";

  const labelClass =
    "block text-xs font-mono uppercase tracking-wide text-cyan-300 mb-1";

  // Molde reutilizable para ambas tarjetas: mismo borde-glow, mismo padding, misma altura mínima
  function GlowCard({ title, children, glowFrom = "from-cyan-500", glowTo = "to-fuchsia-500" }) {
    return (
      <div className="relative group h-full">
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${glowFrom} ${glowTo} rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500`}
        />
        <div className="relative bg-black/80 p-6 rounded-lg border border-cyan-500/40 backdrop-blur-sm h-full min-h-[480px] flex flex-col">
          <h2 className="text-sm uppercase tracking-widest text-fuchsia-300 mb-4 drop-shadow-[0_0_6px_rgba(217,70,239,0.5)]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-gray-200 font-mono overflow-hidden p-6">
      {/* Orbes de luz flotando */}
      <div className="absolute top-[10%] left-[6%] -z-0 pointer-events-none w-40 h-40 rounded-full bg-pink-500/70 blur-3xl animate-pulse" />
      <div className="absolute top-[35%] right-[8%] -z-0 pointer-events-none w-52 h-52 rounded-full bg-cyan-500/50 blur-3xl [animation:pulse_5s_ease-in-out_infinite]" />
      <div className="absolute bottom-[10%] left-[30%] -z-0 pointer-events-none w-36 h-36 rounded-full bg-fuchsia-600/40 blur-3xl [animation:pulse_7s_ease-in-out_infinite]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="border-b border-cyan-500/30 pb-4">
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] bg-[length:200%_auto] [animation:shimmer_4s_ease-in-out_infinite]">
            Gestión Empleados
          </h1>
          <p className="text-sm text-gray-400 mt-1 tracking-wide uppercase">
            Interfaz de administración • Zona de Ataque
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Formulario de Registro/Edición */}
          <div className="lg:col-span-1">
            <GlowCard title="Registrar Cliente">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
                <div>
                  <label className={labelClass}>Usuario</label>
                  <input
                    type="text"
                    {...register("usuarioId", { required: "El nombre es requerido" })}
                    placeholder="nombre usuario"
                    className={inputClass}
                  />
                  {errors.nombre && (
                    <span className="text-xs text-fuchsia-400 mt-1 block">
                      {errors.nombre.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Especialidad</label>
                  <input
                    type="text"
                    {...register("especialidadId", { required: "La especilaidad es requerida" })}
                    placeholder="especialidad"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Codigo Empleado</label>
                  <input
                    type="tel"
                    {...register("codigoEmpleado", { required: "El codigo es requerido" })}
                    placeholder="cd-0000-0000"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Descripción</label>
                  <input
                    type="tel"
                    {...register("descripción", { required: "La descripcion es requerida" })}
                    placeholder="cd-0000-0000"
                    className={inputClass}
                  />
                </div>

                <div className="flex-1">
                  <label className={labelClass}>Servicios</label>
                  <div className="border border-cyan-500/30 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-slate-900/60">
                    {servicios.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 text-sm cursor-pointer text-gray-300 hover:text-cyan-300 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={s.id}
                          {...register("servicioIds")}
                          className="peer sr-only"
                        />
                        <span
                          className="w-4 h-4 flex items-center justify-center rounded-sm border border-cyan-500/50
                                     bg-slate-900 transition-all duration-200
                                     peer-checked:bg-cyan-500/20 peer-checked:border-cyan-400
                                     peer-checked:shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                        >
                          <svg
                            className="w-3 h-3 text-cyan-300 opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        {s.nombre}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 mt-auto">
                  <button
                    type="submit"
                    className="flex-1 rounded-md px-4 py-2 uppercase tracking-wide text-sm
                         bg-black/70 border border-cyan-500/50 text-cyan-300
                         transition-all duration-300 cursor-pointer
                         hover:border-fuchsia-500/70 hover:text-fuchsia-300
                         hover:shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="rounded-md px-4 py-2 uppercase tracking-wide text-sm
                         bg-black/40 border border-gray-600 text-gray-400
                         hover:border-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </GlowCard>
          </div>

          {/* Listado */}
          <div className="lg:col-span-2">
            <GlowCard title="Listado de Clientes" glowFrom="from-fuchsia-500" glowTo="to-cyan-500">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-cyan-300 uppercase text-xs border-b border-cyan-500/30">
                    <tr>
                      <th className="px-4 py-3">Usuario</th>
                      <th className="px-4 py-3">Especialidad</th>
                      <th className="px-4 py-3">codigo</th>
                      <th className="px-4 py-3">descripcion</th>
                      <th className="px-4 py-3 text-right">servicios a cargo </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                          Sin empleados registrados todavía
                        </td>
                      </tr>
                    ) : (
                      empleados.map((item) => (
                        <tr key={item.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                          <td className="px-4 py-3">{item.usuario?.nombre} {item.usuario?.primerApellido}</td>
                          <td className="px-4 py-3">{item.especialidad?.nombre}</td>
                          <td className="px-4 py-3">{item.codigoEmpleado}</td>
                          <td className="px-4 py-3">{item.descripcion}</td>
                          <td className="px-4 py-3 text-right">
                            {item.servicios?.map((s) => s.nombre).join(", ")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlowCard>
          </div>
        </main>
      </div>
    </div>
  );
}