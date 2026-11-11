/*
 * Validaciones del lado del cliente. Los mensajes estan escritos para que cualquier persona
 * entienda que paso y como corregirlo. El backend sigue siendo quien aplica las reglas de negocio.
 */

// ---------- Patrones para atributos "pattern" de los <input> ----------
export const PATRON_DNI = "[0-9]{7,8}";
// Parentesis y guion escapados: los navegadores actuales compilan "pattern" en modo estricto.
export const PATRON_TELEFONO = "[0-9 +\\(\\)\\-]{8,20}";
export const PATRON_USUARIO = "[a-zA-Z0-9._\\-]{3,30}";
// Nombre o apellido: letras, espacios, apostrofe o guion, y al menos 2 letras al principio.
// Los espacios de los extremos se aceptan porque api.js los recorta antes de enviar.
export const PATRON_NOMBRE = " *[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ' \\-]{1,99}";
// Texto libre (producto, actividad): tiene que tener algo ademas de espacios ("   " no pasa).
export const PATRON_TEXTO = "\\s*\\S.*";

// Topes para que no entren valores absurdos (un precio de 1 billon o una clase en el año 9999).
export const PRECIO_MAXIMO = 10000000;
export const STOCK_MAXIMO = 100000;

/**
 * Valida un formulario completo. Si algun campo es invalido, cada <Campo> muestra su mensaje
 * y el foco va al primer campo con error. Devuelve true si todo esta bien.
 */
export function validarFormulario(form) {
  const valido = form.checkValidity();
  if (!valido) form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
  return valido;
}
