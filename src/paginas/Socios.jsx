import { useEffect, useState } from "react";
import { enviar, obtener } from "../api.js";
import Dialogo from "../componentes/Dialogo.jsx";
import Detalle from "../componentes/Detalle.jsx";

function CamposSocio({ socio = {}, conDni }) {
  return (
    <>
      {conDni && (
        <>
          <label htmlFor="dni">DNI</label>
          <input id="dni" name="dni" type="text" required maxLength="20" />
        </>
      )}
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" name="nombre" type="text" required maxLength="100" defaultValue={socio.nombre} />

      <label htmlFor="apellido">Apellido</label>
      <input id="apellido" name="apellido" type="text" required maxLength="100" defaultValue={socio.apellido} />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required maxLength="150" defaultValue={socio.email} />

      <label htmlFor="telefono">Telefono</label>
      <input id="telefono" name="telefono" type="tel" maxLength="30" defaultValue={socio.telefono ?? ""} />

      <label htmlFor="membresia">Membresia</label>
      <select id="membresia" name="membresia" required defaultValue={socio.membresia ?? "MENSUAL"}>
        <option value="MENSUAL">Mensual</option>
        <option value="TRIMESTRAL">Trimestral</option>
        <option value="ANUAL">Anual</option>
      </select>

      <label htmlFor="medioPago">Medio de pago</label>
      <select id="medioPago" name="medioPago" required defaultValue={socio.medioPago ?? "EFECTIVO"}>
        <option value="EFECTIVO">Efectivo</option>
        <option value="TRANSFERENCIA">Transferencia</option>
      </select>
    </>
  );
}

export default function Socios() {
  const [socios, setSocios] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: "", error: false });
  const [detalle, setDetalle] = useState(null);
  const [editando, setEditando] = useState(null);

  const avisar = (texto, error = false) => setMensaje({ texto, error });

  async function cargar() {
    try {
      setSocios(await obtener("/api/socios"));
    } catch (e) {
      avisar(e.message, true);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  // Cada handler envia el <form> tal cual lo declara el HTML (metodo + action).
  async function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      const socio = await enviar(form);
      avisar("Socio creado. PIN asignado: " + socio.pin);
      form.reset();
      cargar();
    } catch (err) {
      avisar(err.message, true);
    }
  }

  async function modificar(e) {
    e.preventDefault();
    try {
      await enviar(e.currentTarget);
      setEditando(null);
      avisar("Socio actualizado.");
      cargar();
    } catch (err) {
      avisar(err.message, true);
    }
  }

  async function nuevoPin(e) {
    e.preventDefault();
    try {
      const socio = await enviar(e.currentTarget);
      avisar("Nuevo PIN de " + socio.nombre + ": " + socio.pin);
    } catch (err) {
      avisar(err.message, true);
    }
  }

  async function baja(e, socio) {
    e.preventDefault();
    if (!window.confirm("Dar de baja a " + socio.nombre + " " + socio.apellido + "?")) return;
    try {
      await enviar(e.currentTarget);
      avisar("Socio dado de baja.");
      cargar();
    } catch (err) {
      avisar(err.message, true);
    }
  }

  async function verDetalle(id) {
    try {
      setDetalle(await obtener("/api/socios/" + id));
    } catch (e) {
      avisar(e.message, true);
    }
  }

  return (
    <>
      <h2>Socios</h2>
      <p className={"mensaje" + (mensaje.error ? " error" : "")} role="status">{mensaje.texto}</p>

      {/* ALTA: POST /api/socios */}
      <section aria-labelledby="titulo-alta">
        <h3 id="titulo-alta">Alta de socio</h3>
        <form method="post" action="/api/socios" onSubmit={alta}>
          <fieldset>
            <legend>Datos del socio</legend>
            <CamposSocio conDni />
          </fieldset>
          <button type="submit">Dar de alta</button>
        </form>
      </section>

      {/* LISTADO: GET /api/socios */}
      <section aria-labelledby="titulo-listado">
        <h3 id="titulo-listado">Listado de socios</h3>
        <p><button type="button" className="secundario" onClick={cargar}>Actualizar listado</button></p>
        <div className="contenedor-tabla">
          <table>
            <caption>Socios registrados</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">DNI</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Membresia</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.length === 0 && (
                <tr><td colSpan="7">No hay socios cargados.</td></tr>
              )}
              {socios.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.dni}</td>
                  <td>{s.nombre}</td>
                  <td>{s.apellido}</td>
                  <td>{s.membresia}</td>
                  <td>{s.activo ? "Activo" : "Baja"}</td>
                  <td className="acciones">
                    {/* DETALLE: GET /api/socios/{id} */}
                    <button type="button" className="secundario" onClick={() => verDetalle(s.id)}>Ver</button>
                    <button type="button" className="secundario" onClick={() => setEditando(s)}>Editar</button>

                    {/* PUT /api/socios/{id}/pin */}
                    <form method="post" data-metodo="PUT" action={"/api/socios/" + s.id + "/pin"} onSubmit={nuevoPin}>
                      <button type="submit" className="secundario">Nuevo PIN</button>
                    </form>

                    {/* DELETE /api/socios/{id} (baja logica) */}
                    <form method="post" data-metodo="DELETE" action={"/api/socios/" + s.id} onSubmit={(e) => baja(e, s)}>
                      <button type="submit" className="peligro">Baja</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialogo abierto={detalle !== null} onCerrar={() => setDetalle(null)} titulo="Detalle del socio">
        {detalle && (
          <Detalle
            datos={[
              ["ID", detalle.id], ["DNI", detalle.dni], ["PIN", detalle.pin],
              ["Nombre", detalle.nombre], ["Apellido", detalle.apellido], ["Email", detalle.email],
              ["Telefono", detalle.telefono], ["Membresia", detalle.membresia],
              ["Medio de pago", detalle.medioPago], ["Deuda", "$ " + detalle.deuda],
              ["Estado", detalle.activo ? "Activo" : "Baja"], ["Fecha de alta", detalle.fechaAlta],
            ]}
          />
        )}
        <button type="button" className="secundario" onClick={() => setDetalle(null)}>Cerrar</button>
      </Dialogo>

      {/* MODIFICACION: PUT /api/socios/{id} */}
      <Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar socio">
        {editando && (
          <form key={editando.id} method="post" data-metodo="PUT" action={"/api/socios/" + editando.id} onSubmit={modificar}>
            <CamposSocio socio={editando} />
            <div className="botonera">
              <button type="submit">Guardar cambios</button>
              <button type="button" className="secundario" onClick={() => setEditando(null)}>Cancelar</button>
            </div>
          </form>
        )}
      </Dialogo>
    </>
  );
}
