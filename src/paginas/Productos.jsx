import { useState } from "react";
import { enviar } from "../js/api.js";
import { formatoPrecio } from "../js/formatos.js";
import { datosDetalleProducto, filtrarProductos, hayStock, listarProductos, obtenerProducto } from "../js/productos.js";
import { validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Detalle from "../componentes/Detalle.jsx";
import Dialogo from "../componentes/Dialogo.jsx";
import Estado from "../componentes/Estado.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Tabla from "../componentes/Tabla.jsx";

/** Campos del producto (alta y edicion). */
function CamposProducto({ prefijo, producto = {} }) {
  return (
    <div className="campos">
      <Campo
        id={prefijo + "-nombre"}
        etiqueta="Nombre"
        name="nombre"
        required
        minLength={2}
        maxLength={100}
        defaultValue={producto.nombre}
        data-mensaje-error="Escribi el nombre del producto (al menos 2 letras)."
      />
      <Campo
        id={prefijo + "-precio"}
        etiqueta="Precio ($)"
        name="precio"
        type="number"
        min="0.01"
        step="0.01"
        required
        defaultValue={producto.precio}
        data-mensaje-error="El precio debe ser mayor a 0."
      />
      <Campo
        id={prefijo + "-stock"}
        etiqueta="Stock (unidades)"
        name="stock"
        type="number"
        min="0"
        step="1"
        required
        defaultValue={producto.stock}
        data-mensaje-error="El stock debe ser un numero entero, 0 o mayor."
      />
    </div>
  );
}

/** Pantalla de productos del kiosco: busqueda, filtro por stock, orden y ABM. */
export default function Productos() {
  useTitulo("Productos");
  const { datos: productos, cargando, error, recargar } = useDatos(listarProductos);
  const { mensaje, avisarError, ejecutar } = useMensaje();
  const [filtro, setFiltro] = useState({ texto: "", stock: "todos", orden: "nombre" });
  const [detalle, setDetalle] = useState(null);
  const [editando, setEditando] = useState(null);

  const visibles = filtrarProductos(productos, filtro);

  function alta(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(() => enviar(form), "Producto agregado.", () => {
      form.reset();
      return recargar();
    });
  }

  function modificar(e) {
    e.preventDefault();
    if (!validarFormulario(e.currentTarget)) return;
    ejecutar(() => enviar(e.currentTarget), "Producto actualizado.", () => {
      setEditando(null);
      return recargar();
    });
  }

  function borrar(e, producto) {
    e.preventDefault();
    if (!window.confirm("Borrar el producto " + producto.nombre + "?")) return;
    ejecutar(() => enviar(e.currentTarget), "Producto borrado.", recargar);
  }

  async function verDetalle(id) {
    try {
      setDetalle(await obtenerProducto(id));
    } catch (e) {
      avisarError(e.message);
    }
  }

  return (
    <>
      <h1>Productos del kiosco</h1>
      <Mensaje mensaje={mensaje} />

      <section className="panel" aria-labelledby="titulo-alta">
        <h2 id="titulo-alta">Nuevo producto</h2>
        {/* ALTA: POST /api/productos */}
        <form method="post" action="/api/productos" onSubmit={alta} noValidate>
          <fieldset>
            <legend>Datos del producto</legend>
            <CamposProducto prefijo="alta" />
          </fieldset>
          <button type="submit">Agregar producto</button>
        </form>
      </section>

      <section aria-labelledby="titulo-listado">
        <h2 id="titulo-listado">Catalogo y stock</h2>

        <form className="busqueda" role="search" aria-label="Buscar productos" onSubmit={(e) => e.preventDefault()}>
          <Campo
            id="buscar-producto"
            etiqueta="Buscar producto"
            type="search"
            value={filtro.texto}
            onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
          />
          <Campo id="filtro-stock" etiqueta="Stock" as="select" value={filtro.stock} onChange={(e) => setFiltro({ ...filtro, stock: e.target.value })}>
            <option value="todos">Todos</option>
            <option value="conStock">Con stock</option>
            <option value="sinStock">Agotados</option>
          </Campo>
          <Campo id="orden-producto" etiqueta="Ordenar por" as="select" value={filtro.orden} onChange={(e) => setFiltro({ ...filtro, orden: e.target.value })}>
            <option value="nombre">Nombre</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
          </Campo>
        </form>

        <Estado
          cargando={cargando}
          error={error}
          recargar={recargar}
          vacio={visibles.length === 0}
          textoVacio="No hay productos que coincidan con la busqueda."
        >
          <Tabla titulo="Productos disponibles" columnas={["ID", "Nombre", "Precio", "Stock", "Acciones"]}>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td data-label="ID">{p.id}</td>
                <td data-label="Nombre">{p.nombre}</td>
                <td data-label="Precio">{formatoPrecio(p.precio)}</td>
                <td data-label="Stock">
                  {hayStock(p) ? p.stock : <span className="etiqueta baja">Agotado</span>}
                </td>
                <td className="acciones">
                  {/* DETALLE: GET /api/productos/{id} */}
                  <button type="button" className="secundario" onClick={() => verDetalle(p.id)}>
                    Ver<span className="solo-lectores"> {p.nombre}</span>
                  </button>
                  <button type="button" className="secundario" onClick={() => setEditando(p)}>
                    Editar<span className="solo-lectores"> {p.nombre}</span>
                  </button>
                  {/* DELETE /api/productos/{id} */}
                  <form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id} onSubmit={(e) => borrar(e, p)}>
                    <button type="submit" className="peligro">
                      Borrar<span className="solo-lectores"> {p.nombre}</span>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      <Dialogo abierto={detalle !== null} onCerrar={() => setDetalle(null)} titulo="Detalle del producto">
        {detalle && <Detalle datos={datosDetalleProducto(detalle)} />}
        <button type="button" className="secundario" onClick={() => setDetalle(null)}>
          Cerrar
        </button>
      </Dialogo>

      {/* MODIFICACION: PUT /api/productos/{id} */}
      <Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar producto">
        {editando && (
          <form key={editando.id} method="post" data-metodo="PUT" action={"/api/productos/" + editando.id} onSubmit={modificar} noValidate>
            <CamposProducto prefijo="editar" producto={editando} />
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
