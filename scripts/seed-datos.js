import { readFile } from "fs/promises";
import path from "path";

const API_URL = "http://localhost:3000";
const ADMIN_CORREO = "admin@citas.com";
const ADMIN_PASSWORD = "Admin12345";

async function login() {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: ADMIN_CORREO, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo iniciar sesión");
  return data.data.token;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function get(token, endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Error GET ${endpoint}`);
  return data.data;
}

async function post(token, endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

async function patch(token, endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

const MIME_POR_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function uploadImage(token, filePath) {
  const buffer = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const blob = new Blob([buffer], { type: MIME_POR_EXTENSION[extension] || "image/png" });
  const formData = new FormData();
  formData.append("image", blob, path.basename(filePath));
  const res = await fetch(`${API_URL}/images/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo subir la imagen");
  return data.fileName;
}

function reportar(nombre, resultado) {
  if (resultado.ok) {
    console.log(`✔ ${nombre}`);
  } else {
    console.log(`✘ ${nombre}: ${resultado.data.message || JSON.stringify(resultado.data)}`);
  }
  return resultado;
}

async function main() {
  console.log("Iniciando sesión como admin...");
  const token = await login();

  // ---------- Servicios ----------
  console.log("\n--- Servicios ---");
  const especialidades = await get(token, "/especialidades");
  const especialidadPool = especialidades.find((e) => e.nombre === "Bolos y Pool") || especialidades[0];
  const especialidadVideojuegos = especialidades.find((e) => e.nombre === "Videojuegos") || especialidades[0];

  const imagenPool = await uploadImage(token, "src/assets/image.png");
  const imagenPlaystation = await uploadImage(token, "src/assets/arcade_neon_machine (1).png");

  const nuevosServicios = [
    {
      nombre: "pool",
      descripcion: "mesa de pool para minimo 2 personas",
      precioBase: 15000,
      duracionMinutos: 90,
      especialidadId: especialidadPool.id,
      imagen: imagenPool,
    },
    {
      nombre: "playstation",
      descripcion: "estacion de playstation para minimo 2 personas",
      precioBase: 10000,
      duracionMinutos: 45,
      especialidadId: especialidadVideojuegos.id,
      imagen: imagenPlaystation,
    },
  ];

  for (const servicio of nuevosServicios) {
    reportar(`Servicio ${servicio.nombre}`, await post(token, "/servicios", servicio));
  }

  const servicios = await get(token, "/servicios");

  // ---------- Servicios adicionales ----------
  console.log("\n--- Servicios adicionales ---");
  const nuevosAdicionales = [
    { nombre: "alquiler de zapatos", descripcion: "zapatos especiales para bolos", precio: 2500 },
    { nombre: "combo cumpleanos", descripcion: "combo especial para celebraciones", precio: 15000 },
    { nombre: "snack combo", descripcion: "papas, nachos y bebida", precio: 4500 },
    { nombre: "hora feliz", descripcion: "descuento en bebidas por una hora", precio: 3000 },
    { nombre: "fotografia del evento", descripcion: "fotografo durante la sesion", precio: 8000 },
    { nombre: "decoracion tematica", descripcion: "decoracion de la mesa o carril", precio: 6000 },
    { nombre: "torneo privado", descripcion: "organizacion de torneo privado", precio: 20000 },
  ];

  for (const adicional of nuevosAdicionales) {
    reportar(`Adicional ${adicional.nombre}`, await post(token, "/servicios-adicionales", adicional));
  }

  // ---------- Empleados ----------
  console.log("\n--- Empleados ---");
  const usuariosEmpleado = await get(token, "/usuarios?rol=Empleado");
  const especialidadGeneral = especialidades.find((e) => e.nombre === "General") || especialidades[0];
  const servicioIds = servicios.map((s) => s.id);

  const codigos = ["EMP-CAR", "EMP-DIA", "EMP-LUI"];
  const empleadosCreados = [];
  for (let i = 0; i < usuariosEmpleado.length; i++) {
    const usuario = usuariosEmpleado[i];
    const resultado = await post(token, "/empleados", {
      usuarioId: usuario.id,
      especialidadId: especialidadGeneral.id,
      codigoEmpleado: codigos[i] || `EMP-${usuario.id}`,
      descripcion: `Encargado ${usuario.nombre}`,
      servicioIds,
    });
    reportar(`Empleado ${usuario.nombre}`, resultado);
    if (resultado.ok) empleadosCreados.push(resultado.data.data);
  }

  const empleados = empleadosCreados.length ? empleadosCreados : await get(token, "/empleados");

  // ---------- Restricciones ----------
  console.log("\n--- Restricciones ---");
  const tipos = await get(token, "/tipos-restriccion-horario");
  const tipoGeneral = tipos.find((t) => t.nombre === "General del establecimiento");
  const tipoEmpleado = tipos.find((t) => t.nombre === "Específica de empleado");
  const tipoParcial = tipos.find((t) => t.nombre === "Parcial por horas");
  const tipoDiaCompleto = tipos.find((t) => t.nombre === "Día completo");

  const restricciones = [
    {
      tipoRestriccionId: tipoDiaCompleto.id,
      empleadoId: null,
      fecha: "2026-09-15",
      horaInicio: null,
      horaFin: null,
      todoElDia: true,
      motivo: "Cierre por feriado nacional",
    },
    {
      tipoRestriccionId: tipoGeneral.id,
      empleadoId: null,
      fecha: "2026-09-05",
      horaInicio: "14:00",
      horaFin: "16:00",
      todoElDia: false,
      motivo: "Mantenimiento general de mesas de pool",
    },
    {
      tipoRestriccionId: tipoParcial.id,
      empleadoId: empleados[0]?.id ?? null,
      fecha: "2026-08-28",
      horaInicio: "09:00",
      horaFin: "11:00",
      todoElDia: false,
      motivo: "Capacitacion interna del encargado",
    },
    {
      tipoRestriccionId: tipoParcial.id,
      empleadoId: empleados[1]?.id ?? null,
      fecha: "2026-08-29",
      horaInicio: "18:00",
      horaFin: "20:00",
      todoElDia: false,
      motivo: "Cita medica del encargado",
    },
    {
      tipoRestriccionId: tipoEmpleado.id,
      empleadoId: empleados[2]?.id ?? null,
      fecha: "2026-09-01",
      horaInicio: null,
      horaFin: null,
      todoElDia: true,
      motivo: "Vacaciones programadas",
    },
  ];

  for (const restriccion of restricciones) {
    reportar(`Restriccion ${restriccion.motivo}`, await post(token, "/restricciones-horario", restriccion));
  }

  // ---------- Citas ----------
  console.log("\n--- Citas ---");
  const clientes = await get(token, "/usuarios?rol=Cliente");
  const estados = await get(token, "/estados-cita");
  const estadoPendiente = estados.find((e) => e.nombre === "Pendiente");
  const estadoConfirmada = estados.find((e) => e.nombre === "Confirmada");
  const estadoFinalizada = estados.find((e) => e.nombre === "Finalizada");
  const estadoCancelada = estados.find((e) => e.nombre === "Cancelada");

  function sumarMinutos(horaInicio, minutos) {
    const [h, m] = horaInicio.split(":").map(Number);
    const total = h * 60 + m + minutos;
    const horaFinal = Math.floor(total / 60) % 24;
    const minutoFinal = total % 60;
    return `${String(horaFinal).padStart(2, "0")}:${String(minutoFinal).padStart(2, "0")}`;
  }

  const servicioBolos = servicios.find((s) => s.nombre === "bolos");
  const servicioFutbolin = servicios.find((s) => s.nombre === "futbolin");
  const servicioPool = servicios.find((s) => s.nombre === "pool");
  const servicioPlaystation = servicios.find((s) => s.nombre === "playstation");

  const planCitas = [
    { fecha: "2026-08-24", hora: "11:00", servicio: servicioBolos, empleadoIdx: 0, estadoDestino: estadoPendiente },
    { fecha: "2026-08-24", hora: "15:00", servicio: servicioFutbolin, empleadoIdx: 1, estadoDestino: estadoPendiente },
    { fecha: "2026-08-25", hora: "10:00", servicio: servicioPool, empleadoIdx: 2, estadoDestino: estadoPendiente },
    { fecha: "2026-08-25", hora: "17:00", servicio: servicioPlaystation, empleadoIdx: 0, estadoDestino: estadoPendiente },
    { fecha: "2026-08-26", hora: "11:00", servicio: servicioBolos, empleadoIdx: 1, estadoDestino: estadoConfirmada },
    { fecha: "2026-08-26", hora: "16:00", servicio: servicioFutbolin, empleadoIdx: 2, estadoDestino: estadoConfirmada },
    { fecha: "2026-08-27", hora: "10:00", servicio: servicioPool, empleadoIdx: 0, estadoDestino: estadoConfirmada },
    { fecha: "2026-08-27", hora: "18:00", servicio: servicioPlaystation, empleadoIdx: 1, estadoDestino: estadoConfirmada },
    { fecha: "2026-08-23", hora: "11:00", servicio: servicioBolos, empleadoIdx: 2, estadoDestino: estadoFinalizada },
    { fecha: "2026-08-23", hora: "14:00", servicio: servicioFutbolin, empleadoIdx: 0, estadoDestino: estadoFinalizada },
    { fecha: "2026-08-23", hora: "16:00", servicio: servicioPool, empleadoIdx: 1, estadoDestino: estadoFinalizada },
    { fecha: "2026-08-28", hora: "11:00", servicio: servicioBolos, empleadoIdx: 2, estadoDestino: estadoCancelada },
    { fecha: "2026-08-28", hora: "15:00", servicio: servicioPlaystation, empleadoIdx: 0, estadoDestino: estadoCancelada },
  ];

  for (const plan of planCitas) {
    if (!plan.servicio || !empleados[plan.empleadoIdx]) {
      console.log(`✘ Cita omitida (falta servicio o empleado)`);
      continue;
    }
    const empleado = empleados[plan.empleadoIdx];
    const cliente = clientes[plan.empleadoIdx % clientes.length];
    const horaFin = sumarMinutos(plan.hora, plan.servicio.duracionMinutos);

    const citaData = {
      clienteId: cliente.id,
      empleadoId: empleado.id,
      servicioId: plan.servicio.id,
      fecha: plan.fecha,
      horaInicio: plan.hora,
      horaFin,
      duracionMinutos: plan.servicio.duracionMinutos,
      precioServicio: Number(plan.servicio.precioBase),
      costoAdicionales: 0,
      costoTotal: Number(plan.servicio.precioBase),
      observaciones: null,
      adicionalIds: [],
      estadoCitaId: estadoPendiente.id,
      creadoPorUsuarioId: 1,
    };

    const resultado = await post(token, "/citas", citaData);
    reportar(`Cita ${plan.servicio.nombre} ${plan.fecha} ${plan.hora}`, resultado);
    if (!resultado.ok) continue;

    const citaId = resultado.data.data.id;
    if (plan.estadoDestino.nombre === "Cancelada") {
      await patch(token, `/citas/${citaId}/cancelar`, { motivoCancelacion: "Cancelada por el cliente" });
    } else if (plan.estadoDestino.id !== estadoPendiente.id) {
      await patch(token, `/citas/${citaId}/estado`, { estadoCitaId: plan.estadoDestino.id });
    }
  }

  console.log("\nListo.");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
