import { useState } from "react";
import { Link } from "react-router-dom";
import { enviar } from "../js/api.js";
import { formatoPrecio } from "../js/formatos.js";
import { nombreDeMembresia } from "../js/membresias.js";
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
import Mensaje from "../componentes/Mensaje.jsx";
import Tabla from "../componentes/Tabla.jsx";

/*
 * Pantalla de socios. Este archivo arma el HTML y decide los mensajes que se muestran;
 * las consultas, filtros y formatos estan en src/js/socios.js.
 * Cada <form> declara su metodo HTTP y su URL (method/action/data-metodo).
 */
export default function Socios() {
  useTitulo("Socios");
  const { datos: socios, cargando, error, recargar } = useDatos(listarSocios);
  const { mensaje, avisarError, limpiar, ejecutar } = useMensaje();
  const [filtro, setFiltro] = useState({ texto: "", estado: "todos" });
  const [detalle, setDetalle] = useState(null);
  const [editando, setEditando] = useState(null);
  const [pagando, setPagando] = useState(null);

  const visibles = filtrarSocios(socios, filtro);

  // Al abrir una ventana se limpia el mensaje anterior: ahi adentro solo se ve lo que pase en ella.
  function abrirEdicion(socio) {
    limpiar();
    setEditando(socio);
  }

  function abrirPago(socio) {
    limpiar();
    setPagando(socio);
  }

  function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form), (s) => "Socio " + nombreCompleto(s) + " creado.", () => {
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

  function pagarDeuda(form) {
    ejecutar(() => enviar(form), "Pago de deuda registrado.", () => {
      setPagando(null);
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
          <Casilla id="alta-politicas" required data-mensaje-error="Para registrar al socio, tiene que aceptar las políticas.">
            El socio aceptó las{" "}
            <Link to="/politicas" target="_blank">
              políticas de seguridad y privacidad (se abre en otra pestaña)
            </Link>
            .
          </Casilla>
          <button type="submit">Dar de alta</button>
        </form>
      </section>

      <section className="panel" aria-labelledby="titulo-listado">
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
        </form>

        <p aria-live="polite" className="ayuda">
          {!cargando && !error && visibles.length + " de " + socios.length + " socios"}
        </p>

        <Estado
          cargando={cargando}
          error={error}
          recargar={recargar}
          vacio={visibles.length === 0}
          textoVacio="No hay socios que coincidan con la búsqueda."
        >
          <Tabla titulo="Socios registrados" columnas={["DNI", "Nombre", "Membresía", "Estado", "Deuda", "Acciones"]}>
            {visibles.map((s) => (
              <tr key={s.id}>
                <td data-label="DNI">{s.dni}</td>
                <td data-label="Nombre">{nombreCompleto(s)}</td>
                <td data-label="Membresía">{nombreDeMembresia(s.membresia)}</td>
                <td data-label="Estado">
                  <span className={"etiqueta" + (s.activo ? "" : " baja")}>{estadoDeSocio(s)}</span>
                </td>
                <td data-label="Deuda">
                  {s.deuda > 0 ? <span className="etiqueta alerta">{formatoPrecio(s.deuda)}</span> : formatoPrecio(s.deuda)}
                </td>
                <td className="acciones">
                  {/* DETALLE: GET /api/socios/{id} */}
                  <button type="button" className="secundario" onClick={() => verDetalle(s.id)}>
                    Ver<span className="solo-lectores"> {nombreCompleto(s)}</span>
                  </button>
                  <button type="button" className="secundario" onClick={() => abrirEdicion(s)}>
                    Editar<span className="solo-lectores"> {nombreCompleto(s)}</span>
                  </button>
                  {s.deuda > 0 && (
                    <button type="button" className="secundario" onClick={() => abrirPago(s)}>
                      Pagar deuda<span className="solo-lectores"> de {nombreCompleto(s)}</span>
                    </button>
                  )}

                  {s.activo ? (
                    /* DELETE /api/socios/{id} (baja logica) */
                    <form
                      method="post"
                      data-metodo="DELETE"
                      action={"/api/socios/" + s.id}
                      onSubmit={(e) => accionDelSocio(e, "Socio dado de baja.", "¿Dar de baja a " + nombreCompleto(s) + "?")}
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
            <Mensaje mensaje={mensaje} />
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

      {/* PAGO DE DEUDA: POST /api/pagos */}
      <Dialogo abierto={pagando !== null} onCerrar={() => setPagando(null)} titulo="Pagar deuda">
        {pagando && (
          <>
            <Mensaje mensaje={mensaje} />
            <p>
              Socio: {nombreCompleto(pagando)} | Deuda actual: {formatoPrecio(pagando.deuda)}
            </p>
            <FormPago key={pagando.id} socio={pagando} onEnviar={pagarDeuda} onCancelar={() => setPagando(null)} />
          </>
        )}
      </Dialogo>
    </>
  );
}
