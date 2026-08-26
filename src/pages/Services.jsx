import { useState, useEffect } from "react";
import { ListAllService, CreateService, getEspecialidad, uploadImagen, setState, updateService } from "/src/services/Servicios";
import { Modal } from "/src/components/Modal";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { API_URL } from "/src/services/api";
import { useAuth } from "/src/services/auth/useAuth";

export function Service() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol?.nombre === "Administrador";
  const [elementos, setElementos] = useState([]);
  const [modal, setModal] = useState(false);
  const [especialidad, setEspecialidad] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [servicio, setServicio] = useState(null);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [orden, setOrden] = useState("nombre");

  // Cerrar Modal de crear/editar
  function cerrarModal() {
    setModal(false);
    setServicioEditando(null);
    setImagenPreview(null);
    reset();
  }

  function cerrarModalDetalles() {
    setModalDetalles(false);
  }

  // Validar y cargar imagen
  function handleImagenChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImagenPreview(URL.createObjectURL(file));
  }

  // Solicitud al Servidor de los servicios y especialidades
  useEffect(() => {
    const fetchServices = async () => {
      const data = await ListAllService();
      const data2 = await getEspecialidad();
      setElementos(data.data);
      setEspecialidad(data2.data);
    };
    fetchServices();
  }, []);

  // Abrir el modal para crear
  function abrirCrear() {
    setServicioEditando(null);
    reset();
    setImagenPreview(null);
    setModal(true);
  }

  // Abrir el modal para editar 
  function abrirEditar(servicioAEditar) {
    setModalDetalles(false);
    setServicioEditando(servicioAEditar);
    reset({
      nombre: servicioAEditar.nombre,
      descripcion: servicioAEditar.descripcion,
      precioBase: servicioAEditar.precioBase,
      duracion_minutos: servicioAEditar.duracionMinutos,
      especialidadId: servicioAEditar.especialidadId,
    });
    setImagenPreview(`${API_URL}/images/download/${servicioAEditar.imagen}`);
    setModal(true);
  }

  // Método para Crear o actualizar servicios
  async function onSubmit(data) {
    setErrorGeneral(null);
    setEnviando(true);
    try {
      let nombreImagen = servicioEditando?.imagen ?? null;

      const imagenFile = data.imagen?.[0];
      if (imagenFile) {
        const { fileName } = await uploadImagen(imagenFile);
        nombreImagen = fileName;
      }

      const servicioData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioBase: Number(data.precioBase),
        duracionMinutos: Number(data.duracion_minutos),
        especialidadId: Number(data.especialidadId),
        imagen: nombreImagen,
      };

      if (servicioEditando) {
        await updateService(servicioEditando.id, servicioData);
      } else {
        await CreateService(undefined, servicioData);
      }

      const actualizados = await ListAllService();
      setElementos(actualizados.data);
      reset();
      cerrarModal();
    } catch (error) {
      setErrorGeneral(error.message || "Ocurrió un error al guardar el servicio");
    } finally {
      setEnviando(false);
    }
  }

  // Abrir modal para ver los detalles
  function verDetalles(servicioSeleccionado) {
    setServicio(servicioSeleccionado);
    setModalDetalles(true);
  }

  // Activar o desactivar un servicio
  async function activarDesactivar(servicio) {
  const jsnEstado = {
    activo: true
  }
  if (servicio.activo === true) {
    jsnEstado.activo = false
  } else {
    jsnEstado.activo = true
  }
try {
    await setState(undefined,servicio.id, jsnEstado)
    setServicio((prev) => ({ ...prev, activo: jsnEstado.activo }));
    setElementos((prev) =>
        prev.map((el) =>
          el.id === servicio.id ? { ...el, activo: jsnEstado.activo } : el
        )
      );
  } catch (error) {
    alert(error.message || "No se pudo cambiar el estado del servicio");
  }
}

  const elementosOrdenados = [...elementos].sort((a, b) => {
    if (orden === "precio") return Number(a.precioBase) - Number(b.precioBase);
    if (orden === "duracion") return Number(a.duracionMinutos) - Number(b.duracionMinutos);
    return (a.nombre || "").localeCompare(b.nombre || "");
  });

  return (
    <section className="p-6">
      {/* Botón para abrir el modal */}
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
            Crear Servicio
          </button>
        )}

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="relative top-8 left-4 sm:left-33 mb-8 px-3 py-2 bg-slate-900/80 border border-cyan-500/30 text-white rounded text-xs font-mono uppercase"
        >
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio">Ordenar por precio</option>
          <option value="duracion">Ordenar por duración</option>
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
            className="relative min-h-[300px] h-[80vh] sm:h-[600px] min-w-[300px] max-w-[800px] w-full bg-slate-900 rounded-lg overflow-hidden border border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-y-auto"
          >
           
            {esAdmin && (
              <button
                onClick={() => abrirEditar(servicio)}
                className="absolute top-3 left-3 z-30 text-fuchsia-300 bg-black/60 hover:bg-fuchsia-600 hover:text-white px-3 py-1 rounded text-xs font-mono uppercase tracking-wide transition-colors"
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
            <img
              className="absolute inset-0 w-full h-full object-cover brightness-75"
              src={`${API_URL}/images/download/${servicio.imagen}`}
              alt={servicio.nombre}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative z-20 flex flex-col justify-end h-full p-6 font-mono">
              <h3 className="text-xl font-bold uppercase tracking-wide text-cyan-300">
                {servicio.nombre}
              </h3>
              <p className="text-sm text-gray-300 mt-2 max-w-lg leading-relaxed">
                Descripcion: {servicio.descripcion}
              </p>
              <div className="flex">
                <span className="mx-2 self-start mt-4 text-sm px-3 py-1 border border-cyan-400/50 text-cyan-300 rounded bg-black/40">
                  Precio: ${servicio.precioBase}
                </span>
                <span className="mx-2 self-start mt-4 text-sm px-3 py-1 border border-cyan-400/50 text-cyan-300 rounded bg-black/40">
                  {servicio.duracionMinutos} minutos
                </span>
                {esAdmin ? (
                  <button
                    onClick={() => activarDesactivar(servicio)}
                    className="bg-cyan-400/50 text-white hover:bg-white/80 hover:text-blue-700 mx-2 self-start mt-4 text-sm px-3 py-1 border border-cyan-400/50 rounded bg-black/40 cursor-pointer transition-colors"
                  >
                    {servicio.activo === true ? "Activo" : "Desactivado"}
                  </button>
                ) : (
                  <span className="mx-2 self-start mt-4 text-sm px-3 py-1 border border-cyan-400/50 text-cyan-300 rounded bg-black/40">
                    {servicio.activo === true ? "Activo" : "Desactivado"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crear tarjetas de servicios */}
      <div className="w-full sm:w-[85vw] relative top-10 min-h-[85vh] h-auto bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(150px,auto)] gap-6 lg:gap-14 p-4 m-auto">
        {elementosOrdenados.map((elementos) => (
          <div
            onClick={() => verDetalles(elementos)}
            key={elementos.id}
            className="group relative overflow-hidden h-[300px] rounded-lg border border-cyan-500
             transition-all duration-300 cursor-pointer
             hover:border-fuchsia-500 hover:scale-110
             hover:shadow-[0_10px_20px_rgba(217,70,239,0.35)]"
          >
            <img
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300
               brightness-50 group-hover:brightness-130"
              src={`${API_URL}/images/download/${elementos.imagen}`}
              alt={elementos.nombre}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/100 to-black/10" />

            <div className="relative z-10 flex flex-col justify-end h-full p-4 font-mono">
              <h3 className="text-base uppercase tracking-wide text-cyan-300 group-hover:text-fuchsia-300 transition-colors duration-300">
                {elementos.nombre}
              </h3>
              <p className="text-xs text-gray-300 mt-1">{elementos.descripcion}</p>
              <span className="self-start mt-2 text-xs px-2 py-1 border border-cyan-400/50 text-cyan-300 group-hover:border-fuchsia-400/50 group-hover:text-fuchsia-300 transition-colors duration-300">
                ${elementos.precioBase}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear/editar el servicio */}
      {modal && (
        <Modal onClose={cerrarModal} maxWidth="max-w-md" maxHeight="max-h-[90vh]">
          <h2 className="text-sm uppercase text-fuchsia-300 mb-4">
            {servicioEditando ? "Editar Servicio" : "Crear Servicio"}
          </h2>

          <div className="relative pt-2">
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
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                })}
              />
              {errors.descripcion && <span className="text-red-400 text-xs mb-2">{errors.descripcion.message}</span>}

              <Label required>Precio Base</Label>
              <input
                type="number"
                placeholder="32000"
                className="w-full border border-cyan-500/30 bg-slate-900/80 text-white rounded px-3 py-2 mt-1 mb-1 focus:outline-none focus:border-cyan-400"
                {...register("precioBase", {
                  required: "El precio es obligatorio",
                  min: { value: 1, message: "Debe ser mayor a 0" },
                })}
              />
              {errors.precioBase && <span className="text-red-400 text-xs mb-2">{errors.precioBase.message}</span>}

              <Label required>Tiempo duración (minutos)</Label>
              <input
                placeholder="60"
                className="w-full border border-cyan-500/30 bg-slate-900/80 text-white rounded px-3 py-2 mt-1 mb-1 focus:outline-none focus:border-cyan-400"
                {...register("duracion_minutos", {
                  required: "La duración es obligatoria",
                })}
              />
              {errors.duracion_minutos && <span className="text-red-400 text-xs mb-2">{errors.duracion_minutos.message}</span>}

              <Label required htmlFor="especialidadId">Selecciona la especialidad:</Label>
              <select
                id="especialidadId"
                className="mb-1 mt-4 p-2.5 bg-slate-900/80 border border-cyan-500/30 text-white rounded"
                {...register("especialidadId", { required: "Selecciona una especialidad" })}
              >
                <option value="">-- Selecciona --</option>
                {especialidad.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
              {errors.especialidadId && <span className="text-red-400 text-xs mb-2">{errors.especialidadId.message}</span>}

              <Label required={!servicioEditando}>Imagen del servicio</Label>
              <input
                type="file"
                accept="image/*"
                className="w-full border border-cyan-500/30 bg-slate-900/80 text-white rounded px-3 py-2 mt-1 mb-2 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-cyan-500 file:text-white file:cursor-pointer cursor-pointer"
                {...register("imagen", {
                  required: servicioEditando ? false : "Selecciona una imagen",
                  onChange: handleImagenChange,
                })}
              />
              {errors.imagen && <span className="text-red-400 text-xs mb-2">{errors.imagen.message}</span>}

              {imagenPreview && (
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="w-full h-40 object-cover rounded-lg border border-cyan-500/30 mb-4"
                />
              )}

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
                {enviando ? "Guardando..." : servicioEditando ? "Guardar Cambios" : "Crear Servicio"}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </section>
  );
}