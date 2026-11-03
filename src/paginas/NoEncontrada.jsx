import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

export default function NoEncontrada() {
  useTitulo("Pagina no encontrada");
  return (
    <section>
      <h1>Pagina no encontrada</h1>
      <p>La direccion que abriste no existe. Podes volver al <Link to="/">inicio</Link> o usar el menu.</p>
    </section>
  );
}
