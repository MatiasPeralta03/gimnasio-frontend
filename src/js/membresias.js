/* Datos fijos del negocio: planes de membresia y medios de pago de las cuotas. */

export const MEMBRESIAS = [
  { valor: "MENSUAL", nombre: "Mensual", precio: 18000, detalle: "Pagas mes a mes, sin compromiso." },
  { valor: "TRIMESTRAL", nombre: "Trimestral", precio: 46000, detalle: "3 meses con descuento." },
  { valor: "ANUAL", nombre: "Anual", precio: 155000, detalle: "El mejor precio: 12 meses." },
];

export const MEDIOS_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo" },
  { valor: "TRANSFERENCIA", nombre: "Transferencia" },
];

export const precioDeMembresia = (valor) => MEMBRESIAS.find((m) => m.valor === valor)?.precio ?? 0;
export const nombreDeMembresia = (valor) => MEMBRESIAS.find((m) => m.valor === valor)?.nombre ?? valor;
