import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo.js";

/** Politica de privacidad: que datos se tratan, para que, y que derechos tiene cada persona. */
export default function Privacidad() {
  useTitulo("Politica de privacidad");

  return (
    <article className="texto-legal">
      <h1>Politica de privacidad: que hacemos con tus datos</h1>
      <p>
        En Gimnasio de Barrio tratamos datos personales de socios y empleados. Esta pagina explica cuales son, para
        que los usamos y que derechos tenes sobre ellos.
      </p>

      <section aria-labelledby="datos-recopilados">
        <h2 id="datos-recopilados">Que datos recopilamos</h2>
        <ul>
          <li>
            <strong>Socios:</strong> DNI, nombre, apellido, email, telefono, membresia, medio de pago, deuda con el
            kiosco, PIN de ingreso, historial de ingresos, compras, pagos e inscripciones a clases.
          </li>
          <li>
            <strong>Empleados:</strong> DNI, nombre, apellido, email, telefono, usuario y contraseña.
          </li>
        </ul>
      </section>

      <section aria-labelledby="para-que">
        <h2 id="para-que">Para que los usamos</h2>
        <ul>
          <li>Gestionar tu membresia y cobrar cuotas.</li>
          <li>Controlar el acceso al gimnasio con tu PIN.</li>
          <li>Administrar clases, cupos, ventas del kiosco y deudas.</li>
        </ul>
      </section>

      <section aria-labelledby="seguridad">
        <h2 id="seguridad">Seguridad y terceros</h2>
        <ul>
          <li>No cedemos ni vendemos tus datos a terceros.</li>
          <li>La contraseña de los empleados nunca se muestra en pantalla.</li>
          <li>
            En esta version del sistema los datos de tarjeta que se ingresan al comprar son una simulacion: no se
            envian ni se guardan.
          </li>
        </ul>
      </section>

      <section aria-labelledby="derechos">
        <h2 id="derechos">Tus derechos</h2>
        <p>
          Segun la{" "}
          <a
            href="https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64790/norma.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ley 25.326 de Proteccion de los Datos Personales (se abre en otra pestaña)
          </a>
          , podes pedir acceder a tus datos, corregirlos o que los suprimamos. Cuando un socio se da de baja,
          conservamos el historial minimo necesario (ingresos, compras y pagos) para la contabilidad del gimnasio.
        </p>
        <p>
          Para ejercer estos derechos, pedilo en la recepcion del gimnasio. Volver al <Link to="/">inicio</Link>.
        </p>
      </section>
    </article>
  );
}
