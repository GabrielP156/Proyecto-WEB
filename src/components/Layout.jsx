import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/auth/useAuth";
import { PerfilPage } from "../components/PerfilPage";
import { useState } from "react";


const linkClase = ({ isActive }) =>
  isActive ? "text-white font-bold" : "text-muted hover:text-accent";

export function Layout() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false)
const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }
  const nombreCompleto = usuario 
    ? `${usuario.nombre || ""} ${usuario.primerApellido || ""} ${usuario.segundoApellido || ""}`.trim()
    : "";
  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="h-[70px] relative z-50 border-b border-accent/30 bg-black/90 px-4 py-3 flex items-center justify-between flex-wrap gap-2 shadow-[0_1px_24px_-8px_var(--color-accent)]">
        <Link
          to="/"
          className="font-display font-extrabold uppercase tracking-wide text-accent animate-pulse"
        >
          Zona de Ataque
        </Link>

        <nav className="flex items-center gap-6 text-sm">


          {isAuthenticated ? (
            <>
              <NavLink to="/service" className={linkClase}>Servicios</NavLink>
              <NavLink to="/empleado" className={linkClase}>Empleados</NavLink>
              <NavLink to="/aditionalService" className={linkClase}>Servicios Adicionales</NavLink>
              <button
                onClick={() => setVisible(true)}
                className="rounded-md p-2 text-emerald-400 0 hover:bg-white hover:text-emerald-500 font-semibold cursor-pointer transition-all duration-200"
              >
                Usuario
              </button>

              {visible && (
                <PerfilPage
                  nombre={nombreCompleto}
                  correo={usuario?.correo}
                  telefono={usuario?.telefono}
                  rol={usuario?.rol?.nombre || usuario?.rol}
                  onClose={() => setVisible(false)}
                />
              )}


              <button
                onClick={handleLogout}
                className="rounded-md p-2 text-danger  hover:bg-white hover:text-danger font-semibold cursor-pointer transition-all duration-200"
              >
                Cerrar sesión
              </button>
            
            </>


          ) : (
            <>
              <NavLink to="/login" className={linkClase}>Iniciar sesión</NavLink>
              <NavLink to="/registro" className={linkClase}>Registrarme</NavLink>
            </>
          )}
        </nav>
      </header>

      <main  key={location.pathname} className="flex-1 relative animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}