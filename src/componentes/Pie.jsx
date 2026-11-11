import { Link } from "react-router-dom";

/** Pie de pagina con el acceso a las politicas (visible en todas las pantallas). */
export default function Pie() {
  return (
    <footer className="pie">
      <ul>
        <li>
          <Link to="/politicas">Políticas de seguridad y privacidad</Link>
        </li>
        <li>
          <Link to="/acerca">Acerca de</Link>
        </li>
      </ul>
      <p>Aplicaciones Interactivas - UADE - 2do Cuatrimestre 2026</p>
    </footer>
  );
}
