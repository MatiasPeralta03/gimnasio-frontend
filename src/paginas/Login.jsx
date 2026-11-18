import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../js/sesion.js";
import { validarFormulario } from "../js/validaciones.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Mensaje from "../componentes/Mensaje.jsx";

/**
 * Pantalla de login. Si los datos son correctos guarda la sesion (onLogin la pasa a App)
 * y vuelve a la pantalla que se quiso abrir antes de loguearse (o al inicio).
 */
export default function Login({ sesion, onLogin }) {
  useTitulo("Iniciar sesión");
  const navigate = useNavigate();
  const location = useLocation();
  const [mensaje, setMensaje] = useState({ texto: "", error: false });
  // RutaProtegida manda aca la pantalla que se queria abrir (ej: /socios).
  const destino = location.state?.desde || "/";

  // Si ya hay una sesion abierta, no tiene sentido mostrar el formulario.
  if (sesion) return <Navigate to={destino} replace />;

  function ingresar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    try {
      onLogin(iniciarSesion(form.elements.usuario.value, form.elements.password.value));
      navigate(destino, { replace: true });
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
      form.elements.password.value = "";
      form.elements.password.focus();
    }
  }

  return (
    <section className="panel login" aria-labelledby="titulo-login">
      <h1 id="titulo-login">Iniciar sesión</h1>
      <p>Ingresá con tu usuario del gimnasio para administrar socios, clases y el kiosco.</p>
      <Mensaje mensaje={mensaje} />
      <form onSubmit={ingresar} noValidate>
        <Campo
          id="login-usuario"
          etiqueta="Usuario"
          name="usuario"
          required
          autoComplete="username"
          data-mensaje-error="Escribí tu usuario."
        />
        <Campo
          id="login-password"
          etiqueta="Contraseña"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          data-mensaje-error="Escribí tu contraseña."
        />
        <div className="botonera">
          <button type="submit">Ingresar</button>
        </div>
      </form>
      <p className="ayuda">Usuarios de prueba: admin / admin123 (administrador) y empleado / empleado123.</p>
    </section>
  );
}
