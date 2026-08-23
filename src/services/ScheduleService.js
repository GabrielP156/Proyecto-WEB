import { get } from "./api";
const parameter = "/horarios-atencion";

export function ListAllSchedules(endpoint = parameter) {
  return get(endpoint);
}

export function getSchedule(id) {
  return get(parameter + "/" + id);
}
