import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

const INTEGRANTES = ["Ezequiel Ibarra", "Lucas Bollini", "Matias Peralta", "Ignacio Barborini"];

/** Descripcion de la compañia, integrantes del grupo y tecnologias usadas. */
export default function Acerca() {
  useTitulo("Acerca de");

  return (
    <>
      <h1>Acerca de</h1>

      <section aria-labelledby="titulo-compania">
        <h2 id="titulo-compania">La compañia</h2>
        {/* TODO: ajustar la descripcion con los datos reales de la compañia del grupo */}
        <p>
          Gimnasio de Barrio es un gimnasio de cercania que ofrece sala de musculacion, clases grupales y un kiosco
          con productos para deportistas. Nuestro objetivo es brindar un servicio simple y cercano, con membresias
          mensuales, trimestrales y anuales.
        </p>
        <p>
          Este sitio es parte de un trabajo practico de Aplicaciones Interactivas (UADE): un sistema para gestionar
          socios, clases, ingresos, kiosco y cobros. Mira tambien nuestra <Link to="/privacidad">politica de privacidad</Link>.
        </p>
      </section>

      <section aria-labelledby="titulo-integrantes">
        <h2 id="titulo-integrantes">Integrantes del grupo</h2>
        <ul>
          {INTEGRANTES.map((nombre) => (
            <li key={nombre}>{nombre}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-tecnologias">
        <h2 id="titulo-tecnologias">Tecnologias</h2>
        <ul>
          <li>Front-end: React, React Router, HTML5, CSS y JavaScript.</li>
          <li>Back-end: Java, Spring Boot, JPA/Hibernate y MySQL (API REST en JSON).</li>
        </ul>
      </section>
    </>
  );
}
