/* Logica de Empleados. */
import { obtener } from "./api.js";
import { formatoFecha } from "./formatos.js";

export const listarEmpleados = () => obtener("/api/empleados");
export const obtenerEmpleado = (id) => obtener("/api/empleados/" + id);

export const nombreRol = (rol) => (rol === "ADMIN" ? "Administrador" : "Empleado");

export function datosDetalleEmpleado(e) {
  return [
    ["ID", e.id],
    ["DNI", e.dni],
    ["Nombre", e.nombre + " " + e.apellido],
    ["Email", e.email],
    ["Teléfono", e.telefono],
    ["Usuario", e.usuario],
    ["Rol", nombreRol(e.rol)],
    ["Estado", e.activo ? "Activo" : "Baja"],
    ["Fecha de alta", formatoFecha(e.fechaAlta)],
  ];
}
