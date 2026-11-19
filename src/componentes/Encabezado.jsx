import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { tienePermiso } from "../js/sesion.js";
import { nombreRol } from "../js/empleados.js";

// [ruta, texto, quien la ve]: "todos" = sin login; "sesion" = cualquier usuario logueado; o una lista de roles.
const ENLACES = [
  ["/", "Inicio", "todos"],
  ["/socios", "Socios", "sesion"],
  ["/empleados", "Empleados", ["ADMIN"]],
  ["/clases", "Clases", "sesion"],
  ["/productos", "Productos", "sesion"],
  ["/ventas", "Ventas", "sesion"],
  ["/acerca", "Acerca de", "todos"],
];

function puedeVer(sesion, quien) {
  if (quien === "todos") return true;
  return tienePermiso(sesion, quien === "sesion" ? null : quien);
}

/**
 * Encabezado con la barra de navegacion. Solo muestra los enlaces que el usuario puede abrir
 * (un EMPLEADO no ve "Empleados"). En celular el menu se abre y cierra con un boton.
 */
export default function Encabezado({ sesion, onSalir }) {
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  function salir() {
    setAbierto(false);
    onSalir();
    navigate("/login");
  }

  return (
    <header className="encabezado">
      <div className="encabezado-barra">
        <p className="marca">
          <Link to="/">Gimnasio de Barrio</Link>
        </p>
        <button
          type="button"
          className="boton-menu"
          aria-expanded={abierto}
          aria-controls="menu-principal"
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? "Cerrar menú" : "Menú"}
        </button>
        <nav id="menu-principal" className="menu" aria-label="Navegación principal" hidden={!abierto}>
          <ul>
            {ENLACES.filter(([, , quien]) => puedeVer(sesion, quien)).map(([ruta, texto]) => (
              <li key={ruta}>
                <NavLink to={ruta} end={ruta === "/"} onClick={() => setAbierto(false)}>
                  {texto}
                </NavLink>
              </li>
            ))}
            {sesion ? (
              <li className="usuario-sesion">
                <span className="usuario-datos">
                  <span className="solo-lectores">Sesión iniciada como </span>
                  <strong>{sesion.usuario}</strong>
                  <span className="rol">{nombreRol(sesion.rol)}</span>
                </span>
                <button type="button" className="boton-salir" onClick={salir}>
                  Cerrar sesión
                </button>
              </li>
            ) : (
              <li>
                <NavLink to="/login" onClick={() => setAbierto(false)}>
                  Iniciar sesión
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
