import { useState } from "react";
import { enviar } from "../js/api.js";
import { datosDetalleEmpleado, listarEmpleados, nombreRol, obtenerEmpleado } from "../js/empleados.js";
import { formatoFecha } from "../js/formatos.js";
import { PATRON_DNI, PATRON_NOMBRE, PATRON_TELEFONO, PATRON_USUARIO, validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Detalle from "../componentes/Detalle.jsx";
import Dialogo from "../componentes/Dialogo.jsx";
import Estado from "../componentes/Estado.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Tabla from "../componentes/Tabla.jsx";

/** Campos personales del empleado (alta y edicion). */
function CamposEmpleado({ prefijo, empleado = {}, conCredenciales = false }) {
  return (
    <div className="campos">
      {conCredenciales && (
        <Campo
          id={prefijo + "-dni"}
          etiqueta="DNI"
          name="dni"
          required
          pattern={PATRON_DNI}
          inputMode="numeric"
          autoComplete="off"
          ayuda="7 u 8 números, sin puntos."
          data-mensaje-error="Escribí el DNI con 7 u 8 números, sin puntos ni letras."
        />
      )}
      <Campo id={prefijo + "-nombre"} etiqueta="Nombre" name="nombre" required minLength={2} maxLength={100} defaultValue={empleado.nombre} pattern={PATRON_NOMBRE} data-mensaje-error="Escribí el nombre: al menos 2 letras, sin números." />
      <Campo id={prefijo + "-apellido"} etiqueta="Apellido" name="apellido" required minLength={2} maxLength={100} defaultValue={empleado.apellido} pattern={PATRON_NOMBRE} data-mensaje-error="Escribí el apellido: al menos 2 letras, sin números." />
      <Campo
        id={prefijo + "-email"}
        etiqueta="Email"
        name="email"
        type="email"
        required
        maxLength={150}
        defaultValue={empleado.email}
        data-mensaje-error="Escribí un email válido, por ejemplo nombre@correo.com."
      />
      <Campo
        id={prefijo + "-telefono"}
        etiqueta="Teléfono"
        name="telefono"
        type="tel"
        pattern={PATRON_TELEFONO}
        defaultValue={empleado.telefono ?? ""}
        ayuda="Opcional."
        data-mensaje-error="El teléfono debe tener entre 8 y 20 caracteres: números, espacios, + o guiones."
      />
      <Campo id={prefijo + "-rol"} etiqueta="Rol" as="select" name="rol" required defaultValue={empleado.rol ?? "EMPLEADO"}>
        <option value="EMPLEADO">Empleado</option>
        <option value="ADMIN">Administrador</option>
      </Campo>
      {conCredenciales && (
        <>
          <Campo
            id={prefijo + "-usuario"}
            etiqueta="Usuario"
            name="usuario"
            required
            pattern={PATRON_USUARIO}
            autoComplete="off"
            ayuda="De 3 a 30 caracteres: letras, números, punto, guion o guion bajo."
            data-mensaje-error="El usuario debe tener de 3 a 30 caracteres: letras, números, punto, guion o guion bajo."
          />
          <Campo
            id={prefijo + "-password"}
            etiqueta="Contraseña"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            ayuda="Al menos 6 caracteres."
            data-mensaje-error="La contraseña debe tener al menos 6 caracteres."
          />
        </>
      )}
    </div>
  );
}

/** Pantalla de empleados: alta, detalle, edicion y baja. */
export default function Empleados() {
  useTitulo("Empleados");
  const { datos: empleados, cargando, error, recargar } = useDatos(listarEmpleados);
  const { mensaje, avisarError, limpiar, ejecutar } = useMensaje();
  const [detalle, setDetalle] = useState(null);
  const [editando, setEditando] = useState(null);

  // Al abrir la ventana se limpia el mensaje anterior: ahi adentro solo se ve lo que pase en ella.
  function abrirEdicion(empleado) {
    limpiar();
    setEditando(empleado);
  }

  function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form), (emp) => "Empleado " + emp.usuario + " creado.", () => {
      form.reset();
      return recargar();
    });
  }

  function modificar(e) {
    e.preventDefault();
    if (!validarFormulario(e.currentTarget)) return;
    ejecutar(() => enviar(e.currentTarget), "Empleado actualizado.", () => {
      setEditando(null);
      return recargar();
    });
  }

  function baja(e, emp) {
    e.preventDefault();
    if (!window.confirm("¿Dar de baja a " + emp.nombre + " " + emp.apellido + "?")) return;
    ejecutar(() => enviar(e.currentTarget), "Empleado dado de baja.", recargar);
  }

  async function verDetalle(id) {
    try {
      setDetalle(await obtenerEmpleado(id));
    } catch (e) {
      avisarError(e.message);
    }
  }

  return (
    <>
      <h1>Empleados</h1>
      <Mensaje mensaje={mensaje} />

      <section className="panel" aria-labelledby="titulo-alta">
        <h2 id="titulo-alta">Alta de empleado</h2>
        {/* ALTA: POST /api/empleados */}
        <form method="post" action="/api/empleados" onSubmit={alta} noValidate>
          <fieldset>
            <legend>Datos del empleado</legend>
            <CamposEmpleado prefijo="alta" conCredenciales />
          </fieldset>
          <button type="submit">Dar de alta</button>
        </form>
      </section>

      <section className="panel" aria-labelledby="titulo-listado">
        <h2 id="titulo-listado">Listado de empleados</h2>
        <p>
          <button type="button" className="secundario" onClick={recargar}>
            Actualizar listado
          </button>
        </p>
        <Estado cargando={cargando} error={error} recargar={recargar} vacio={empleados.length === 0} textoVacio="No hay empleados cargados.">
          <Tabla titulo="Empleados registrados" columnas={["Nombre", "Usuario", "Rol", "Estado", "Alta", "Acciones"]}>
            {empleados.map((emp) => (
              <tr key={emp.id}>
                <td data-label="Nombre">
                  {emp.nombre} {emp.apellido}
                </td>
                <td data-label="Usuario">{emp.usuario}</td>
                <td data-label="Rol">{nombreRol(emp.rol)}</td>
                <td data-label="Estado">
                  <span className={"etiqueta" + (emp.activo ? "" : " baja")}>{emp.activo ? "Activo" : "Baja"}</span>
                </td>
                <td data-label="Alta">{formatoFecha(emp.fechaAlta)}</td>
                <td className="acciones">
                  {/* DETALLE: GET /api/empleados/{id} */}
                  <button type="button" className="secundario" onClick={() => verDetalle(emp.id)}>
                    Ver<span className="solo-lectores"> {emp.nombre} {emp.apellido}</span>
                  </button>
                  <button type="button" className="secundario" onClick={() => abrirEdicion(emp)}>
                    Editar<span className="solo-lectores"> {emp.nombre} {emp.apellido}</span>
                  </button>
                  {emp.activo && (
                    /* DELETE /api/empleados/{id} (baja logica) */
                    <form method="post" data-metodo="DELETE" action={"/api/empleados/" + emp.id} onSubmit={(e) => baja(e, emp)}>
                      <button type="submit" className="peligro">
                        Baja<span className="solo-lectores"> de {emp.nombre} {emp.apellido}</span>
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      <Dialogo abierto={detalle !== null} onCerrar={() => setDetalle(null)} titulo="Detalle del empleado">
        {detalle && <Detalle datos={datosDetalleEmpleado(detalle)} />}
        <button type="button" className="secundario" onClick={() => setDetalle(null)}>
          Cerrar
        </button>
      </Dialogo>

      {/* MODIFICACION: PUT /api/empleados/{id} */}
      <Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar empleado">
        {editando && (
          <form key={editando.id} method="post" data-metodo="PUT" action={"/api/empleados/" + editando.id} onSubmit={modificar} noValidate>
            <Mensaje mensaje={mensaje} />
            <CamposEmpleado prefijo="editar" empleado={editando} />
            <div className="botonera">
              <button type="submit">Guardar cambios</button>
              <button type="button" className="secundario" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Dialogo>
    </>
  );
}
