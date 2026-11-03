/* Funciones para mostrar dinero, fechas y horas en formato argentino. */

const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

export const formatoPrecio = (valor) => moneda.format(Number(valor) || 0);

/** El backend manda fechas ISO sin zona ("2026-10-05T18:00:00"); el navegador las toma como hora local. */
export const aFecha = (valor) => new Date(valor);

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

export function formatoHora(valor) {
  if (!valor) return "-";
  return aFecha(valor).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** "45 min", "3 h 05 min" o "2 dias 4 h" segun cuanto tiempo paso. */
export function formatoDuracion(desde, hasta) {
  const fin = hasta ? aFecha(hasta) : new Date();
  const minutos = Math.max(0, Math.floor((fin - aFecha(desde)) / 60000));
  if (minutos < 60) return minutos + " min";
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return horas + " h " + String(minutos % 60).padStart(2, "0") + " min";
  return Math.floor(horas / 24) + " d " + (horas % 24) + " h";
}

/** Fecha y hora para un <input type="datetime-local"> ("2026-10-05T18:00"). */
export const paraInputFechaHora = (valor) => (valor ? String(valor).slice(0, 16) : "");

/** Un <input type="datetime-local"> da "2026-10-05T18:00"; el backend espera segundos ("...:00"). */
export const paraBackend = (valor) => (valor && valor.length === 16 ? valor + ":00" : valor);
