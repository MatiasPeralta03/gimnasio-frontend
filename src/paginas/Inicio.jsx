import { Link } from "react-router-dom";
import Estado from "../componentes/Estado.jsx";
import useDatos from "../hooks/useDatos.js";
import useTitulo from "../hooks/useTitulo.js";
import { listarClases } from "../js/clases.js";
import { formatoFechaHora, formatoPrecio, aFecha } from "../js/formatos.js";
import { MEMBRESIAS } from "../js/membresias.js";

const SERVICIOS = [
  ["Sala de musculacion", "Maquinas y pesas libres con acceso rapido usando tu PIN personal."],
  ["Clases grupales", "Funcional, spinning y mas, con cupos limitados y anotacion en recepcion."],
  ["Kiosco", "Bebidas y snacks para antes o despues de entrenar, con tu cuenta de socio."],
];

/** Pagina de inicio: presenta el gimnasio, los planes y las proximas clases. */
export default function Inicio() {
  useTitulo("Inicio");
  const { datos: clases, cargando, error, recargar } = useDatos(listarClases);

  const proximas = clases
    .filter((c) => c.activa && aFecha(c.horario) >= new Date())
    .sort((a, b) => aFecha(a.horario) - aFecha(b.horario))
    .slice(0, 3);

  return (
    <>
      <section className="portada" aria-labelledby="titulo-portada">
        <h1 id="titulo-portada">Gimnasio de Barrio</h1>
        <p>Entrena cerca de casa. Elegi tu plan, anotate a las clases y entra con tu PIN.</p>
        <div className="botonera" style={{ justifyContent: "center" }}>
          <Link className="boton" to="/clases">
            Ver clases
          </Link>
          <Link className="boton secundario" to="/socios">
            Hacerme socio
          </Link>
        </div>
      </section>

      <section aria-labelledby="titulo-servicios">
        <h2 id="titulo-servicios">Que ofrecemos</h2>
        <div className="rejilla tres">
          {SERVICIOS.map(([titulo, texto]) => (
            <article className="tarjeta" key={titulo}>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-planes">
        <h2 id="titulo-planes">Planes de membresia</h2>
        <div className="rejilla tres">
          {MEMBRESIAS.map((m) => (
            <article className="tarjeta" key={m.valor}>
              <h3>{m.nombre}</h3>
              <p className="precio">{formatoPrecio(m.precio)}</p>
              <p>{m.detalle}</p>
            </article>
          ))}
        </div>
        <p>
          La cuota se abona en recepcion en efectivo o por transferencia. <Link to="/socios">Registrate como socio</Link>.
        </p>
      </section>

      <section aria-labelledby="titulo-proximas">
        <h2 id="titulo-proximas">Proximas clases</h2>
        <Estado
          cargando={cargando}
          error={error}
          recargar={recargar}
          vacio={proximas.length === 0}
          textoVacio="Por ahora no hay clases programadas."
        >
          <div className="rejilla tres">
            {proximas.map((c) => (
              <article className="tarjeta" key={c.id}>
                <h3>{c.actividad}</h3>
                <p>{formatoFechaHora(c.horario)} hs</p>
                <p>Instructor: {c.instructorNombre}</p>
                <p>
                  <span className={"etiqueta" + (c.cuposDisponibles === 0 ? " baja" : "")}>
                    {c.cuposDisponibles === 0 ? "Sin cupo" : c.cuposDisponibles + " lugares libres"}
                  </span>
                </p>
              </article>
            ))}
          </div>
          <p>
            <Link to="/clases">Ver todas las clases</Link>
          </p>
        </Estado>
      </section>
    </>
  );
}
