import { Link } from "react-router-dom";
import Estado from "../componentes/Estado.jsx";
import useDatos from "../hooks/useDatos.js";
import useTitulo from "../hooks/useTitulo.js";
import { listarClases } from "../js/clases.js";
import { formatoFechaHora, formatoPrecio, aFecha } from "../js/formatos.js";
import { MEMBRESIAS } from "../js/membresias.js";

const SERVICIOS = [
  ["Sala de musculación", "Máquinas y pesas libres para entrenar a tu ritmo."],
  ["Clases grupales", "Funcional, spinning y más, con cupos limitados y anotación en recepción."],
  ["Kiosco", "Bebidas y snacks para antes o después de entrenar, con tu cuenta de socio."],
];

function textoCupos(cupos) {
  if (cupos === 0) return "Sin cupo";
  return cupos === 1 ? "1 lugar libre" : cupos + " lugares libres";
}

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
        <p>Entrená cerca de casa. Socios, clases con cupo y kiosco, todo en un solo lugar.</p>
        <div className="botonera">
          <Link className="boton" to="/clases">
            Ver clases
          </Link>
          <Link className="boton secundario" to="/compra">
            Comprar en el kiosco
          </Link>
        </div>
      </section>

      <section aria-labelledby="titulo-servicios">
        <h2 id="titulo-servicios">Qué ofrecemos</h2>
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
        <h2 id="titulo-planes">Planes de membresía</h2>
        <p>Todos los planes dan el mismo acceso. Cuantos más meses pagás juntos, más barato te sale cada mes.</p>
        <div className="rejilla tres">
          {MEMBRESIAS.map((m) => (
            <article className="tarjeta" key={m.valor}>
              <h3>{m.nombre}</h3>
              <p className="precio">{formatoPrecio(m.precio)}</p>
              <p>{m.detalle}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-proximas">
        <h2 id="titulo-proximas">Próximas clases</h2>
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
                    {textoCupos(c.cuposDisponibles)}
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
