/*
 * Logica del flujo de compra (simulacion): carga de datos y calculos.
 * Los textos de los mensajes al usuario NO estan aca: los define la pagina (HTML/JSX).
 */
import { obtener } from "./api.js";
import { formatoPrecio } from "./productos.js";

export const dinero = formatoPrecio;

/** Productos que tienen stock para vender. */
export async function productosConStock() {
  const productos = await obtener("/api/productos?soloDisponibles=true");
  return productos.filter((p) => p.stock > 0);
}

/** Socios activos (los unicos a los que se les puede asignar una compra). */
export async function sociosActivos() {
  const socios = await obtener("/api/socios");
  return socios.filter((s) => s.activo);
}

/** Mantiene la cantidad entre 0 y el stock disponible. */
export function limitarCantidad(valor, stock) {
  return Math.min(stock, Math.max(0, Number(valor) || 0));
}

/** Arma la lista [{ producto, cantidad }] con lo que el usuario eligio (cantidad > 0). */
export function armarItems(productos, cantidades) {
  return productos
    .filter((p) => (cantidades[p.id] || 0) > 0)
    .map((p) => ({ producto: p, cantidad: cantidades[p.id] }));
}

export function calcularTotal(items) {
  return items.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0);
}

export const FORMAS_DE_PAGO = [
  ["EFECTIVO", "Efectivo"],
  ["TRANSFERENCIA", "Transferencia"],
  ["DEUDA", "Anotar en la deuda del socio"],
];
