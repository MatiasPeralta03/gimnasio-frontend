import { useState } from "react";
import { Link } from "react-router-dom";
import { enviar } from "../js/api.js";
import { FORMAS_DE_PAGO, estaPagada } from "../js/compra.js";
import { formatoPrecio } from "../js/formatos.js";
import { hayStock, listarProductos } from "../js/productos.js";
import { listarSociosActivos } from "../js/socios.js";
import { validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Estado from "../componentes/Estado.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Ticket from "../componentes/Ticket.jsx";

const PASOS = ["Elegir producto", "Socio y pago", "Comprobante"];

/**
 * Flujo de compra del kiosco: elegir producto -> socio y forma de pago -> comprobante.
 * Al confirmar se hace un solo POST /api/ventas: el backend valida, descuenta el stock
 * y, si la compra se anota en la cuenta, suma el monto a la deuda del socio.
 * Es un producto por compra porque en el backend cada Venta es de un producto.
 */
export default function Compra() {
  useTitulo("Comprar");
  const { datos, cargando, error, recargar } = useDatos(listarProductos);
  const socios = useDatos(listarSociosActivos);
  const { mensaje, avisarError, limpiar } = useMensaje();

  const [productoId, setProductoId] = useState(null);
  const [cantidad, setCantidad] = useState("1");
  const [socioId, setSocioId] = useState("");
  const [pago, setPago] = useState("EFECTIVO");
  const [venta, setVenta] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const productos = datos.filter(hayStock);
  // Se busca en la lista cargada: si el stock cambio, el maximo y el precio quedan actualizados.
  const producto = productos.find((p) => p.id === productoId);
  const total = producto ? producto.precio * (Number(cantidad) || 0) : 0;
  const paso = venta ? 3 : producto ? 2 : 1;

  function elegir(id) {
    limpiar();
    setProductoId(id);
    setCantidad("1");
  }

  // Vuelve al paso 1 con todo limpio. No depende de Volver: tambien lo usa "Hacer otra compra".
  function reiniciar() {
    limpiar();
    setProductoId(null);
    setSocioId("");
    setPago("EFECTIVO");
    setVenta(null);
  }

  async function confirmar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    limpiar();
    setProcesando(true);
    try {
      const datosVenta = {
        socioId: Number(socioId),
        productoId,
        cantidad: Number(cantidad),
        pagada: estaPagada(pago),
      };
      setVenta({ ...(await enviar(form, datosVenta)), formaDePago: pago });
    } catch (err) {
      avisarError(err.message);
    } finally {
      setProcesando(false);
      recargar(); // el stock cambio (por esta compra o por otra)
    }
  }

  return (
    <>
      <h1>Comprar en el kiosco</h1>
      <ol className="pasos" aria-label="Pasos de la compra">
        {PASOS.map((nombre, i) => (
          <li key={nombre} aria-current={paso === i + 1 ? "step" : undefined}>
            {nombre}
          </li>
        ))}
      </ol>
      <Mensaje mensaje={mensaje} />

      {paso === 1 && (
        <section aria-labelledby="titulo-catalogo">
          <h2 id="titulo-catalogo">Productos con stock</h2>
          <Estado
            cargando={cargando}
            error={error}
            recargar={recargar}
            vacio={productos.length === 0}
            textoVacio="No hay productos con stock."
          >
            <ul className="rejilla auto lista-limpia">
              {productos.map((p) => (
                <li className="tarjeta" key={p.id}>
                  <h3>{p.nombre}</h3>
                  <p className="precio">{formatoPrecio(p.precio)}</p>
                  <p className="ayuda">Stock: {p.stock}</p>
                  <button type="button" onClick={() => elegir(p.id)}>
                    Comprar<span className="solo-lectores"> {p.nombre}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Estado>
        </section>
      )}

      {paso === 2 && (
        <section className="panel" aria-labelledby="titulo-pago">
          <h2 id="titulo-pago">{producto.nombre}</h2>
          <p>
            Precio por unidad: <strong>{formatoPrecio(producto.precio)}</strong>. Hay {producto.stock} en stock.
          </p>
          <Estado
            cargando={socios.cargando}
            error={socios.error}
            recargar={socios.recargar}
            vacio={socios.datos.length === 0}
            textoVacio="No hay socios activos para asignar la compra."
          >
            {/* POST /api/ventas */}
            <form method="post" action="/api/ventas" onSubmit={confirmar} noValidate>
              <div className="campos">
                <Campo
                  id="compra-cantidad"
                  etiqueta="Cantidad"
                  type="number"
                  min="1"
                  max={producto.stock}
                  step="1"
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  data-mensaje-error={"Escribí una cantidad entre 1 y " + producto.stock + "."}
                />
                <Campo
                  id="compra-socio"
                  etiqueta="Socio"
                  as="select"
                  required
                  value={socioId}
                  onChange={(e) => setSocioId(e.target.value)}
                  data-mensaje-error="Elegí el socio que realiza la compra."
                >
                  <option value="">Elegí un socio...</option>
                  {socios.datos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.apellido}, {s.nombre} (DNI {s.dni})
                    </option>
                  ))}
                </Campo>
              </div>

              <fieldset>
                <legend>Forma de pago</legend>
                {FORMAS_DE_PAGO.map((f) => (
                  <label key={f.valor} className="opcion">
                    <input type="radio" name="pago" value={f.valor} checked={pago === f.valor} onChange={() => setPago(f.valor)} />
                    {f.nombre}
                  </label>
                ))}
              </fieldset>

              <p className="total" aria-live="polite">
                Total: {formatoPrecio(total)}
              </p>
              <div className="botonera">
                <button type="button" className="secundario" onClick={reiniciar} disabled={procesando}>
                  Volver
                </button>
                <button type="submit" disabled={procesando}>
                  {procesando ? "Procesando..." : "Confirmar compra"}
                </button>
              </div>
            </form>
          </Estado>
        </section>
      )}

      {paso === 3 && (
        <section aria-labelledby="titulo-listo">
          <h2 id="titulo-listo">Compra realizada</h2>
          <p>
            La venta quedó registrada y el stock se actualizó. Podés ver el stock en <Link to="/productos">Productos</Link>.
          </p>
          <Ticket venta={venta} />
          <div className="botonera solo-pantalla">
            <button type="button" onClick={reiniciar}>
              Hacer otra compra
            </button>
            <button type="button" className="secundario" onClick={() => window.print()}>
              Imprimir comprobante
            </button>
          </div>
        </section>
      )}
    </>
  );
}
