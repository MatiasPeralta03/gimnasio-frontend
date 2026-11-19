import { useState } from "react";
import { Link } from "react-router-dom";
import { enviar } from "../js/api.js";
import { FORMAS_DE_PAGO, estaPagada, listarVentas, ordenarPorFecha } from "../js/ventas.js";
import { formatoFechaHora, formatoPrecio } from "../js/formatos.js";
import { hayStock, listarProductos } from "../js/productos.js";
import { listarSociosActivos } from "../js/socios.js";
import { validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Estado from "../componentes/Estado.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Tabla from "../componentes/Tabla.jsx";
import Ticket from "../componentes/Ticket.jsx";

const PASOS = ["Cargar producto", "Socio y pago", "Comprobante"];

/**
 * Gestion de ventas del kiosco (la usa el personal del gimnasio, no el cliente).
 * Registrar una venta: cargar producto y cantidad -> socio y forma de pago -> comprobante.
 * Al confirmar se hace un solo POST /api/ventas: el backend valida, descuenta el stock
 * y, si la venta se anota en la cuenta, suma el monto a la deuda del socio.
 * Es un producto por venta porque en el backend cada Venta es de un producto.
 * Abajo se listan las ventas ya registradas (GET /api/ventas).
 */
export default function Ventas() {
  useTitulo("Ventas");
  const { datos, cargando, error, recargar } = useDatos(listarProductos);
  const socios = useDatos(listarSociosActivos);
  const ventas = useDatos(listarVentas);
  const { mensaje, avisarError, limpiar } = useMensaje();

  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [cargado, setCargado] = useState(false);
  const [socioId, setSocioId] = useState("");
  const [pago, setPago] = useState("EFECTIVO");
  const [venta, setVenta] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const productos = datos.filter(hayStock);
  // Se busca en la lista cargada: si el stock cambio, el maximo y el precio quedan actualizados.
  const producto = productos.find((p) => String(p.id) === productoId);
  const total = producto ? producto.precio * (Number(cantidad) || 0) : 0;
  const paso = venta ? 3 : cargado && producto ? 2 : 1;

  // PASO 1 -> 2: el formulario valida producto y cantidad (entre 1 y el stock).
  function cargarProducto(e) {
    e.preventDefault();
    if (!validarFormulario(e.currentTarget)) return;
    limpiar();
    setCargado(true);
  }

  // Vuelve al paso 1 con todo limpio. Lo usa "Nueva venta".
  function reiniciar() {
    limpiar();
    setProductoId("");
    setCantidad("1");
    setCargado(false);
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
        productoId: producto.id,
        cantidad: Number(cantidad),
        pagada: estaPagada(pago),
      };
      setVenta({ ...(await enviar(form, datosVenta)), formaDePago: pago });
      ventas.recargar();
    } catch (err) {
      avisarError(err.message);
    } finally {
      setProcesando(false);
      recargar(); // el stock cambio (por esta venta o por otra)
    }
  }

  return (
    <>
      <h1>Ventas del kiosco</h1>
      <ol className="pasos" aria-label="Pasos para registrar una venta">
        {PASOS.map((nombre, i) => (
          <li key={nombre} aria-current={paso === i + 1 ? "step" : undefined}>
            {nombre}
          </li>
        ))}
      </ol>
      <Mensaje mensaje={mensaje} />

      {paso === 1 && (
        <section className="panel" aria-labelledby="titulo-cargar">
          <h2 id="titulo-cargar">Cargar producto</h2>
          <Estado
            cargando={cargando}
            error={error}
            recargar={recargar}
            vacio={productos.length === 0}
            textoVacio="No hay productos con stock. Cargalos en Productos."
          >
            <form onSubmit={cargarProducto} noValidate>
              <div className="campos">
                <Campo
                  id="venta-producto"
                  etiqueta="Producto"
                  as="select"
                  required
                  value={productoId}
                  onChange={(e) => setProductoId(e.target.value)}
                  data-mensaje-error="Elegí el producto que se vende."
                >
                  <option value="">Elegí un producto...</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} - {formatoPrecio(p.precio)} (stock: {p.stock})
                    </option>
                  ))}
                </Campo>
                <Campo
                  id="venta-cantidad"
                  etiqueta="Cantidad"
                  type="number"
                  min="1"
                  max={producto?.stock}
                  step="1"
                  required
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  data-mensaje-error={"Escribí una cantidad entre 1 y " + (producto?.stock ?? "el stock disponible") + "."}
                />
              </div>
              <p className="total" aria-live="polite">
                Subtotal: {formatoPrecio(total)}
              </p>
              <div className="botonera">
                <button type="submit">Continuar</button>
              </div>
            </form>
          </Estado>
        </section>
      )}

      {paso === 2 && (
        <section className="panel" aria-labelledby="titulo-pago">
          <h2 id="titulo-pago">Socio y forma de pago</h2>
          <p>
            Producto: <strong>{producto.nombre}</strong> × {cantidad} ({formatoPrecio(producto.precio)} c/u)
          </p>
          <Estado
            cargando={socios.cargando}
            error={socios.error}
            recargar={socios.recargar}
            vacio={socios.datos.length === 0}
            textoVacio="No hay socios activos para asignar la venta."
          >
            {/* POST /api/ventas */}
            <form method="post" action="/api/ventas" onSubmit={confirmar} noValidate>
              <Campo
                id="venta-socio"
                etiqueta="Socio"
                as="select"
                required
                value={socioId}
                onChange={(e) => setSocioId(e.target.value)}
                data-mensaje-error="Elegí el socio al que se le vende."
              >
                <option value="">Elegí un socio...</option>
                {socios.datos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.apellido}, {s.nombre} (DNI {s.dni})
                  </option>
                ))}
              </Campo>

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
                <button type="button" className="secundario" onClick={() => setCargado(false)} disabled={procesando}>
                  Volver
                </button>
                <button type="submit" disabled={procesando}>
                  {procesando ? "Procesando..." : "Registrar venta"}
                </button>
              </div>
            </form>
          </Estado>
        </section>
      )}

      {paso === 3 && (
        <section aria-labelledby="titulo-listo">
          <h2 id="titulo-listo">Venta registrada</h2>
          <p>
            Se descontó el stock del producto. Podés verlo en <Link to="/productos">Productos</Link>.
          </p>
          <Ticket venta={venta} />
          <div className="botonera solo-pantalla">
            <button type="button" onClick={reiniciar}>
              Nueva venta
            </button>
            <button type="button" className="secundario" onClick={() => window.print()}>
              Imprimir comprobante
            </button>
          </div>
        </section>
      )}

      {/* LISTADO: GET /api/ventas */}
      <section className="panel solo-pantalla" aria-labelledby="titulo-ventas">
        <h2 id="titulo-ventas">Ventas registradas</h2>
        <p>
          <button type="button" className="secundario" onClick={ventas.recargar}>
            Actualizar listado
          </button>
        </p>
        <Estado
          cargando={ventas.cargando}
          error={ventas.error}
          recargar={ventas.recargar}
          vacio={ventas.datos.length === 0}
          textoVacio="Todavía no hay ventas registradas."
        >
          <Tabla titulo="Ventas, de la más nueva a la más vieja" columnas={["N°", "Fecha", "Socio", "Producto", "Cant.", "Total", "Estado"]}>
            {ordenarPorFecha(ventas.datos).map((v) => (
              <tr key={v.id}>
                <td data-label="N°">{v.id}</td>
                <td data-label="Fecha">{formatoFechaHora(v.fechaHora)}</td>
                <td data-label="Socio">{v.socioNombre}</td>
                <td data-label="Producto">{v.productoNombre}</td>
                <td data-label="Cant.">{v.cantidad}</td>
                <td data-label="Total">{formatoPrecio(v.montoTotal)}</td>
                <td data-label="Estado">
                  <span className={"etiqueta" + (v.pagada ? "" : " alerta")}>{v.pagada ? "Pagada" : "A cuenta"}</span>
                </td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>
    </>
  );
}
