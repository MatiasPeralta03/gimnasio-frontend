import { formatoFechaHora, formatoPrecio } from "../js/formatos.js";
import { nombreFormaDePago } from "../js/compra.js";

/** Comprobante de la compra, armado con la venta que devolvio el backend (se puede imprimir). */
export default function Ticket({ venta }) {
  return (
    <article className="ticket" aria-labelledby="titulo-ticket">
      <h3 id="titulo-ticket">Gimnasio de Barrio</h3>
      <p>
        Comprobante N° {venta.id}
        <br />
        {formatoFechaHora(venta.fechaHora)}
      </p>
      <p>
        Socio: {venta.socioNombre}
        <br />
        Pago: {nombreFormaDePago(venta.formaDePago)}
      </p>
      <table>
        <caption className="solo-lectores">Detalle de la compra</caption>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Cant.</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{venta.productoNombre}</td>
            <td>{venta.cantidad}</td>
            <td>{formatoPrecio(venta.montoTotal)}</td>
          </tr>
        </tbody>
      </table>
      {!venta.pagada && <p>El importe quedó anotado en la cuenta del socio.</p>}
    </article>
  );
}
