import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

const INTEGRANTES = ["Ezequiel Ibarra", "Lucas Bollini", "Matias Peralta", "Ignacio Barborini"];

/** Iniciales para la tarjeta de cada integrante: "Lucas Bollini" -> "LB". */
const iniciales = (nombre) => nombre.split(" ").map((parte) => parte[0]).join("");

/** Descripcion de la compañia, integrantes del grupo y tecnologias usadas. */
export default function Acerca() {
  useTitulo("Acerca de");

  return (
    <>
      <h1>Acerca de</h1>

      <section className="panel" aria-labelledby="titulo-compania">
        <h2 id="titulo-compania">La compañía</h2>
        <p>
          Gimnasio de Barrio es un gimnasio de cercanía que ofrece sala de musculación, clases grupales y un kiosco con
          productos para deportistas. Nuestro objetivo es brindar un servicio simple y cercano, con membresías mensuales,
          trimestrales y anuales.
        </p>
        <p>
          Este sitio es parte del trabajo práctico de Aplicaciones Interactivas (UADE): un sistema para gestionar socios,
          empleados, clases con cupos y las compras del kiosco. Mirá también nuestras{" "}
          <Link to="/politicas">políticas de seguridad y privacidad</Link>.
        </p>
      </section>

      <section className="panel" aria-labelledby="titulo-integrantes">
        <h2 id="titulo-integrantes">Integrantes del grupo</h2>
        <ul className="rejilla auto lista-limpia">
          {INTEGRANTES.map((nombre) => (
            <li className="integrante" key={nombre}>
              <span className="avatar" aria-hidden="true">
                {iniciales(nombre)}
              </span>
              {nombre}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="titulo-tecnologias">
        <h2 id="titulo-tecnologias">Tecnologías</h2>
        <ul>
          <li>Front-end: React, React Router, HTML5, CSS y JavaScript.</li>
          <li>Back-end: Java, Spring Boot, JPA/Hibernate y MySQL (API REST en JSON).</li>
        </ul>
      </section>
    </>
  );
}
