import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

export default function NoEncontrada() {
  useTitulo("Página no encontrada");
  return (
    <section className="panel">
      <h1>Página no encontrada</h1>
      <p>La dirección que abriste no existe. Podés volver al <Link to="/">inicio</Link> o usar el menú.</p>
    </section>
  );
}
