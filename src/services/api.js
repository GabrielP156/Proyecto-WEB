export  const API_URL = import.meta.env.VITE_API_URL;




//peticiones al servidor vía JSON
async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };
  const response = await fetch(url, config);
  const textoRespuesta = await response.text();
  let data = {};
  if (textoRespuesta) {
    try {
      data = JSON.parse(textoRespuesta);
    } catch (e) {
      data = {};
    }
  }
  if (!response.ok) {
    
    if (data.validationErrors && data.validationErrors.length > 0) {
      const mensajeEspecifico = data.validationErrors[0].message;
      throw new Error(mensajeEspecifico);
    }
    if (data.message) {
      throw new Error(data.message);
    }
   
  }
  return data;
}




//peticiones al servidor vía Archivos
export function postFile(path, formData) { 
  const token = localStorage.getItem("token");
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      
    },
    body: formData,
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al subir el archivo");
    return data;
  });
}




//metodos posible a usar
export function get(path) {
  return request(path, { method: "GET" });
}

export function post(path, body) {
  return request(path, { method: "POST", body: JSON.stringify(body) });
}

export function put(path, body) {
  return request(path, { method: "PUT", body: JSON.stringify(body) });
}

export function patch(path, body) {
  return request(path, { method: "PATCH", body: JSON.stringify(body) });
}


