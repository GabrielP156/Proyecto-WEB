  import { get, post ,put,patch,postFile} from "./api";
  const parameter="/empleados"
  

  export function  ListAllEmployers(endpoint = parameter){
    return get(endpoint);
  }

    export function CreateEmployer(endpoint = parameter,Servicio){
    return post(endpoint,Servicio);
  }

    export function getState(endpoint = parameter){
    return get(endpoint+"/activos");
  }
  
    export function Schedule(endpoint = parameter,id,estadoData){
    return patch(`${endpoint}/${id}/agenda`, estadoData);
  }

      export function setState(endpoint = parameter,id,estadoData){
      return patch(`${endpoint}/${id}/estado`, estadoData);
    }

    export function updateService(id, servicio) {
      return put(parameter + "/" + id, servicio);
    }
    
      export function getEmployer(endpoint = parameter,id){
    return get(endpoint+"/"+{id},id);
  }

  
      export function getEspecialidad(endpoint="/especialidades"){
    return get(endpoint);
  }

      export function getEmployerdById(endpoint = parameter,id){
    return get(endpoint+"/"+{id});
  }




