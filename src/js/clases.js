/* Logica de Clases e inscripciones. */
import { obtener } from "./api.js";

export const listarClases = () => obtener("/api/clases");
export const listarInscriptos = (claseId) => obtener("/api/inscripciones?claseId=" + claseId);

/** Instructores posibles: empleados que estan activos. */
export async function listarInstructores() {
  const empleados = await obtener("/api/empleados");
  return empleados.filter((e) => e.activo);
}

/** Filtro por estado ("activas" | "canceladas" | "todas") y por cupo ("conCupo" = solo las que tienen lugar). */
export function filtrarClases(clases, { estado, soloConCupo, texto }) {
  const buscado = texto.trim().toLowerCase();
  return clases.filter((c) => {
    if (estado === "activas" && !c.activa) return false;
    if (estado === "canceladas" && c.activa) return false;
    if (soloConCupo && c.cuposDisponibles <= 0) return false;
    return !buscado || (c.actividad + " " + c.instructorNombre).toLowerCase().includes(buscado);
  });
}

export const cuposDeClase = (c) => c.cuposDisponibles + " de " + c.capacidad + " lugares libres";
