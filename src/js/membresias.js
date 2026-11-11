/*
 * Datos fijos del negocio: planes de membresia y medios de pago.
 * Los precios son informativos para la landing: el backend no guarda precios de membresia.
 */

export const MEMBRESIAS = [
  { valor: "MENSUAL", nombre: "Mensual", precio: 18000, detalle: "Pagás mes a mes, sin compromiso." },
  { valor: "TRIMESTRAL", nombre: "Trimestral", precio: 46000, detalle: "3 meses en un solo pago, con descuento." },
  { valor: "ANUAL", nombre: "Anual", precio: 155000, detalle: "12 meses en un solo pago: el mejor precio." },
];

export const MEDIOS_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo" },
  { valor: "TRANSFERENCIA", nombre: "Transferencia" },
];

export const nombreDeMembresia = (valor) => MEMBRESIAS.find((m) => m.valor === valor)?.nombre ?? valor;
export const nombreDeMedioPago = (valor) => MEDIOS_PAGO.find((m) => m.valor === valor)?.nombre ?? valor;
