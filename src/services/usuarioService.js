  import { get, post } from "./api";

  export function login(correo, password) {
    return post("/usuarios/login", { correo, password });
  }

  export function registrarCliente(datos) {
    return post("/usuarios/registro", datos);
  }

  export function obtenerPerfil() {
    return get("/usuarios/perfil");
  }

  export function listarUsuarios(rol) {
    const query = rol ? `?rol=${rol}` : "";
    return get(`/usuarios${query}`);
  }



