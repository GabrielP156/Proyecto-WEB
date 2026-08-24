import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CampoPassword } from "../components/CampoPassword";
import { Button } from "../components/Button";
import { AuthCard } from "../components/AuthCard";
import { Label } from "../components/Label";
import { Alert } from "../components/Alert";
import heroImage from "../assets/eae7d108-19df-4175-99b7-7b9f8db8a108.jpg";
import { useAuth } from "../services/auth/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMensajeError("");

    try {
      await login(formData.correo, formData.password);
      navigate("/");
    } catch (error) {
      setMensajeError(error.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-[92vh] flex ">
      <div className="relative w-1/2 h-full flex items-center justify-center p-12 ">
        <div className="relative w-full h-full max-h-[600px] group transition-all duration-500 ease-out transform hover:-rotate-1 hover:scale-105">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
          <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-cyan-500/30">
            <img
              src={heroImage}
              alt="Zona de juego"
              className="w-full h-full object-cover filter brightness-90 group-hover:brightness-110 transition duration-500"
            />
          </div>
        </div>

        {/*Izquierda */}
        <div className="absolute top-[6%] left-[6%] -z-30 [animation-delay:-1s] after:content-[''] after:block after:w-28 after:h-28 after:rounded-full after:bg-pink-500 after:border-4 after:border-pink-500 after:shadow-[0_0_20px_rgba(236,72,153,0.9),0_0_40px_rgba(236,72,153,0.6)] animate-flotar1"></div>
        <div className="absolute bottom-[6%] left-[6%] -z-30 [animation-delay:-4s] after:content-[''] after:block after:w-24 after:h-24 after:rounded-full after:bg-accent after:border-4 after:border-accent after:shadow-[0_0_15px_var(--color-accent,#8b5cf6),0_0_20px_var(--color-accent,#8b5cf6)] animate-flotar3"></div>
        <div className="absolute top-[8%] right-[6%] -z-30 [animation-delay:-6s] after:content-[''] after:block after:w-32 after:h-32 after:rounded-full after:bg-[rgba(138,43,226)] after:border-4 after:border-[#8a2be2] after:shadow-[0_0_20px_rgba(138,43,226,0.8),0_0_40px_rgba(138,43,226,0.4)] animate-flotar5"></div>
      </div>

      {/*Derecha */}
      <div className="relative w-1/2 h-full flex items-center justify-center overflow-y-auto">
        <div className="absolute top-[8%] left-[6%] -z-30 [animation-delay:-2.5s] after:content-[''] after:block after:w-24 after:h-24 after:rounded-full after:bg-pink-500 after:border-4 after:border-pink-500 after:shadow-[0_0_20px_rgba(236,72,153,0.9),0_0_40px_rgba(236,72,153,0.6)] animate-flotar1"></div>
        <div className="absolute top-[6%] right-[6%] -z-30 [animation-delay:-5s] after:content-[''] after:block after:w-28 after:h-28 after:rounded-full after:bg-accent after:border-4 after:border-accent after:shadow-[0_0_15px_var(--color-accent,#8b5cf6),0_0_20px_var(--color-accent,#8b5cf6)] animate-flotar2"></div>
        <div className="absolute top-[46%] left-[3%] -z-30 -translate-y-1/2 [animation-delay:-1s] after:content-[''] after:block after:w-20 after:h-20 after:rounded-full after:bg-[rgba(138,43,226)] after:border-4 after:border-[#8a2be2] after:shadow-[0_0_20px_rgba(138,43,226,0.8),0_0_40px_rgba(138,43,226,0.4)] animate-flotar3"></div>
        <div className="absolute bottom-[6%] left-[6%] -z-30 [animation-delay:-3s] after:content-[''] after:block after:w-28 after:h-28 after:rounded-full after:bg-accent after:border-4 after:border-accent after:shadow-[0_0_20px_rgba(138,43,226,0.8),0_0_40px_rgba(138,43,226,0.4)] animate-flotar4"></div>
        <div className="absolute bottom-[8%] right-[6%] -z-30 [animation-delay:-7s] after:content-[''] after:block after:w-24 after:h-24 after:rounded-full after:bg-pink-500 after:border-4 after:border-pink-500 after:shadow-[0_0_20px_rgba(236,72,153,0.9),0_0_40px_rgba(236,72,153,0.6)] animate-flotar5"></div>

        <AuthCard title="Iniciar sesión" subtitle="Accede a tu zona de juego">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label required>Correo</Label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                minLength={7}
                placeholder="tu@correo.com"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <Label required>Contraseña</Label>
              <CampoPassword
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={4}
              />
            </div>

            {mensajeError && <Alert type="danger">{mensajeError}</Alert>}

            <Button type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="text-sm mt-4 text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-hover font-bold">
              Regístrate
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}