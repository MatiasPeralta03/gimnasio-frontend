/*
 * Funciones comunes para hablar con el backend (se cargan antes que el script de cada pagina).
 *
 * El HTML es quien declara el metodo, la URL y los mensajes:
 *   - method="get" | "post"        -> atributo method del <form>
 *   - data-metodo="PUT" | "DELETE" -> atributo del <form> (HTML solo admite GET y POST)
 *   - action="/api/socios/{id}"    -> URL del endpoint
 *   - data-ok="Texto de exito"     -> mensaje a mostrar si salio bien ({campo} se reemplaza
 *                                     por un dato de la respuesta del servidor)
 *   - data-confirmar="Texto"       -> pregunta de confirmacion antes de enviar
 * Este archivo solo ejecuta lo que dice el HTML.
 */

/** Metodo HTTP declarado en el formulario. */
function metodoDe(form) {
    return (form.dataset.metodo || form.getAttribute("method") || "get").toUpperCase();
}

/** Pasa los campos del formulario a un objeto (los input number se envian como numero). */
function datosDe(form) {
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

/**
 * Envia el formulario al backend usando el metodo y la action que dice el HTML.
 * Devuelve el JSON de la respuesta (o null si no hay body, ej: 204).
 * Si el backend responde con error lanza un Error con el mensaje ("detail").
 */
async function enviar(form) {
    const metodo = metodoDe(form);
    const opciones = { method: metodo, headers: { Accept: "application/json" } };
    if (metodo === "POST" || metodo === "PUT") {
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify(datosDe(form));
    }
    return pedir(form.getAttribute("action"), opciones);
}

/** GET a una URL (la URL se declara en el HTML, en data-url o en el action del form). */
async function obtener(url) {
    return pedir(url, { method: "GET", headers: { Accept: "application/json" } });
}

async function pedir(url, opciones) {
    let respuesta;
    try {
        respuesta = await fetch(url, opciones);
    } catch (e) {
        throw new Error("No se pudo conectar con el servidor. Verifique que el backend este corriendo.");
    }
    if (respuesta.status === 204) return null;
    const texto = await respuesta.text();
    let json = null;
    try {
        json = texto ? JSON.parse(texto) : null;
    } catch (e) {
        // la respuesta no es JSON
    }
    if (!respuesta.ok) {
        throw new Error((json && (json.detail || json.title)) || "Error " + respuesta.status);
    }
    return json;
}

/**
 * Maneja el envio de un formulario: confirma (si el HTML lo pide), envia, muestra el
 * mensaje de exito del HTML o el error del servidor, y ejecuta "despues" si salio bien.
 */
async function enviarFormulario(form, elementoMensaje, despues) {
    if (form.dataset.confirmar && !confirm(form.dataset.confirmar)) return;
    try {
        const respuesta = await enviar(form);
        mostrarMensaje(elementoMensaje, plantilla(form.dataset.ok, respuesta), false);
        if (despues) despues(respuesta);
    } catch (e) {
        mostrarMensaje(elementoMensaje, e.message, true);
    }
}

/** Reemplaza {campo} por datos[campo] en un texto. */
function plantilla(texto, datos) {
    return (texto || "").replace(/\{(\w+)\}/g, (_, clave) =>
        datos && datos[clave] !== undefined && datos[clave] !== null ? datos[clave] : ""
    );
}

/** Muestra un mensaje en un <p class="mensaje">. */
function mostrarMensaje(elemento, texto, esError) {
    elemento.textContent = texto;
    elemento.classList.toggle("error", Boolean(esError));
}

/** Copia un objeto en los campos del formulario que tengan el mismo name. */
function llenarFormulario(form, objeto) {
    for (const campo of form.elements) {
        if (campo.name && objeto[campo.name] !== undefined && objeto[campo.name] !== null) {
            campo.value = objeto[campo.name];
        }
    }
}

/** Reemplaza {id} en el action de un formulario. */
function asignarId(form, id) {
    form.setAttribute("action", form.getAttribute("action").replace("{id}", id));
}

/** Crea una celda <td> con texto (textContent evita inyectar HTML). */
function celda(texto) {
    const td = document.createElement("td");
    td.textContent = texto ?? "";
    return td;
}

/** Completa los <dd data-campo="..."> de un detalle con los datos del objeto. */
function llenarDetalle(contenedor, datos, formatos = {}) {
    contenedor.querySelectorAll("[data-campo]").forEach((el) => {
        const campo = el.dataset.campo;
        const valor = formatos[campo] ? formatos[campo](datos) : datos[campo];
        el.textContent = valor ?? "-";
    });
}

function formatoPrecio(valor) {
    return "$ " + Number(valor).toFixed(2);
}
