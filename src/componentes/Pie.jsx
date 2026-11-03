import { Link } from "react-router-dom";

/** Pie de pagina con el acceso a la politica de privacidad (visible en todas las pantallas). */
export default function Pie() {
  return (
    <footer className="pie">
      <ul>
        <li>
          <Link to="/privacidad">Politica de privacidad: que hacemos con tus datos</Link>
        </li>
        <li>
          <Link to="/acerca">Acerca de</Link>
        </li>
      </ul>
      <p>Aplicaciones Interactivas - UADE - 2do Cuatrimestre 2026</p>
    </footer>
  );
}
