import { useCallback } from "react";
import Campo from "./Campo.jsx";
import Estado from "./Estado.jsx";
import Mensaje from "./Mensaje.jsx";
import Tabla from "./Tabla.jsx";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import { enviar } from "../js/api.js";
import { cuposDeClase, listarClases, listarInscriptos, listarSociosActivos } from "../js/clases.js";
import { formatoFechaHora } from "../js/formatos.js";
import { validarFormulario } from "../js/validaciones.js";

/** Contenido de la ventana de inscriptos: anotar un socio y cancelar inscripciones de una clase. */
export default function InscriptosClase({ clase, alCambiar }) {
  const cargarInscriptos = useCallback(async () => (await listarInscriptos(clase.id)).filter((i) => i.estado === "ACTIVA"), [clase.id]);
  const cargarCupos = useCallback(async () => (await listarClases()).find((c) => c.id === clase.id) ?? clase, [clase]);
  const inscriptos = useDatos(cargarInscriptos);
  const socios = useDatos(listarSociosActivos);
  const cupos = useDatos(cargarCupos, clase);
  const { mensaje, ejecutar } = useMensaje();

  const refrescar = async () => {
    await Promise.all([inscriptos.recargar(), cupos.recargar()]);
    alCambiar();
  };

  function inscribir(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form), (r) => r.socioNombre + " inscripto en la clase.", async () => {
      form.reset();
      await refrescar();
    });
  }

  function cancelar(e, inscripcion) {
    e.preventDefault();
    if (!window.confirm("Cancelar la inscripcion de " + inscripcion.socioNombre + "?")) return;
    ejecutar(() => enviar(e.currentTarget), "Inscripcion cancelada.", refrescar);
  }

  return (
    <>
      <p>
        {clase.actividad} - {formatoFechaHora(clase.horario)} hs. <strong>{cuposDeClase(cupos.datos)}</strong>
      </p>
      <Mensaje mensaje={mensaje} />

      {/* INSCRIBIR: POST /api/inscripciones */}
      <form method="post" action="/api/inscripciones" onSubmit={inscribir} noValidate>
        <input type="hidden" name="claseId" value={clase.id} />
        <Campo
          id="inscribir-socio"
          etiqueta="Socio a inscribir"
          as="select"
          name="socioId"
          required
          data-mensaje-error="Elegi un socio de la lista."
        >
          <option value="">Elegi un socio...</option>
          {socios.datos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.apellido}, {s.nombre} (DNI {s.dni})
            </option>
          ))}
        </Campo>
        <button type="submit" disabled={!clase.activa || cupos.datos.cuposDisponibles <= 0}>
          Inscribir
        </button>
        {cupos.datos.cuposDisponibles <= 0 && <p className="ayuda">La clase no tiene cupo.</p>}
      </form>

      <h3>Inscriptos</h3>
      <Estado
        cargando={inscriptos.cargando}
        error={inscriptos.error}
        recargar={inscriptos.recargar}
        vacio={inscriptos.datos.length === 0}
        textoVacio="Todavia no hay inscriptos."
      >
        <Tabla titulo="Socios inscriptos" columnas={["Socio", "Inscripto el", "Acciones"]}>
          {inscriptos.datos.map((i) => (
            <tr key={i.id}>
              <td data-label="Socio">{i.socioNombre}</td>
              <td data-label="Inscripto el">{formatoFechaHora(i.fechaInscripcion)}</td>
              <td className="acciones">
                {/* DELETE /api/inscripciones/{id} */}
                <form method="post" data-metodo="DELETE" action={"/api/inscripciones/" + i.id} onSubmit={(e) => cancelar(e, i)}>
                  <button type="submit" className="peligro">
                    Cancelar<span className="solo-lectores"> inscripcion de {i.socioNombre}</span>
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </Tabla>
      </Estado>
    </>
  );
}
