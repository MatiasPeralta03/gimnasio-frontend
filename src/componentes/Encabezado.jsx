import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const ENLACES = [
  ["/", "Inicio"],
  ["/socios", "Socios"],
  ["/clases", "Clases"],
  ["/ingresos", "Ingresos"],
  ["/productos", "Productos"],
  ["/compra", "Comprar"],
  ["/empleados", "Empleados"],
  ["/acerca", "Acerca de"],
];

/** Encabezado con la barra de navegacion. En celular el menu se abre y cierra con un boton. */
export default function Encabezado() {
  const [abierto, setAbierto] = useState(false);

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
          {abierto ? "Cerrar menu" : "Menu"}
        </button>
        <nav id="menu-principal" className="menu" aria-label="Navegacion principal" hidden={!abierto}>
          <ul>
            {ENLACES.map(([ruta, texto]) => (
              <li key={ruta}>
                <NavLink to={ruta} end={ruta === "/"} onClick={() => setAbierto(false)}>
                  {texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
