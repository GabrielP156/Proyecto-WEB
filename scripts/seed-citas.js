const API_URL = "http://localhost:3000";

async function login() {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: "admin@citas.com", password: "Admin12345" }),
  });
  const data = await res.json();
  return data.data.token;
}

function sumarMinutos(horaInicio, minutos) {
  const [h, m] = horaInicio.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const horaFinal = Math.floor(total / 60) % 24;
  const minutoFinal = total % 60;
  return `${String(horaFinal).padStart(2, "0")}:${String(minutoFinal).padStart(2, "0")}`;
}

async function main() {
  const token = await login();
  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const servicios = { bolos: { id: 1, precio: 20000, duracion: 60 }, futbolin: { id: 2, precio: 2000, duracion: 60 }, playstation: { id: 4, precio: 10000, duracion: 45 }, pool: { id: 3, precio: 15000, duracion: 90 } };
  const empleados = [3, 4, 5];
  const clientes = [6, 7];
  const estados = { pendiente: 1, confirmada: 2, finalizada: 4, cancelada: 5 };

  const plan = [
    { fecha: "2026-08-24", hora: "11:00", servicio: "bolos", empleado: 0, estado: "pendiente" },
    { fecha: "2026-08-24", hora: "15:00", servicio: "futbolin", empleado: 1, estado: "pendiente" },
    { fecha: "2026-08-25", hora: "10:00", servicio: "pool", empleado: 2, estado: "pendiente" },
    { fecha: "2026-08-25", hora: "17:00", servicio: "playstation", empleado: 0, estado: "pendiente" },
    { fecha: "2026-08-26", hora: "11:00", servicio: "bolos", empleado: 1, estado: "confirmada" },
    { fecha: "2026-08-26", hora: "16:00", servicio: "futbolin", empleado: 2, estado: "confirmada" },
    { fecha: "2026-08-27", hora: "10:00", servicio: "pool", empleado: 0, estado: "confirmada" },
    { fecha: "2026-08-27", hora: "18:00", servicio: "playstation", empleado: 1, estado: "confirmada" },
    { fecha: "2026-08-23", hora: "10:00", servicio: "bolos", empleado: 2, estado: "finalizada" },
    { fecha: "2026-08-23", hora: "13:00", servicio: "futbolin", empleado: 0, estado: "finalizada" },
    { fecha: "2026-08-23", hora: "15:00", servicio: "pool", empleado: 1, estado: "finalizada" },
    { fecha: "2026-08-28", hora: "11:00", servicio: "bolos", empleado: 2, estado: "cancelada" },
    { fecha: "2026-08-28", hora: "15:00", servicio: "playstation", empleado: 0, estado: "cancelada" },
  ];

  for (let i = 0; i < plan.length; i++) {
    const item = plan[i];
    const servicio = servicios[item.servicio];
    const empleadoId = empleados[item.empleado];
    const clienteId = clientes[i % clientes.length];
    const horaFin = sumarMinutos(item.hora, servicio.duracion);

    const citaData = {
      clienteId,
      empleadoId,
      servicioId: servicio.id,
      fecha: item.fecha,
      horaInicio: item.hora,
      horaFin,
      duracionMinutos: servicio.duracion,
      precioServicio: servicio.precio,
      costoAdicionales: 0,
      costoTotal: servicio.precio,
      observaciones: null,
      adicionalIds: [],
      estadoCitaId: estados.pendiente,
      creadoPorUsuarioId: 1,
    };

    const res = await fetch(`${API_URL}/citas`, { method: "POST", headers: h, body: JSON.stringify(citaData) });
    const data = await res.json();
    if (!res.ok) {
      console.log(`✘ ${item.servicio} ${item.fecha} ${item.hora}: ${data.message || JSON.stringify(data)}`);
      continue;
    }
    console.log(`✔ ${item.servicio} ${item.fecha} ${item.hora}`);

    const citaId = data.data.id;
    if (item.estado === "cancelada") {
      await fetch(`${API_URL}/citas/${citaId}/cancelar`, { method: "PATCH", headers: h, body: JSON.stringify({ motivoCancelacion: "Cancelada por el cliente" }) });
    } else if (item.estado !== "pendiente") {
      await fetch(`${API_URL}/citas/${citaId}/estado`, { method: "PATCH", headers: h, body: JSON.stringify({ estadoCitaId: estados[item.estado] }) });
    }
  }

  console.log("Listo.");
}

main().catch((error) => {
  console.error("Error:", error.message);
});
