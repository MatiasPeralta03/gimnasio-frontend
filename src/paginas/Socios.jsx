import { useState } from "react";
import { enviar } from "../js/api.js";
import { formatoPrecio } from "../js/formatos.js";
import { nombreDeMembresia, precioDeMembresia } from "../js/membresias.js";
import {
  datosDetalleSocio,
  estadoDeSocio,
  filtrarSocios,
  listarSocios,
  nombreCompleto,
  obtenerSocio,
} from "../js/socios.js";
import { validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Casilla from "../componentes/Casilla.jsx";
import CamposSocio from "../componentes/CamposSocio.jsx";
import Detalle from "../componentes/Detalle.jsx";
import Dialogo from "../componentes/Dialogo.jsx";
import Estado from "../componentes/Estado.jsx";
import FormPago from "../componentes/FormPago.jsx";
import HistorialSocio from "../componentes/HistorialSocio.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import { Link } from "react-router-dom";
import Tabla from "../componentes/Tabla.jsx";

/*
 * Pantalla de socios. Este archivo arma el HTML y decide los mensajes que se muestran;
 * las consultas, filtros y formatos estan en src/js/socios.js.
 * Cada <form> declara su metodo HTTP y su URL (method/action/data-metodo).
 */
export default function Socios() {
  useTitulo("Socios");
  const { datos: socios, cargando, error, recargar } = useDatos(listarSocios);
  const { mensaje, avisarError, ejecutar } = useMensaje();
  const [filtro, setFiltro] = useState({ texto: "", estado: "todos" });
  const [detalle, setDetalle] = useState(null);
  const [editando, setEditando] = useState(null);
  const [cobro, setCobro] = useState(null); // { socio, concepto }
  const [historial, setHistorial] = useState(null);

  const visibles = filtrarSocios(socios, filtro);

  function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form), (s) => "Socio creado. PIN asignado: " + s.pin, () => {
      form.reset();
      return recargar();
    });
  }

  function modificar(e) {
    e.preventDefault();
    if (!validarFormulario(e.currentTarget)) return;
    ejecutar(() => enviar(e.currentTarget), "Socio actualizado.", () => {
      setEditando(null);
      return recargar();
    });
  }

  function accionDelSocio(e, textoExito, confirmacion) {
    e.preventDefault();
    if (confirmacion && !window.confirm(confirmacion)) return;
    ejecutar(() => enviar(e.currentTarget), textoExito, recargar);
  }

  function cobrar(form) {
    ejecutar(() => enviar(form), form.dataset.ok, () => {
      setCobro(null);
      return recargar();
    });
  }

  async function verDetalle(id) {
    try {
      setDetalle(await obtenerSocio(id));
    } catch (e) {
      avisarError(e.message);
    }
  }

  return (
    <>
      <h1>Socios</h1>
      <Mensaje mensaje={mensaje} />

      <section className="panel" aria-labelledby="titulo-alta">
        <h2 id="titulo-alta">Alta de socio</h2>
        {/* ALTA: POST /api/socios */}
        <form method="post" action="/api/socios" onSubmit={alta} noValidate>
          <fieldset>
            <legend>Datos del socio</legend>
            <CamposSocio prefijo="alta" conDni />
          </fieldset>
          <Casilla id="alta-privacidad" required data-mensaje-error="Para registrarte tenes que aceptar la politica de privacidad.">
            Acepto la <Link to="/privacidad">politica de privacidad</Link> (uso de mis datos).
          </Casilla>
          <button type="submit">Dar de alta</button>
        </form>
      </section>

      <section aria-labelledby="titulo-listado">
        <h2 id="titulo-listado">Listado de socios</h2>

        {/* FILTROS: se aplican en el navegador sobre los socios ya cargados */}
        <form className="busqueda" role="search" aria-label="Buscar socios" onSubmit={(e) => e.preventDefault()}>
          <Campo
            id="buscar-socio"
            etiqueta="Buscar por nombre o DNI"
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
            <option value="todos">Todos</option>
            <option value="activos">Dados de alta (activos)</option>
            <option value="bajas">Dados de baja</option>
          </Campo>
          <div className="campo">
            <button type="button" className="secundario" onClick={recargar}>
              Actualizar listado
            </button>
          </div>
        </form>

        <p aria-live="polite" className="ayuda">
          {!cargando && !error && visibles.length + " de " + socios.length + " socios"}
        </p>

        <Estado
          cargando={cargando}
          error={error}
          recargar={recargar}
          vacio={visibles.length === 0}
          textoVacio="No hay socios que coincidan con la busqueda."
        >
          <Tabla titulo="Socios registrados" columnas={["ID", "DNI", "Nombre", "Membresia", "Estado", "Deuda", "Acciones"]}>
            {visibles.map((s) => (
              <tr key={s.id}>
                <td data-label="ID">{s.id}</td>
                <td data-label="DNI">{s.dni}</td>
                <td data-label="Nombre">{nombreCompleto(s)}</td>
                <td data-label="Membresia">{nombreDeMembresia(s.membresia)}</td>
                <td data-label="Estado">
                  <span className={"etiqueta" + (s.activo ? "" : " baja")}>{estadoDeSocio(s)}</span>
                </td>
                <td data-label="Deuda">{formatoPrecio(s.deuda)}</td>
                <td className="acciones">
                  {/* DETALLE: GET /api/socios/{id} */}
                  <button type="button" className="secundario" onClick={() => verDetalle(s.id)}>
                    Ver<span className="solo-lectores"> {nombreCompleto(s)}</span>
                  </button>
                  <button type="button" className="secundario" onClick={() => setHistorial(s)}>
                    Historial<span className="solo-lectores"> de {nombreCompleto(s)}</span>
                  </button>
                  <button type="button" className="secundario" onClick={() => setEditando(s)}>
                    Editar<span className="solo-lectores"> {nombreCompleto(s)}</span>
                  </button>
                  {s.activo && (
                    <button type="button" className="secundario" onClick={() => setCobro({ socio: s, concepto: "CUOTA" })}>
                      Cobrar cuota<span className="solo-lectores"> a {nombreCompleto(s)}</span>
                    </button>
                  )}
                  {s.deuda > 0 && (
                    <button type="button" className="secundario" onClick={() => setCobro({ socio: s, concepto: "DEUDA" })}>
                      Pagar deuda<span className="solo-lectores"> de {nombreCompleto(s)}</span>
                    </button>
                  )}

                  {/* PUT /api/socios/{id}/pin */}
                  <form
                    method="post"
                    data-metodo="PUT"
                    action={"/api/socios/" + s.id + "/pin"}
                    onSubmit={(e) => accionDelSocio(e, (r) => "Nuevo PIN de " + r.nombre + ": " + r.pin)}
                  >
                    <button type="submit" className="secundario">
                      Nuevo PIN<span className="solo-lectores"> de {nombreCompleto(s)}</span>
                    </button>
                  </form>

                  {s.activo ? (
                    /* DELETE /api/socios/{id} (baja logica) */
                    <form
                      method="post"
                      data-metodo="DELETE"
                      action={"/api/socios/" + s.id}
                      onSubmit={(e) => accionDelSocio(e, "Socio dado de baja.", "Dar de baja a " + nombreCompleto(s) + "?")}
                    >
                      <button type="submit" className="peligro">
                        Baja<span className="solo-lectores"> de {nombreCompleto(s)}</span>
                      </button>
                    </form>
                  ) : (
                    /* PUT /api/socios/{id}/reactivar */
                    <form
                      method="post"
                      data-metodo="PUT"
                      action={"/api/socios/" + s.id + "/reactivar"}
                      onSubmit={(e) => accionDelSocio(e, (r) => "Socio " + r.nombre + " dado de alta nuevamente.")}
                    >
                      <button type="submit">
                        Dar de alta<span className="solo-lectores"> a {nombreCompleto(s)}</span>
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      <Dialogo abierto={detalle !== null} onCerrar={() => setDetalle(null)} titulo="Detalle del socio">
        {detalle && <Detalle datos={datosDetalleSocio(detalle)} />}
        <button type="button" className="secundario" onClick={() => setDetalle(null)}>
          Cerrar
        </button>
      </Dialogo>

      {/* MODIFICACION: PUT /api/socios/{id} */}
      <Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar socio">
        {editando && (
          <form key={editando.id} method="post" data-metodo="PUT" action={"/api/socios/" + editando.id} onSubmit={modificar} noValidate>
            <CamposSocio prefijo="editar" socio={editando} />
            <div className="botonera">
              <button type="submit">Guardar cambios</button>
              <button type="button" className="secundario" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Dialogo>

      {/* COBRO DE CUOTA / PAGO DE DEUDA: POST /api/pagos */}
      <Dialogo
        abierto={cobro !== null}
        onCerrar={() => setCobro(null)}
        titulo={cobro?.concepto === "DEUDA" ? "Pagar deuda" : "Cobrar cuota"}
      >
        {cobro && (
          <>
            <p>
              Socio: {nombreCompleto(cobro.socio)} |{" "}
              {cobro.concepto === "DEUDA"
                ? "Deuda actual: " + formatoPrecio(cobro.socio.deuda)
                : "Membresia: " + nombreDeMembresia(cobro.socio.membresia)}
            </p>
            <FormPago
              key={cobro.socio.id + cobro.concepto}
              socio={cobro.socio}
              concepto={cobro.concepto}
              montoInicial={cobro.concepto === "DEUDA" ? cobro.socio.deuda : precioDeMembresia(cobro.socio.membresia)}
              montoMaximo={cobro.concepto === "DEUDA" ? cobro.socio.deuda : undefined}
              textoExito={cobro.concepto === "DEUDA" ? "Pago de deuda registrado." : "Cuota cobrada a " + nombreCompleto(cobro.socio) + "."}
              onEnviar={cobrar}
              onCancelar={() => setCobro(null)}
            />
          </>
        )}
      </Dialogo>

      <Dialogo abierto={historial !== null} onCerrar={() => setHistorial(null)} titulo={historial ? "Historial de " + nombreCompleto(historial) : ""} grande>
        {historial && <HistorialSocio socioId={historial.id} />}
        <div className="botonera">
          <button type="button" className="secundario" onClick={() => setHistorial(null)}>
            Cerrar
          </button>
        </div>
      </Dialogo>
    </>
  );
}
