import { useState } from "react";
import { enviar, datosDe } from "../js/api.js";
import { filtrarClases, listarClases, listarInstructores } from "../js/clases.js";
import { ahoraParaInput, enAniosParaInput, formatoFechaHora, paraBackend, paraInputFechaHora } from "../js/formatos.js";
import { PATRON_TEXTO, validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Dialogo from "../componentes/Dialogo.jsx";
import Estado from "../componentes/Estado.jsx";
import InscriptosClase from "../componentes/InscriptosClase.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Tabla from "../componentes/Tabla.jsx";

/** Campos de la clase (alta y edicion). */
function CamposClase({ prefijo, clase = {}, instructores }) {
  const esAlta = clase.id === undefined;
  // Al editar, la capacidad no puede quedar por debajo de los socios ya inscriptos.
  const inscriptos = esAlta ? 0 : clase.capacidad - clase.cuposDisponibles;

  return (
    <div className="campos">
      <Campo
        id={prefijo + "-actividad"}
        etiqueta="Actividad"
        name="actividad"
        required
        minLength={3}
        maxLength={100}
        pattern={PATRON_TEXTO}
        defaultValue={clase.actividad}
        ayuda="Ejemplo: Funcional, Spinning, Yoga."
        data-mensaje-error="Escribí el nombre de la actividad (al menos 3 letras)."
      />
      <Campo
        id={prefijo + "-horario"}
        etiqueta="Día y horario"
        name="horario"
        type="datetime-local"
        required
        min={esAlta ? ahoraParaInput() : undefined}
        max={enAniosParaInput(2)}
        defaultValue={paraInputFechaHora(clase.horario)}
        data-mensaje-error={
          esAlta ? "Elegí un día y una hora futuros, dentro de los próximos 2 años." : "Elegí el día y la hora (dentro de los próximos 2 años)."
        }
      />
      <Campo
        id={prefijo + "-capacidad"}
        etiqueta="Capacidad (lugares)"
        name="capacidad"
        type="number"
        min={Math.max(1, inscriptos)}
        max="200"
        step="1"
        required
        defaultValue={clase.capacidad}
        data-mensaje-error={"La capacidad debe ser un número entero entre " + Math.max(1, inscriptos) + " y 200."}
      />
      <Campo
        id={prefijo + "-instructor"}
        etiqueta="Instructor"
        as="select"
        name="instructorId"
        required
        defaultValue={clase.instructorId ?? ""}
        data-mensaje-error="Elegí un instructor."
      >
        <option value="">Elegí un instructor...</option>
        {instructores.map((e) => (
          <option key={e.id} value={e.id}>
            {e.apellido}, {e.nombre}
          </option>
        ))}
      </Campo>
    </div>
  );
}

/** Pantalla de clases: alta, agenda con cupos, edicion, cancelacion e inscripciones. */
export default function Clases() {
  useTitulo("Clases");
  const { datos: clases, cargando, error, recargar } = useDatos(listarClases);
  const { datos: instructores } = useDatos(listarInstructores);
  const { mensaje, limpiar, ejecutar } = useMensaje();
  const [filtro, setFiltro] = useState({ texto: "", estado: "activas", soloConCupo: false });
  const [editando, setEditando] = useState(null);
  const [inscriptos, setInscriptos] = useState(null);

  const visibles = filtrarClases(clases, filtro);

  // El campo datetime-local da "2026-10-05T18:00"; el backend espera segundos.
  const datosClase = (form) => ({ ...datosDe(form), horario: paraBackend(form.elements["horario"].value) });

  // Al abrir la ventana se limpia el mensaje anterior: ahi adentro solo se ve lo que pase en ella.
  function abrirEdicion(clase) {
    limpiar();
    setEditando(clase);
  }

  function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form, datosClase(form)), (c) => "Clase " + c.actividad + " creada.", () => {
      form.reset();
      return recargar();
    });
  }

  function modificar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form, datosClase(form)), "Clase actualizada.", () => {
      setEditando(null);
      return recargar();
    });
  }

  function cancelar(e, clase) {
    e.preventDefault();
    if (!window.confirm("¿Cancelar la clase " + clase.actividad + "? Los socios inscriptos dejarán de tener lugar.")) return;
    ejecutar(() => enviar(e.currentTarget), "Clase cancelada.", recargar);
  }

  return (
    <>
      <h1>Clases</h1>
      <Mensaje mensaje={mensaje} />

      <section className="panel" aria-labelledby="titulo-alta">
        <h2 id="titulo-alta">Nueva clase</h2>
        {/* ALTA: POST /api/clases */}
        <form method="post" action="/api/clases" onSubmit={alta} noValidate>
          <fieldset>
            <legend>Datos de la clase</legend>
            <CamposClase prefijo="alta" instructores={instructores} />
          </fieldset>
          <button type="submit">Crear clase</button>
        </form>
      </section>

      <section className="panel" aria-labelledby="titulo-listado">
        <h2 id="titulo-listado">Agenda de clases</h2>

        <form className="busqueda" role="search" aria-label="Filtrar clases" onSubmit={(e) => e.preventDefault()}>
          <Campo
            id="buscar-clase"
            etiqueta="Buscar actividad o instructor"
            type="search"
            value={filtro.texto}
            onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
          />
          <Campo
            id="filtro-estado"
            etiqueta="Mostrar"
            as="select"
            value={filtro.estado}
            onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
          >
            <option value="activas">Clases activas</option>
            <option value="canceladas">Clases canceladas</option>
            <option value="todas">Todas</option>
          </Campo>
          <div className="campo">
            <label className="opcion" htmlFor="solo-cupo">
              <input
                id="solo-cupo"
                type="checkbox"
                checked={filtro.soloConCupo}
                onChange={(e) => setFiltro({ ...filtro, soloConCupo: e.target.checked })}
              />
              Solo con lugares libres
            </label>
          </div>
        </form>

        <Estado
          cargando={cargando}
          error={error}
          recargar={recargar}
          vacio={visibles.length === 0}
          textoVacio="No hay clases que coincidan con el filtro."
        >
          <Tabla titulo="Clases programadas" columnas={["Actividad", "Horario", "Instructor", "Cupos", "Estado", "Acciones"]}>
            {visibles.map((c) => (
              <tr key={c.id}>
                <td data-label="Actividad">{c.actividad}</td>
                <td data-label="Horario">{formatoFechaHora(c.horario)}</td>
                <td data-label="Instructor">{c.instructorNombre}</td>
                <td data-label="Cupos">
                  <span className={"etiqueta" + (c.cuposDisponibles > 0 ? "" : " baja")}>
                    {c.cuposDisponibles > 0 ? c.cuposDisponibles + " de " + c.capacidad + " libres" : "Sin cupo"}
                  </span>
                </td>
                <td data-label="Estado">
                  <span className={"etiqueta" + (c.activa ? "" : " baja")}>{c.activa ? "Activa" : "Cancelada"}</span>
                </td>
                <td className="acciones">
                  <button type="button" className="secundario" onClick={() => setInscriptos(c)}>
                    Inscriptos<span className="solo-lectores"> de {c.actividad}</span>
                  </button>
                  {c.activa && (
                    <>
                      <button type="button" className="secundario" onClick={() => abrirEdicion(c)}>
                        Editar<span className="solo-lectores"> {c.actividad}</span>
                      </button>
                      {/* DELETE /api/clases/{id} */}
                      <form method="post" data-metodo="DELETE" action={"/api/clases/" + c.id} onSubmit={(e) => cancelar(e, c)}>
                        <button type="submit" className="peligro">
                          Cancelar<span className="solo-lectores"> clase {c.actividad}</span>
                        </button>
                      </form>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      {/* MODIFICACION: PUT /api/clases/{id} */}
      <Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar clase">
        {editando && (
          <form key={editando.id} method="post" data-metodo="PUT" action={"/api/clases/" + editando.id} onSubmit={modificar} noValidate>
            <Mensaje mensaje={mensaje} />
            <CamposClase prefijo="editar" clase={editando} instructores={instructores} />
            <div className="botonera">
              <button type="submit">Guardar cambios</button>
              <button type="button" className="secundario" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Dialogo>

      <Dialogo abierto={inscriptos !== null} onCerrar={() => setInscriptos(null)} titulo="Inscriptos a la clase" grande>
        {inscriptos && <InscriptosClase clase={inscriptos} alCambiar={recargar} />}
        <div className="botonera">
          <button type="button" className="secundario" onClick={() => setInscriptos(null)}>
            Cerrar
          </button>
        </div>
      </Dialogo>
    </>
  );
}
