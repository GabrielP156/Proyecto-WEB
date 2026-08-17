import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginRequest, registrarCliente, obtenerPerfil } from "../usuarioService";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (correo, password) => {
    const data = await loginRequest(correo, password);
    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);

    const perfil = await obtenerPerfil();
    setUsuario(perfil.data);

    return perfil.data;
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const registrarUsuario = useCallback(async (datos) => {
    return await registrarCliente(datos);
  }, []);

  const hasRole = useCallback(
    (rolesPermitidos = []) => {
      if (!usuario) return false;
      return rolesPermitidos.includes(usuario.rol?.nombre);
    },
    [usuario]
  );

  useEffect(() => {
    let isMounted = true;

    async function restaurarSesion() {
      const tokenGuardado = localStorage.getItem("token");

      if (!tokenGuardado) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const perfil = await obtenerPerfil();

        if (isMounted) {
          setToken(tokenGuardado);
          setUsuario(perfil.data);
        }
      } catch (error) {
        clearSession();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    restaurarSesion();

    return () => {
      isMounted = false;
    };
  }, [clearSession]);


   const value = useMemo(
    () => ({
      usuario,
      token,
      loading,
      isAuthenticated: Boolean(token && usuario),
      login,
      logout,
      registrarUsuario,
      hasRole,
    }),
    [usuario, token, loading, login, logout, registrarUsuario, hasRole]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

}