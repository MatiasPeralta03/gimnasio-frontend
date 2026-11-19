/* Logica de Ventas del kiosco. Cada venta es de un producto: un solo POST /api/ventas en el backend. */
import { obtener } from "./api.js";

export const listarVentas = () => obtener("/api/ventas");

export const FORMAS_DE_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo", pagada: true },
  { valor: "TRANSFERENCIA", nombre: "Transferencia", pagada: true },
  { valor: "DEUDA", nombre: "Anotar en la cuenta del socio", pagada: false },
];

export const nombreFormaDePago = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.nombre ?? valor;

/** El backend solo necesita saber si la venta quedo pagada; si no, suma el monto a la deuda del socio. */
export const estaPagada = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.pagada ?? true;

/** Ventas de la mas nueva a la mas vieja (el back las devuelve en orden de carga). */
export const ordenarPorFecha = (ventas) => [...ventas].sort((a, b) => b.id - a.id);
