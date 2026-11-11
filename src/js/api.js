/*
 * Comunicacion con el backend. Es lo unico que hace "fetch" en todo el front.
 *
 * El HTML (JSX) declara el metodo y la URL de cada formulario:
 *   - method="get" | "post"        -> atributo method del <form>
 *   - data-metodo="PUT" | "DELETE" -> atributo del <form> (HTML solo admite GET y POST)
 *   - action="/api/socios/1"       -> URL del endpoint
 * Estas funciones solo ejecutan lo que dice el HTML.
 */

/** Metodo HTTP declarado en el formulario. */
export function metodoDe(form) {
  return (form.dataset.metodo || form.getAttribute("method") || "get").toUpperCase();
}

/** Pasa los campos con "name" del formulario a un objeto (los input number van como numero). */
export function datosDe(form) {
  const datos = {};
  for (const campo of form.elements) {
    if (!campo.name || campo.disabled) continue;
    if (campo.type === "radio" && !campo.checked) continue;
    if (campo.type === "number") {
      datos[campo.name] = campo.value === "" ? null : Number(campo.value);
    } else {
      datos[campo.name] = campo.value;
    }
  }
  return datos;
}

/** Envia el formulario con el metodo y la action que declara el HTML. */
export function enviar(form, datos = datosDe(form)) {
  const metodo = metodoDe(form);
  const opciones = { method: metodo, headers: { Accept: "application/json" } };
  if (metodo === "POST" || metodo === "PUT") {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(datos);
  }
  return pedir(form.getAttribute("action"), opciones);
}

/** GET a una URL (la URL la declara cada pagina). */
export function obtener(url) {
  return pedir(url, { method: "GET", headers: { Accept: "application/json" } });
}

const ERROR_DEL_SERVIDOR = "El servidor no pudo procesar el pedido. Revisá que los datos no estén repetidos e intentá de nuevo.";

async function pedir(url, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
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
    throw new Error(json?.detail || (respuesta.status >= 500 ? ERROR_DEL_SERVIDOR : json?.title) || ERROR_DEL_SERVIDOR);
  }
  return json;
}
