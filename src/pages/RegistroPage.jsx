import { useState } from "react";
import { Link } from "react-router-dom";
import { CampoPassword } from "../components/CampoPassword";
import { Button } from "@/components/ui/button";
import { AuthCard } from "../components/AuthCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "../services/auth/useAuth";


//registrar un usuario
export function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    correo: "",
    telefono: "",
    password: "",
  });
  const {registrarUsuario}=useAuth()

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [exitoMsg, setExitoMsg] = useState("");


  //funcion actulaiza el UseState de cada vez que se ingresa un valor
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  //registrar el usuario 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setExitoMsg("");

    try {
      await registrarUsuario(formData);
      setExitoMsg("¡Usuario registrado con éxito!");
      setFormData({
        nombre: "",
        primerApellido: "",
        segundoApellido: "",
        correo: "",
        telefono: "",
        password: "",
      });
    } catch (error) {
      setErrorMsg(error.message || "Error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Registro" subtitle="Crea tu cuenta de cliente">
      {errorMsg && (
        <p className="text-red-500 font-bold text-sm mb-4 text-center">
          {errorMsg}
        </p>
      )}
      {exitoMsg && (
        <p className="text-green-500 font-bold text-sm mb-4 text-center">
          {exitoMsg}
        </p>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <Label required>Nombre</Label>
          <Input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            minLength={2}
          />
        </div>

        <div>
          <Label required>Primer apellido</Label>
          <Input
            name="primerApellido"
            value={formData.primerApellido}
            onChange={handleChange}
            required
            minLength={2}
          />
        </div>

        <div>
          <Label>Segundo apellido</Label>
          <Input
            name="segundoApellido"
            value={formData.segundoApellido}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label required>Correo</Label>
          <Input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Teléfono</Label>
          <Input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label required>Contraseña</Label>
          <CampoPassword
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <p className="text-xs text-muted mt-1">
            Mínimo 8 caracteres, con mayúscula, minúscula y número.
          </p>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </Button>
      </form>

      <p className="text-sm mt-4 text-center">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-hover font-bold">
          Inicia sesión
        </Link>
      </p>
    </AuthCard>
  );
}