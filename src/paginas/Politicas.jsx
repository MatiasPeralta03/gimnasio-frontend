import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

const ENLACE_AAIP = "https://www.argentina.gob.ar/aaip/datospersonales";

/** Politicas de seguridad y privacidad: que datos se tratan, como se cuidan y que derechos hay. */
export default function Politicas() {
  useTitulo("Políticas de seguridad y privacidad");

  return (
    <article className="panel texto-legal">
      <h1>Políticas de seguridad y privacidad</h1>
      <p>
        En Gimnasio de Barrio tratamos datos personales de socios y empleados. Esta página explica cuáles son, para qué
        los usamos, cómo los cuidamos y qué derechos tenés sobre ellos.
      </p>

      <section aria-labelledby="datos-recopilados">
        <h2 id="datos-recopilados">Qué datos registramos</h2>
        <ul>
          <li>
            <strong>Socios:</strong> DNI, nombre, apellido, email, teléfono, membresía, medio de pago, deuda con el kiosco,
            compras e inscripciones a clases.
          </li>
          <li>
            <strong>Empleados:</strong> DNI, nombre, apellido, email, teléfono, usuario y contraseña.
          </li>
        </ul>
      </section>

      <section aria-labelledby="para-que">
        <h2 id="para-que">Para qué los usamos</h2>
        <ul>
          <li>Gestionar la membresía de cada socio.</li>
          <li>Administrar las clases, sus cupos y las inscripciones.</li>
          <li>Registrar las compras del kiosco y las deudas.</li>
        </ul>
      </section>

      <section aria-labelledby="seguridad">
        <h2 id="seguridad">Cómo cuidamos los datos</h2>
        <ul>
          <li>No cedemos ni vendemos los datos a terceros.</li>
          <li>El sistema no guarda datos de tarjetas: las compras se registran como efectivo, transferencia o cuenta del socio.</li>
          <li>La contraseña de los empleados nunca se muestra en pantalla.</li>
          <li>Pedimos solo los datos que hacen falta para prestar el servicio.</li>
        </ul>
      </section>

      <section aria-labelledby="derechos">
        <h2 id="derechos">Tus derechos</h2>
        <p>
          La Ley 25.326 de Protección de los Datos Personales te permite acceder a tus datos, corregirlos o pedir que los
          suprimamos. Podés conocer más en el sitio de la{" "}
          <a href={ENLACE_AAIP} target="_blank" rel="noopener noreferrer">
            Agencia de Acceso a la Información Pública (se abre en otra pestaña)
          </a>
          .
        </p>
        <p>
          Cuando un socio se da de baja conservamos sus compras y pagos, porque son registros contables del gimnasio. Para
          ejercer tus derechos, pedilo en la recepción.
        </p>
        <p>
          <Link to="/">Volver al inicio</Link>
        </p>
      </section>
    </article>
  );
}
