/* Logica de Ingresos (molinete). */
import { obtener } from "./api.js";

export const listarPresentes = () => obtener("/api/ingresos/presentes");
