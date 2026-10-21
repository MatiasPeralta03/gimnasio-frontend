import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dinero,
  productosConStock,
  sociosActivos,
  limitarCantidad,
  armarItems,
  calcularTotal,
  FORMAS_DE_PAGO,
} from "../js/compra.js";

/*
 * La pagina define el HTML y los mensajes que se muestran.
 * La logica (carga de datos, calculos) esta en src/js/compra.js.
 */
export default function Compra() {
  const [paso, setPaso] = useState(1);
  const [mensaje, setMensaje] = useState({ texto: "", error: false });
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({}); // id -> cantidad
  const [socios, setSocios] = useState([]);
  const [socioId, setSocioId] = useState("");
  const [pago, setPago] = useState("EFECTIVO");

  const avisar = (texto, error = false) => setMensaje({ texto, error });

  useEffect(() => {
    productosConStock()
      .then(setProductos)
      .catch((e) => avisar(e.message, true));
  }, []);

  const items = armarItems(productos, cantidades);
  const total = calcularTotal(items);
  const socio = socios.find((s) => String(s.id) === String(socioId));

  function irA(n) {
    setPaso(n);
    avisar("");
  }

  // PASO 1 -> 2
  async function continuar1(e) {
    e.preventDefault();
    if (items.length === 0) return avisar("Elegi al menos un producto.", true);
    try {
      const activos = await sociosActivos();
      if (activos.length === 0) return avisar("No hay socios activos para asignar la compra.", true);
      setSocios(activos);
      setSocioId(String(activos[0].id));
      irA(2);
    } catch (err) {
      avisar(err.message, true);
    }
  }

  return (
    <>
      <h2>Comprar en el kiosco</h2>
      <p>Simulacion del proceso de compra: no se registra ninguna venta en el servidor.</p>
      <p className={"mensaje" + (mensaje.error ? " error" : "")} role="status">{mensaje.texto}</p>

      {paso === 1 && (
        <section aria-labelledby="titulo-paso">
          <h3 id="titulo-paso">Paso 1 de 3: elegi los productos</h3>
          <form method="get" action="/api/productos" onSubmit={continuar1}>
            <div className="contenedor-tabla">
              <table>
                <caption>Productos con stock</caption>
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 && (
                    <tr><td colSpan="4">No hay productos con stock.</td></tr>
                  )}
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{dinero(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max={p.stock}
                          value={cantidades[p.id] || 0}
                          aria-label={"Cantidad de " + p.nombre}
                          onChange={(e) =>
                            setCantidades({ ...cantidades, [p.id]: limitarCantidad(e.target.value, p.stock) })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="botonera">
              <button type="submit">Continuar</button>
            </div>
          </form>
        </section>
      )}

      {paso === 2 && (
        <section aria-labelledby="titulo-paso">
          <h3 id="titulo-paso">Paso 2 de 3: socio y forma de pago</h3>
          <form
            method="get"
            action="/api/socios"
            onSubmit={(e) => {
              e.preventDefault();
              irA(3);
            }}
          >
            <fieldset>
              <legend>Datos de la compra</legend>

              <label htmlFor="socio">Socio</label>
              <select id="socio" name="socio" required value={socioId} onChange={(e) => setSocioId(e.target.value)}>
                {socios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.apellido}, {s.nombre} (DNI {s.dni})
                  </option>
                ))}
              </select>

              <fieldset>
                <legend>Forma de pago</legend>
                {FORMAS_DE_PAGO.map(([valor, texto]) => (
                  <label key={valor} className="opcion">
                    <input type="radio" name="pago" value={valor} checked={pago === valor} onChange={() => setPago(valor)} /> {texto}
                  </label>
                ))}
              </fieldset>
            </fieldset>
            <div className="botonera">
              <button type="button" className="secundario" onClick={() => irA(1)}>Volver</button>
              <button type="submit">Continuar</button>
            </div>
          </form>
        </section>
      )}

      {paso === 3 && (
        <section aria-labelledby="titulo-paso">
          <h3 id="titulo-paso">Paso 3 de 3: confirma tu compra</h3>
          <div className="contenedor-tabla">
            <table>
              <caption>Resumen de la compra</caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ producto, cantidad }) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{cantidad}</td>
                    <td>{dinero(producto.precio)}</td>
                    <td>{dinero(producto.precio * cantidad)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan="3">Total</th>
                  <td>{dinero(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p>Socio: {socio.nombre} {socio.apellido} | Forma de pago: {pago}</p>
          <div className="botonera">
            <button type="button" className="secundario" onClick={() => irA(2)}>Volver</button>
            <button type="button" onClick={() => irA(4)}>Confirmar compra</button>
          </div>
        </section>
      )}

      {paso === 4 && (
        <section aria-labelledby="titulo-paso">
          <h3 id="titulo-paso">Compra realizada</h3>
          <p>Gracias! Tu compra por {dinero(total)} fue registrada (simulacion).</p>
          <p>
            <Link to="/compra" onClick={() => { setCantidades({}); irA(1); }}>Hacer otra compra</Link>
          </p>
        </section>
      )}
    </>
  );
}
