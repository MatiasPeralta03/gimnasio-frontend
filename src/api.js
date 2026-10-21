/*
 * Funciones comunes para hablar con el backend.
 * El metodo HTTP y la URL NO se escriben aca: se leen del HTML (JSX):
 *   - method="get" | "post"        -> atributo method del <form>
 *   - data-metodo="PUT" | "DELETE" -> atributo del <form> (HTML solo admite GET y POST)
 *   - action="/api/socios/1"       -> URL del endpoint
 */

/** Metodo HTTP declarado en el formulario. */
export function metodoDe(form) {
  return (form.dataset.metodo || form.getAttribute("method") || "get").toUpperCase();
}

/** Pasa los campos del formulario a un objeto (los input number se envian como numero). */
function datosDe(form) {
  const datos = {};
  for (const campo of form.elements) {
    if (!campo.name || campo.disabled) continue;
    if (campo.type === "radio" && !campo.checked) continue;
    datos[campo.name] =
      campo.type === "number" ? (campo.value === "" ? null : Number(campo.value)) : campo.value;
  }
  return datos;
}

/** Envia el formulario con el metodo y la action que declara el HTML. */
export function enviar(form) {
  const metodo = metodoDe(form);
  const opciones = { method: metodo, headers: { Accept: "application/json" } };
  if (metodo === "POST" || metodo === "PUT") {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(datosDe(form));
  }
  return pedir(form.getAttribute("action"), opciones);
}

/** GET a la url indicada (la url se declara en el HTML del componente). */
export function obtener(url) {
  return pedir(url, { method: "GET", headers: { Accept: "application/json" } });
}

async function pedir(url, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifique que el backend este corriendo.");
  }
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  let json = null;
  try {
    json = texto ? JSON.parse(texto) : null;
  } catch {
    // la respuesta no es JSON
  }
  if (!respuesta.ok) {
    throw new Error((json && (json.detail || json.title)) || "Error " + respuesta.status);
  }
  return json;
}
