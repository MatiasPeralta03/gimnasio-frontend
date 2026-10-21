import { useEffect, useState } from "react";
import { enviar, obtener } from "../api.js";
import Dialogo from "../componentes/Dialogo.jsx";
import Detalle from "../componentes/Detalle.jsx";

function CamposProducto({ producto = {} }) {
  return (
    <>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" name="nombre" type="text" required maxLength="100" defaultValue={producto.nombre} />

      <label htmlFor="precio">Precio</label>
      <input id="precio" name="precio" type="number" min="0" step="0.01" required defaultValue={producto.precio} />

      <label htmlFor="stock">Stock</label>
      <input id="stock" name="stock" type="number" min="0" step="1" required defaultValue={producto.stock} />
    </>
  );
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: "", error: false });
  const [detalle, setDetalle] = useState(null);
  const [editando, setEditando] = useState(null);

  const avisar = (texto, error = false) => setMensaje({ texto, error });

  async function cargar() {
    try {
      setProductos(await obtener("/api/productos"));
    } catch (e) {
      avisar(e.message, true);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await enviar(form);
      avisar("Producto agregado.");
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
      avisar("Producto actualizado.");
      cargar();
    } catch (err) {
      avisar(err.message, true);
    }
  }

  async function borrar(e, producto) {
    e.preventDefault();
    if (!window.confirm("Borrar el producto " + producto.nombre + "?")) return;
    try {
      await enviar(e.currentTarget);
      avisar("Producto borrado.");
      cargar();
    } catch (err) {
      avisar(err.message, true);
    }
  }

  async function verDetalle(id) {
    try {
      setDetalle(await obtener("/api/productos/" + id));
    } catch (e) {
      avisar(e.message, true);
    }
  }

  return (
    <>
      <h2>Productos del kiosco</h2>
      <p className={"mensaje" + (mensaje.error ? " error" : "")} role="status">{mensaje.texto}</p>

      {/* ALTA: POST /api/productos */}
      <section aria-labelledby="titulo-alta">
        <h3 id="titulo-alta">Nuevo producto</h3>
        <form method="post" action="/api/productos" onSubmit={alta}>
          <fieldset>
            <legend>Datos del producto</legend>
            <CamposProducto />
          </fieldset>
          <button type="submit">Agregar producto</button>
        </form>
      </section>

      {/* LISTADO: GET /api/productos */}
      <section aria-labelledby="titulo-listado">
        <h3 id="titulo-listado">Listado de productos</h3>
        <p><button type="button" className="secundario" onClick={cargar}>Actualizar listado</button></p>
        <div className="contenedor-tabla">
          <table>
            <caption>Productos disponibles</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 && (
                <tr><td colSpan="5">No hay productos cargados.</td></tr>
              )}
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>$ {p.precio}</td>
                  <td>{p.stock}</td>
                  <td className="acciones">
                    {/* DETALLE: GET /api/productos/{id} */}
                    <button type="button" className="secundario" onClick={() => verDetalle(p.id)}>Ver</button>
                    <button type="button" className="secundario" onClick={() => setEditando(p)}>Editar</button>

                    {/* DELETE /api/productos/{id} */}
                    <form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id} onSubmit={(e) => borrar(e, p)}>
                      <button type="submit" className="peligro">Borrar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialogo abierto={detalle !== null} onCerrar={() => setDetalle(null)} titulo="Detalle del producto">
        {detalle && (
          <Detalle
            datos={[["ID", detalle.id], ["Nombre", detalle.nombre], ["Precio", "$ " + detalle.precio], ["Stock", detalle.stock]]}
          />
        )}
        <button type="button" className="secundario" onClick={() => setDetalle(null)}>Cerrar</button>
      </Dialogo>

      {/* MODIFICACION: PUT /api/productos/{id} */}
      <Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar producto">
        {editando && (
          <form key={editando.id} method="post" data-metodo="PUT" action={"/api/productos/" + editando.id} onSubmit={modificar}>
            <CamposProducto producto={editando} />
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
