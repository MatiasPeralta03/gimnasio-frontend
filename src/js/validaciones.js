/*
 * Validaciones del lado del cliente. Los mensajes estan escritos para que cualquier persona
 * entienda que paso y como corregirlo. El backend sigue siendo quien aplica las reglas de negocio.
 */

// ---------- Patrones para atributos "pattern" de los <input> ----------
export const PATRON_DNI = "[0-9]{7,8}";
// Parentesis y guion escapados: los navegadores actuales compilan "pattern" en modo estricto.
export const PATRON_TELEFONO = "[0-9 +\\(\\)\\-]{8,20}";
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
