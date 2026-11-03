import { useState } from "react";
import {
  FORMAS_DE_PAGO,
  armarItems,
  calcularTotal,
  contarUnidades,
  limitarCantidad,
  nombreFormaDePago,
  registrarVentas,
} from "../js/compra.js";
import { formatoPrecio } from "../js/formatos.js";
import { listarProductos } from "../js/productos.js";
import { listarSociosActivos } from "../js/clases.js";
import { nombreCompleto } from "../js/socios.js";
import { validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Estado from "../componentes/Estado.jsx";
import FormTarjeta from "../componentes/FormTarjeta.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Ticket from "../componentes/Ticket.jsx";

const PASOS = ["Elegir productos", "Socio y pago", "Confirmar", "Comprobante"];
const TARJETA_VACIA = { numero: "", titular: "", vencimiento: "", cvv: "" };

/**
 * Flujo de compra del kiosco en 4 pasos: carrito -> socio y forma de pago -> confirmacion -> comprobante.
 * Al confirmar se registra una venta por producto (POST /api/ventas) y el backend descuenta el stock.
 * El pago con tarjeta es una simulacion: los datos de la tarjeta no se envian ni se guardan.
 */
export default function Compra() {
  useTitulo("Comprar");
  const { datos, cargando, error, recargar } = useDatos(listarProductos);
  const productos = datos.filter((p) => p.stock > 0);
  const { mensaje, avisar, avisarError, limpiar } = useMensaje();

  const [paso, setPaso] = useState(1);
  const [cantidades, setCantidades] = useState({});
  const [socios, setSocios] = useState([]);
  const [socioId, setSocioId] = useState("");
  const [pago, setPago] = useState("EFECTIVO");
  const [tarjeta, setTarjeta] = useState(TARJETA_VACIA);
  const [ticket, setTicket] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const items = armarItems(productos, cantidades);
  const total = calcularTotal(items);
  const socio = socios.find((s) => String(s.id) === String(socioId));

  function irAlPaso(n) {
    setPaso(n);
    limpiar();
  }

  // "diferencia" es +1 o -1. Se usa el valor previo para no perder clics muy seguidos.
  function cambiarCantidad(producto, diferencia) {
    setCantidades((previas) => ({
      ...previas,
      [producto.id]: limitarCantidad((previas[producto.id] || 0) + diferencia, producto.stock),
    }));
  }

  // PASO 1 -> 2: hay que tener algo en el carrito; se cargan los socios activos (GET /api/socios)
  async function continuarDelCarrito() {
    if (items.length === 0) return avisarError("Agrega al menos un producto al carrito.");
    try {
      const activos = await listarSociosActivos();
      if (activos.length === 0) return avisarError("No hay socios activos para asignar la compra.");
      setSocios(activos);
      if (!socioId) setSocioId(String(activos[0].id));
      irAlPaso(2);
    } catch (e) {
      avisarError(e.message);
    }
  }

  // PASO 2 -> 3: valida socio y (si corresponde) los datos de la tarjeta
  function continuarDelPago(e) {
    e.preventDefault();
    if (validarFormulario(e.currentTarget)) irAlPaso(3);
  }

  // PASO 3 -> 4: POST /api/ventas (metodo y URL declarados en el <form>)
  async function confirmar(e) {
    e.preventDefault();
    setProcesando(true);
    try {
      const ventas = await registrarVentas(e.currentTarget, Number(socioId), items, pago);
      setTicket({
        numero: ventas.map((v) => v.id).join("-"),
        fecha: ventas[0]?.fechaHora ?? new Date().toISOString(),
        socio: nombreCompleto(socio),
        pago,
        tarjeta: pago === "TARJETA" ? tarjeta.numero.slice(-4) : null,
        items,
        total,
      });
      setTarjeta(TARJETA_VACIA); // los datos de la tarjeta no se conservan
      irAlPaso(4);
      recargar();
    } catch (err) {
      avisarError(err.message);
      recargar(); // el stock pudo haber cambiado
    } finally {
      setProcesando(false);
    }
  }

  function nuevaCompra() {
    setCantidades({});
    setTicket(null);
    irAlPaso(1);
    avisar("Compra registrada. Podes hacer otra.");
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
        <div className="compra-layout">
          <section aria-labelledby="titulo-catalogo">
            <h2 id="titulo-catalogo">Productos con stock</h2>
            <Estado
              cargando={cargando}
              error={error}
              recargar={recargar}
              vacio={productos.length === 0}
              textoVacio="No hay productos con stock."
            >
              <ul className="rejilla auto" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {productos.map((p) => (
                  <li className="tarjeta" key={p.id}>
                    <h3 style={{ margin: 0 }}>{p.nombre}</h3>
                    <p className="precio">{formatoPrecio(p.precio)}</p>
                    <p className="ayuda">Stock: {p.stock}</p>
                    <div className="cantidad" role="group" aria-label={"Cantidad de " + p.nombre}>
                      <button
                        type="button"
                        className="secundario"
                        aria-label={"Quitar una unidad de " + p.nombre}
                        onClick={() => cambiarCantidad(p, -1)}
                        disabled={!cantidades[p.id]}
                      >
                        -
                      </button>
                      <output aria-live="polite">{cantidades[p.id] || 0}</output>
                      <button
                        type="button"
                        className="secundario"
                        aria-label={"Agregar una unidad de " + p.nombre}
                        onClick={() => cambiarCantidad(p, 1)}
                        disabled={(cantidades[p.id] || 0) >= p.stock}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Estado>
          </section>

          <aside className="panel carrito" aria-labelledby="titulo-carrito">
            <h2 id="titulo-carrito">Tu carrito</h2>
            {items.length === 0 ? (
              <p>Todavia no agregaste productos.</p>
            ) : (
              <ul>
                {items.map(({ producto, cantidad }) => (
                  <li key={producto.id}>
                    {cantidad} x {producto.nombre} - {formatoPrecio(producto.precio * cantidad)}
                  </li>
                ))}
              </ul>
            )}
            <p className="total" aria-live="polite">
              Total: {formatoPrecio(total)}
            </p>
            <p className="ayuda">{contarUnidades(items)} unidades</p>
            <button type="button" onClick={continuarDelCarrito} disabled={items.length === 0}>
              Continuar
            </button>
          </aside>
        </div>
      )}

      {paso === 2 && (
        <section aria-labelledby="titulo-pago">
          <h2 id="titulo-pago">Socio y forma de pago</h2>
          <form method="get" action="/api/socios" onSubmit={continuarDelPago} noValidate>
            <fieldset>
              <legend>Datos de la compra</legend>
              <Campo
                id="compra-socio"
                etiqueta="Socio"
                as="select"
                name="socio"
                required
                value={socioId}
                onChange={(e) => setSocioId(e.target.value)}
                data-mensaje-error="Elegi el socio que realiza la compra."
              >
                {socios.map((s) => (
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
            </fieldset>

            {pago === "TARJETA" && <FormTarjeta tarjeta={tarjeta} setTarjeta={setTarjeta} />}

            <div className="botonera">
              <button type="button" className="secundario" onClick={() => irAlPaso(1)}>
                Volver
              </button>
              <button type="submit">Continuar</button>
            </div>
          </form>
        </section>
      )}

      {paso === 3 && (
        <section aria-labelledby="titulo-confirmar">
          <h2 id="titulo-confirmar">Confirma tu compra</h2>
          <Ticket
            ticket={{
              borrador: true,
              fecha: new Date().toISOString(),
              socio: nombreCompleto(socio),
              pago,
              tarjeta: pago === "TARJETA" ? tarjeta.numero.slice(-4) : null,
              items,
              total,
            }}
          />
          <p>
            Forma de pago elegida: <strong>{nombreFormaDePago(pago)}</strong>.
          </p>
          {/* POST /api/ventas: una venta por producto */}
          <form method="post" action="/api/ventas" onSubmit={confirmar}>
            <div className="botonera">
              <button type="button" className="secundario" onClick={() => irAlPaso(2)} disabled={procesando}>
                Volver
              </button>
              <button type="submit" disabled={procesando}>
                {procesando ? "Procesando..." : "Confirmar compra"}
              </button>
            </div>
          </form>
        </section>
      )}

      {paso === 4 && ticket && (
        <section aria-labelledby="titulo-listo">
          <h2 id="titulo-listo">Compra realizada</h2>
          <p>Gracias! Tu compra por {formatoPrecio(ticket.total)} fue registrada y el stock se actualizo.</p>
          <Ticket ticket={ticket} />
          <div className="botonera solo-pantalla">
            <button type="button" className="secundario" onClick={() => window.print()}>
              Imprimir comprobante
            </button>
            <button type="button" onClick={nuevaCompra}>
              Hacer otra compra
            </button>
          </div>
        </section>
      )}
    </>
  );
}
