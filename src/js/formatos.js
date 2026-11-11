/* Funciones para mostrar dinero y fechas en formato argentino. */

const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export const formatoPrecio = (valor) => moneda.format(Number(valor) || 0);

/**
 * Convierte una fecha del backend en Date, siempre en hora local:
 * - "2026-10-08" sin hora se leeria como UTC y en Argentina mostraria el dia anterior.
 * - Los decimales de los segundos se cortan porque no todos los navegadores los aceptan.
 */
export function aFecha(valor) {
  const texto = String(valor);
  return new Date(texto.length === 10 ? texto + "T00:00:00" : texto.slice(0, 19));
}

export function formatoFechaHora(valor) {
  if (!valor) return "-";
  // Año con 4 digitos para evitar confusiones ("20/12/2026, 19:30").
  return aFecha(valor).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatoFecha(valor) {
  if (!valor) return "-";
  return aFecha(valor).toLocaleDateString("es-AR");
}

/** Fecha y hora para un <input type="datetime-local"> ("2026-10-05T18:00"). */
export const paraInputFechaHora = (valor) => (valor ? String(valor).slice(0, 16) : "");

/** Fecha y hora local de ahora, en el formato de <input type="datetime-local">. */
export function ahoraParaInput() {
  const ahora = new Date();
  const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

/** Fecha y hora local dentro de "anios" años: tope para no aceptar clases en el año 9999. */
export function enAniosParaInput(anios) {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + anios);
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

/** Un <input type="datetime-local"> da "2026-10-05T18:00"; el backend espera segundos ("...:00"). */
export const paraBackend = (valor) => (valor && valor.length === 16 ? valor + ":00" : valor);
