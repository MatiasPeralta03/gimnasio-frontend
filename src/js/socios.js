/* Logica de Socios: consultas al backend, filtros y datos listos para mostrar. */
import { obtener } from "./api.js";
import { formatoFecha, formatoPrecio } from "./formatos.js";
import { nombreDeMembresia } from "./membresias.js";

export const listarSocios = () => obtener("/api/socios");
export const obtenerSocio = (id) => obtener("/api/socios/" + id);

/** Historial completo de un socio: visitas, compras, pagos y clases (4 consultas en paralelo). */
export async function historialDeSocio(id) {
  const [visitas, compras, pagos, clases] = await Promise.all([
    obtener("/api/ingresos?socioId=" + id),
    obtener("/api/ventas?socioId=" + id),
    obtener("/api/pagos?socioId=" + id),
    obtener("/api/inscripciones?socioId=" + id),
  ]);
  return { visitas, compras, pagos, clases };
}

export const estadoDeSocio = (socio) => (socio.activo ? "Activo" : "Baja");
export const nombreCompleto = (socio) => socio.nombre + " " + socio.apellido;

/**
 * Filtra por texto (nombre, apellido o DNI) y por estado ("todos" | "activos" | "bajas").
 * Es un filtro en el navegador: no hace falta volver a consultar al servidor.
 */
export function filtrarSocios(socios, { texto, estado }) {
  const buscado = texto.trim().toLowerCase();
  return socios.filter((s) => {
    if (estado === "activos" && !s.activo) return false;
    if (estado === "bajas" && s.activo) return false;
    if (!buscado) return true;
    return (nombreCompleto(s) + " " + s.dni).toLowerCase().includes(buscado);
  });
}

/** Pares [titulo, valor] para la ventana de detalle. */
export function datosDetalleSocio(s) {
  return [
    ["ID", s.id],
    ["DNI", s.dni],
    ["PIN de ingreso", s.pin],
    ["Nombre", nombreCompleto(s)],
    ["Email", s.email],
    ["Telefono", s.telefono],
    ["Membresia", nombreDeMembresia(s.membresia)],
    ["Medio de pago", s.medioPago],
    ["Deuda", formatoPrecio(s.deuda)],
    ["Estado", estadoDeSocio(s)],
    ["Fecha de alta", formatoFecha(s.fechaAlta)],
  ];
}
