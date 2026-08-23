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
  const [menuAbierto, setMenuAbierto] = useState(false)
const location = useLocation();

  function handleLogout() {
    logout();
    setMenuAbierto(false);
    navigate("/login");
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }
  const nombreCompleto = usuario
    ? `${usuario.nombre || ""} ${usuario.primerApellido || ""} ${usuario.segundoApellido || ""}`.trim()
    : "";

  const enlaces = (
    <>
      {isAuthenticated ? (
        <>
          <NavLink onClick={cerrarMenu} to="/service" className={linkClase}>Servicios</NavLink>
          {(usuario?.rol?.nombre === "Administrador" || usuario?.rol?.nombre === "Empleado") && (
            <NavLink onClick={cerrarMenu} to="/empleado" className={linkClase}>Empleados</NavLink>
          )}
          <NavLink onClick={cerrarMenu} to="/aditionalService" className={linkClase}>Servicios Adicionales</NavLink>
          <NavLink onClick={cerrarMenu} to="/horarios" className={linkClase}>Horarios</NavLink>
          {(usuario?.rol?.nombre === "Administrador" || usuario?.rol?.nombre === "Empleado") && (
            <NavLink onClick={cerrarMenu} to="/restricciones" className={linkClase}>Restricciones</NavLink>
          )}
          <NavLink onClick={cerrarMenu} to="/citas" className={linkClase}>Citas</NavLink>
          {usuario?.rol?.nombre === "Administrador" && (
            <NavLink onClick={cerrarMenu} to="/agenda" className={linkClase}>Agenda Diaria</NavLink>
          )}
          <button
            onClick={() => { setVisible(true); setMenuAbierto(false); }}
            className="rounded-md p-2 text-emerald-400 0 hover:bg-white hover:text-emerald-500 font-semibold cursor-pointer transition-all duration-200"
          >
            Usuario
          </button>

          <button
            onClick={handleLogout}
            className="rounded-md p-2 text-danger  hover:bg-white hover:text-danger font-semibold cursor-pointer transition-all duration-200"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <NavLink onClick={cerrarMenu} to="/login" className={linkClase}>Iniciar sesión</NavLink>
          <NavLink onClick={cerrarMenu} to="/registro" className={linkClase}>Registrarme</NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="h-[70px] relative z-50 border-b border-accent/30 bg-black/90 px-4 py-3 flex items-center justify-between flex-wrap gap-2 shadow-[0_1px_24px_-8px_var(--color-accent)]">
        <Link
          to="/"
          className="font-display font-extrabold uppercase tracking-wide text-accent animate-pulse"
        >
          Zona de Ataque
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {enlaces}
        </nav>

        <button
          onClick={() => setMenuAbierto((prev) => !prev)}
          className="md:hidden rounded-md p-2 text-accent hover:bg-white/10 cursor-pointer"
        >
          {menuAbierto ? "✕" : "☰"}
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

        {menuAbierto && (
          <nav className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-accent/30 flex flex-col gap-4 px-4 py-4 text-sm">
            {enlaces}
          </nav>
        )}
      </header>

      <main  key={location.pathname} className="flex-1 relative animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}