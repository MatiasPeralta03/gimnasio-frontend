/* Logica del carrito y la compra del kiosco: calculos y registro de las ventas. */
import { enviar } from "./api.js";

/** Items del carrito: { producto, cantidad } a partir de { idProducto: cantidad }. */
export function armarItems(productos, cantidades) {
  return productos.filter((p) => (cantidades[p.id] || 0) > 0).map((p) => ({ producto: p, cantidad: cantidades[p.id] }));
}

export const calcularTotal = (items) => items.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0);
export const contarUnidades = (items) => items.reduce((suma, i) => suma + i.cantidad, 0);

/** Mantiene la cantidad entre 0 y el stock disponible. */
export const limitarCantidad = (valor, stock) => Math.min(stock, Math.max(0, Number(valor) || 0));

export const FORMAS_DE_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo en el mostrador", pagada: true },
  { valor: "TRANSFERENCIA", nombre: "Transferencia", pagada: true },
  { valor: "TARJETA", nombre: "Tarjeta de credito o debito", pagada: true },
  { valor: "DEUDA", nombre: "Anotar en la cuenta del socio (pago despues)", pagada: false },
];

export const nombreFormaDePago = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.nombre ?? valor;

/**
 * Registra una venta por cada producto del carrito (el backend descuenta el stock de cada una).
 * "form" es el <form method="post" action="/api/ventas"> que declara el metodo y la URL.
 * Devuelve las ventas registradas.
 */
export async function registrarVentas(form, socioId, items, formaDePago) {
  const pagada = FORMAS_DE_PAGO.find((f) => f.valor === formaDePago)?.pagada ?? true;
  const ventas = [];
  for (const { producto, cantidad } of items) {
    ventas.push(await enviar(form, { socioId, productoId: producto.id, cantidad, pagada }));
  }
  return ventas;
}
