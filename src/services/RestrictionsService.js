import { get } from "./api";
const parameter = "/restricciones-horario";

export function ListAllRestrictions(endpoint = parameter) {
  return get(endpoint);
}

export function getRestriction(id) {
  return get(parameter + "/" + id);
}
