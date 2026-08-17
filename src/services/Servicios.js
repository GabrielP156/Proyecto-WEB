  import { get, post ,put,patch,postFile} from "./api";
  const parameter="/servicios"
  

  export function  ListAllService(endpoint = parameter){
    return get(endpoint);
  }

    export function CreateService(endpoint = parameter,Servicio){
    return post(endpoint,Servicio);
  }

    export function getState(endpoint = parameter){
    return get(endpoint+"/activos");
  }
  
    export function setState(endpoint = parameter,id,estadoData){
    return patch(`${endpoint}/${id}/estado`, estadoData);
  }

    export function updateService(id, servicio) {
      return put(parameter + "/" + id, servicio);
    }
    
      export function getService(endpoint = parameter,id){
    return get(endpoint+"/"+{id},id);
  }

  
      export function getEspecialidad(endpoint="/especialidades"){
    return get(endpoint);
  }

      export function getEspecialidadById(endpoint = "/especialidades",id){
    return get(endpoint+"/"+{id},id);
  }

  export function uploadImagen(file) {
    const formData = new FormData();
    formData.append("image", file);
    return postFile("/images/upload", formData);
  }










