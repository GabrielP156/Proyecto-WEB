import { Navigate } from "react-router-dom";
import { useAuth } from "../services/auth/useAuth";

export function RutaProtegida({ children, rolesPermitidos }) {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !hasRole(rolesPermitidos)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
