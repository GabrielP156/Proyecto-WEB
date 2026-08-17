import { get, post, put, patch } from "./api";

const parameter = "/servicios-adicionales";

export function ListAllServiceAdicional(endpoint = parameter) {
  return get(endpoint);
}

export function CreateServiceAdicional(servicioAdicional) {
  return post(parameter, servicioAdicional);
}

export function getStateAdicional(endpoint = parameter) {
  return get(endpoint + "/activos");
}

export function setStateAdicional(id, estadoData) {
  return patch(`${parameter}/${id}/estado`, estadoData);
}

export function updateServiceAdicional(id, servicioAdicional) {
  return put(parameter + "/" + id, servicioAdicional);
}

export function getServiceAdicional(id) {
  return get(parameter + "/" + id);
}