import { get, post, put, patch, postFile } from "./api";
const parameter = "/empleados"

export function ListAllEmployers(endpoint = parameter) {
  return get(endpoint);
}

export function CreateEmployer(empleado) {
  return post(parameter, empleado);
}

export function getState(endpoint = parameter) {
  return get(endpoint + "/activos");
}

export function getAgendaEmpleado(id, fecha) {
  return get(`${parameter}/${id}/agenda?fecha=${fecha}`);
}

export function setStateEmployer(id, estadoData) {
  return patch(`${parameter}/${id}/estado`, estadoData);
}

export function updateEmployer(id, empleado) {
  return put(parameter + "/" + id, empleado);
}

export function getEmployer(id) {
  return get(parameter + "/" + id);
}

export function getEspecialidad(endpoint = "/especialidades") {
  return get(endpoint);
}