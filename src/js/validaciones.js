/*
 * Validaciones del lado del cliente. Los mensajes estan escritos para que cualquier persona
 * entienda que paso y como corregirlo. El backend vuelve a validar todo: esto es ayuda al usuario.
 */

// ---------- Patrones para atributos "pattern" de los <input> ----------
export const PATRON_DNI = "[0-9]{7,8}";
// Parentesis y guion escapados: los navegadores actuales compilan "pattern" en modo estricto.
export const PATRON_TELEFONO = "[0-9 +\\(\\)\\-]{8,20}";
export const PATRON_PIN = "[0-9]{4}";
export const PATRON_USUARIO = "[a-zA-Z0-9._\\-]{3,30}";

/**
 * Valida un formulario completo. Si algun campo es invalido, cada <Campo> muestra su mensaje
 * y el foco va al primer campo con error. Devuelve true si todo esta bien.
 */
export function validarFormulario(form) {
  const valido = form.checkValidity();
  if (!valido) form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
  return valido;
}

// ---------- Tarjeta de credito / debito (SIMULACION: nunca se envia ni se guarda) ----------

/** "4111111111111111" -> "4111 1111 1111 1111" (acepta hasta 19 digitos). */
export function formatearNumeroTarjeta(texto) {
  return texto.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

/** "1228" -> "12/28". Escribir solo el mes agrega la barra automaticamente. */
export function formatearVencimiento(texto) {
  const digitos = texto.replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2 ? digitos.slice(0, 2) + "/" + digitos.slice(2) : digitos;
}

/** Algoritmo de Luhn: detecta numeros de tarjeta mal tipeados. */
export function numeroTarjetaValido(texto) {
  const digitos = texto.replace(/\D/g, "");
  if (digitos.length < 13 || digitos.length > 19) return false;
  let suma = 0;
  for (let i = 0; i < digitos.length; i++) {
    let n = Number(digitos[digitos.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    suma += n;
  }
  return suma % 10 === 0;
}

/** Devuelve "" si el vencimiento MM/AA es valido y no esta vencido, o el mensaje de error. */
export function errorVencimiento(texto, hoy = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(texto);
  if (!m) return "Escribi el vencimiento como MM/AA, por ejemplo 08/28.";
  const mes = Number(m[1]);
  const anio = 2000 + Number(m[2]);
  if (mes < 1 || mes > 12) return "El mes debe estar entre 01 y 12.";
  const vencida = anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1);
  return vencida ? "La tarjeta esta vencida." : "";
}

export const cvvValido = (texto) => /^\d{3,4}$/.test(texto);
