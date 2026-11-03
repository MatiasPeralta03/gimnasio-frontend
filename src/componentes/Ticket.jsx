import { formatoFechaHora, formatoPrecio } from "../js/formatos.js";
import { nombreFormaDePago } from "../js/compra.js";

/** Comprobante de la compra (se puede imprimir). */
export default function Ticket({ ticket }) {
  return (
    <article className="ticket" aria-labelledby="titulo-ticket">
      <h3 id="titulo-ticket">Gimnasio de Barrio</h3>
      <p>
        {ticket.borrador ? "Resumen de tu compra (todavia no confirmada)" : "Comprobante N° " + ticket.numero}
        <br />
        {formatoFechaHora(ticket.fecha)}
      </p>
      <p>
        Socio: {ticket.socio}
        <br />
        Pago: {nombreFormaDePago(ticket.pago)}
        {ticket.tarjeta && <> (terminada en {ticket.tarjeta})</>}
      </p>
      <table>
        <caption className="solo-lectores">Detalle de la compra</caption>
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Cant.</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {ticket.items.map(({ producto, cantidad }) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{cantidad}</td>
              <td>{formatoPrecio(producto.precio * cantidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan="2">
              TOTAL
            </th>
            <td>{formatoPrecio(ticket.total)}</td>
          </tr>
        </tfoot>
      </table>
      {ticket.pago === "DEUDA" && <p>El importe quedo anotado en la cuenta del socio.</p>}
    </article>
  );
}
