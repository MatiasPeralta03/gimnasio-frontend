/* Logica de Socios: consultas al backend, filtros y datos listos para mostrar. */
import { obtener } from "./api.js";
import { formatoFecha, formatoPrecio } from "./formatos.js";
import { nombreDeMedioPago, nombreDeMembresia } from "./membresias.js";

export const listarSocios = () => obtener("/api/socios");
export const obtenerSocio = (id) => obtener("/api/socios/" + id);

/** Socios que pueden comprar o inscribirse a una clase: los activos. */
export async function listarSociosActivos() {
  const socios = await listarSocios();
  return socios.filter((s) => s.activo);
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
    ["Nombre", nombreCompleto(s)],
    ["Email", s.email],
    ["Teléfono", s.telefono],
    ["Membresía", nombreDeMembresia(s.membresia)],
    ["Medio de pago", nombreDeMedioPago(s.medioPago)],
    ["Deuda", formatoPrecio(s.deuda)],
    ["Estado", estadoDeSocio(s)],
    ["Fecha de alta", formatoFecha(s.fechaAlta)],
  ];
}
