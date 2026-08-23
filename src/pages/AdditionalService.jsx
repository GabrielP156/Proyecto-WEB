import { useState, useEffect } from "react";
import {
  ListAllServiceAdicional,
  CreateServiceAdicional,
  setStateAdicional,
  updateServiceAdicional,
} from "/src/services/additionalService.js";
import { AuthCard } from "/src/components/AuthCard";
import { Label } from "/src/components/Label";
import { useForm } from "react-hook-form";
import { useAuth } from "/src/services/auth/useAuth";

export function Aditional() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol?.nombre === "Administrador";
  const [elementos, setElementos] = useState([]);
  const [modal, setModal] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [servicio, setServicio] = useState(null);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [orden, setOrden] = useState("nombre");

  function cerrarModal() {
    setModal(false);
    setServicioEditando(null);
    reset();
  }

  function cerrarModalDetalles() {
    setModalDetalles(false);
  }

  useEffect(() => {
    const fetchServices = async () => {
      const data = await ListAllServiceAdicional();
      setElementos(data.data);
    };
    fetchServices();
  }, []);

  function abrirCrear() {
    setServicioEditando(null);
    reset();
    setModal(true);
  }

  function abrirEditar(servicioAEditar) {
    setModalDetalles(false);
    setServicioEditando(servicioAEditar);
    reset({
      nombre: servicioAEditar.nombre,
      descripcion: servicioAEditar.descripcion,
      precio: servicioAEditar.precio,
    });
    setModal(true);
  }

  async function onSubmit(data) {
    setErrorGeneral(null);
    setEnviando(true);
    try {
      const servicioData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
      };

      if (servicioEditando) {
        await updateServiceAdicional(servicioEditando.id, servicioData);
      } else {
        await CreateServiceAdicional(servicioData);
      }

      const actualizados = await ListAllServiceAdicional();
      setElementos(actualizados.data);
      reset();
      cerrarModal();
    } catch (error) {
      setErrorGeneral(error.message || "Ocurrió un error al guardar el servicio adicional");
    } finally {
      setEnviando(false);
    }
  }

  function verDetalles(servicioSeleccionado) {
    setServicio(servicioSeleccionado);
    setModalDetalles(true);
  }

  async function activarDesactivar(servicioActual) {
    const jsnEstado = { activo: true };
    if (servicioActual.activo === true) {
      jsnEstado.activo = false;
    } else {
      jsnEstado.activo = true;
    }

    try {
      await setStateAdicional(servicioActual.id, jsnEstado);
      setServicio((prev) => ({ ...prev, activo: jsnEstado.activo }));
      setElementos((prev) =>
        prev.map((el) =>
          el.id === servicioActual.id ? { ...el, activo: jsnEstado.activo } : el
        )
      );
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado del servicio adicional");
    }
  }

  const elementosOrdenados = [...elementos].sort((a, b) => {
    if (orden === "precio") return Number(a.precio) - Number(b.precio);
    return (a.nombre || "").localeCompare(b.nombre || "");
  });

  return (
    <section className="p-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {esAdmin && (
          <button
            className="relative rounded-md top-8 left-4 sm:left-33 mb-8 px-5 py-2 font-mono uppercase tracking-wide text-sm
               bg-black/70 border border-cyan-500/50 text-cyan-300
               transition-all duration-300 cursor-pointer
               hover:border-fuchsia-500/70 hover:text-fuchsia-300
               hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
            onClick={abrirCrear}
          >
            Crear Servicio Adicional
          </button>
        )}

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="relative top-8 left-4 sm:left-33 mb-8 px-3 py-2 bg-slate-900/80 border border-cyan-500/30 text-white rounded text-xs font-mono uppercase"
        >
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio">Ordenar por precio</option>
        </select>
      </div>

      {/* Modal ver Detalle */}
      {modalDetalles && servicio && (
        <div
          onClick={cerrarModalDetalles}
          className="fixed inset-0 w-screen h-screen z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative min-h-[250px] min-w-[300px] max-w-[600px] w-full bg-slate-900 rounded-lg overflow-hidden border border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] p-6 font-mono"
          >
            {esAdmin && (
              <button
                onClick={() => abrirEditar(servicio)}
                className="absolute top-3 left-3 z-30 text-cyan-300 bg-black/60 hover:bg-cyan-600 hover:text-white px-3 py-1 rounded text-xs font-mono uppercase tracking-wide transition-colors"
              >
                Editar
              </button>
            )}
            <button
              onClick={cerrarModalDetalles}
              className="absolute top-3 right-3 z-30 text-white bg-black/60 hover:bg-fuchsia-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold uppercase tracking-wide text-cyan-300 mt-8">
              {servicio.nombre}
            </h3>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Descripcion: {servicio.descripcion}
            </p>
            <div className="flex mt-4">
              <span className="mx-2 self-start text-sm px-3 py-1 border border-cyan-400/50 text-cyan-300 rounded bg-black/40">
                Precio: ${servicio.precio}
              </span>
              {esAdmin ? (
                <button
                  onClick={() => activarDesactivar(servicio)}
                  className="bg-cyan-400/50 text-white hover:bg-white/80 hover:text-blue-700 mx-2 text-sm px-3 py-1 border border-cyan-400/50 rounded bg-black/40 cursor-pointer transition-colors"
                >
                  {servicio.activo === true ? "Activo" : "Desactivado"}
                </button>
              ) : (
                <span className="mx-2 text-sm px-3 py-1 border border-cyan-400/50 text-cyan-300 rounded bg-black/40">
                  {servicio.activo === true ? "Activo" : "Desactivado"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid de tarjetas */}
      <div className="w-full sm:w-[85vw] relative top-10 min-h-[85vh] h-auto bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(150px,auto)] gap-6 lg:gap-14 p-4 m-auto">
        {elementosOrdenados.map((elementos) => (
          <div
            onClick={() => verDetalles(elementos)}
            key={elementos.id}
            className="group relative overflow-hidden h-[180px] rounded-lg border border-cyan-500 bg-slate-900/60
             transition-all duration-300 cursor-pointer
             hover:border-fuchsia-500 hover:scale-110
             hover:shadow-[0_10px_20px_rgba(217,70,239,0.35)]"
          >
            <div className="relative z-10 flex flex-col justify-end h-full p-4 font-mono">
              <h3 className="text-base uppercase tracking-wide text-cyan-300 group-hover:text-fuchsia-300 transition-colors duration-300">
                {elementos.nombre}
              </h3>
              <p className="text-xs text-gray-300 mt-1">{elementos.descripcion}</p>
              <span className="self-start mt-2 text-xs px-2 py-1 border border-cyan-400/50 text-cyan-300 group-hover:border-fuchsia-400/50 group-hover:text-fuchsia-300 transition-colors duration-300">
                ${elementos.precio}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear/editar */}
      {modal && (
        <AuthCard
          className="-top-18 left-0 absolute h-screen w-screen bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
          title={servicioEditando ? "Editar Servicio Adicional" : "Crear Servicio Adicional"}
          onClick={cerrarModal}
        >
          <div className="relative pt-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
            >
              ✕
            </button>

            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <Label required>Nombre</Label>
              <input
                placeholder="Nombre"
                className="w-full border border-cyan-500/30 bg-slate-900/80 text-white rounded px-3 py-2 mt-1 mb-1 focus:outline-none focus:border-cyan-400"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
              />
              {errors.nombre && <span className="text-red-400 text-xs mb-2">{errors.nombre.message}</span>}

              <Label required>Descripción</Label>
              <input
                placeholder="Descripción"
                className="w-full border border-cyan-500/30 bg-slate-900/80 text-white rounded px-3 py-2 mt-1 mb-1 focus:outline-none focus:border-cyan-400"
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                })}
              />
              {errors.descripcion && <span className="text-red-400 text-xs mb-2">{errors.descripcion.message}</span>}

              <Label required>Precio</Label>
              <input
                type="number"
                placeholder="3000"
                className="w-full border border-cyan-500/30 bg-slate-900/80 text-white rounded px-3 py-2 mt-1 mb-1 focus:outline-none focus:border-cyan-400"
                {...register("precio", {
                  required: "El precio es obligatorio",
                  min: { value: 0, message: "Debe ser mayor o igual a 0" },
                })}
              />
              {errors.precio && <span className="text-red-400 text-xs mb-2">{errors.precio.message}</span>}

              {errorGeneral && (
                <p className="text-red-400 text-sm mb-3">{errorGeneral}</p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="rounded-md mb-8 px-5 py-2 font-mono uppercase tracking-wide text-sm
             bg-black/70 border border-cyan-500/50 text-cyan-300
             transition-all duration-300 cursor-pointer
             hover:border-fuchsia-500/70 hover:text-fuchsia-300
             hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
              >
                {enviando ? "Guardando..." : servicioEditando ? "Guardar Cambios" : "Crear"}
              </button>
            </form>
          </div>
        </AuthCard>
      )}
    </section>
  );
}