import { get, post, put, patch } from "./api";
const parameter = "/citas";

export function ListAllCitas(endpoint = parameter) {
  return get(endpoint);
}

export function ListCitasByCliente(clienteId) {
  return get(`${parameter}/cliente/${clienteId}`);
}

export function ListCitasByEmpleado(empleadoId) {
  return get(`${parameter}/empleado/${empleadoId}`);
}

export function getCita(id) {
  return get(parameter + "/" + id);
}

export function CreateCita(cita) {
  return post(parameter, cita);
}

export function updateCita(id, cita) {
  return put(parameter + "/" + id, cita);
}

export function cambiarEstadoCita(id, estadoData) {
  return patch(`${parameter}/${id}/estado`, estadoData);
}

export function cancelarCita(id, motivoData) {
  return patch(`${parameter}/${id}/cancelar`, motivoData);
}

export function consultarDisponibilidad(datos) {
  return post(`${parameter}/disponibilidad`, datos);
}

export function getEstadosCita(endpoint = "/estados-cita") {
  return get(endpoint);
}

export function getEmpleadosPorServicio(servicioId) {
  return get(`/empleados/activos?servicioId=${servicioId}`);
}
