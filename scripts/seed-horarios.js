const API_URL = "http://localhost:3000";

const ADMIN_CORREO = "admin@citas.com";
const ADMIN_PASSWORD = "Admin12345";

const HORARIO_SEMANAL = {
  Lunes: { horaInicio: "10:00", horaFin: "22:00" },
  Martes: { horaInicio: "10:00", horaFin: "22:00" },
  Miércoles: { horaInicio: "10:00", horaFin: "22:00" },
  Jueves: { horaInicio: "10:00", horaFin: "22:00" },
  Viernes: { horaInicio: "10:00", horaFin: "23:00" },
  Sábado: { horaInicio: "10:00", horaFin: "23:00" },
  Domingo: { horaInicio: "11:00", horaFin: "20:00" },
};

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

async function obtenerDias(token) {
  const res = await fetch(`${API_URL}/dias-semana`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudieron obtener los días");
  return data.data;
}

async function crearHorario(token, diaSemanaId, horaInicio, horaFin) {
  const res = await fetch(`${API_URL}/horarios-atencion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ diaSemanaId, horaInicio, horaFin }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log("Iniciando sesión como admin...");
  const token = await login();

  console.log("Obteniendo catálogo de días de la semana...");
  const dias = await obtenerDias(token);

  for (const dia of dias) {
    const horario = HORARIO_SEMANAL[dia.nombre];
    if (!horario) {
      console.log(`Sin horario definido para ${dia.nombre}, se omite`);
      continue;
    }
    const resultado = await crearHorario(token, dia.id, horario.horaInicio, horario.horaFin);
    if (resultado.ok) {
      console.log(`OK - ${dia.nombre}: ${horario.horaInicio} - ${horario.horaFin} creado`);
    } else {
      console.log(`ERROR - ${dia.nombre}: ${resultado.data.message || JSON.stringify(resultado.data)}`);
    }
  }

  console.log("Listo.");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
