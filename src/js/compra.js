/* Logica de la compra del kiosco. Cada compra es un producto: una sola venta en el backend. */

export const FORMAS_DE_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo", pagada: true },
  { valor: "TRANSFERENCIA", nombre: "Transferencia", pagada: true },
  { valor: "DEUDA", nombre: "Anotar en la cuenta del socio", pagada: false },
];

export const nombreFormaDePago = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.nombre ?? valor;

/** El backend solo necesita saber si la venta quedo pagada; si no, suma el monto a la deuda del socio. */
export const estaPagada = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.pagada ?? true;
