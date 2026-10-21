import { NavLink } from "react-router-dom";

export default function Encabezado() {
  return (
    <header>
      <h1>Gimnasio de Barrio</h1>
      <nav aria-label="Navegacion principal">
        <ul>
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/socios">Socios</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/compra">Comprar</NavLink></li>
          <li><NavLink to="/acerca">Acerca de</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}
