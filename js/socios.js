/*
 * Logica de la pagina de socios. El HTML declara los metodos, URLs y mensajes;
 * este archivo arma la tabla y conecta los formularios con api.js.
 */
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tabla-socios");
const filaModelo = document.getElementById("fila-socio");
const dialogoDetalle = document.getElementById("dialogo-detalle");
const dialogoEditar = document.getElementById("dialogo-editar");
const formAlta = document.getElementById("form-alta");
const formEditar = document.getElementById("form-editar");
const botonRecargar = document.getElementById("boton-recargar");

// El action de edicion trae {id}: guardamos el modelo para reusarlo.
const actionEditarModelo = formEditar.getAttribute("action");

const filtroEstado = document.getElementById("filtro-estado");
let sociosCargados = [];

async function cargarSocios() {
    try {
        sociosCargados = await obtener(botonRecargar.dataset.url);
        mostrarSocios();
    } catch (e) {
        mostrarMensaje(mensaje, e.message, true);
    }
}

/** Dibuja la tabla segun el filtro elegido (todos / activos / bajas). */
function mostrarSocios() {
    const filtro = filtroEstado.value;
    const socios = sociosCargados.filter(
        (s) => filtro === "todos" || (filtro === "activos" ? s.activo : !s.activo)
    );
    tabla.replaceChildren();
    if (socios.length === 0) {
        const fila = document.createElement("tr");
        const td = celda(tabla.dataset.vacio);
        td.colSpan = 8;
        fila.append(td);
        tabla.append(fila);
    }
    socios.forEach((socio) => tabla.append(crearFila(socio)));
}

filtroEstado.addEventListener("change", mostrarSocios);
document.getElementById("form-filtro").addEventListener("submit", (e) => e.preventDefault());

function crearFila(socio) {
    const fila = filaModelo.content.firstElementChild.cloneNode(true);
    fila.querySelector('[data-campo="id"]').textContent = socio.id;
    fila.querySelector('[data-campo="dni"]').textContent = socio.dni;
    fila.querySelector('[data-campo="nombre"]').textContent = socio.nombre;
    fila.querySelector('[data-campo="apellido"]').textContent = socio.apellido;
    fila.querySelector('[data-campo="membresia"]').textContent = socio.membresia;
    fila.querySelector('[data-campo="estado"]').textContent = socio.activo ? "Activo" : "Baja";

    fila.querySelector('[data-campo="deuda"]').textContent = formatoPrecio(socio.deuda);

    // "Pagar deuda" solo aparece si el socio debe algo.
    const botonPagar = fila.querySelector('[data-accion="pagar"]');
    if (socio.deuda > 0) {
        botonPagar.addEventListener("click", () => abrirPago(socio));
    } else {
        botonPagar.remove();
    }

    fila.querySelectorAll("form").forEach((form) => asignarId(form, socio.id));

    const botonDetalle = fila.querySelector('[data-accion="detalle"]');
    botonDetalle.dataset.url = botonDetalle.dataset.url.replace("{id}", socio.id);
    botonDetalle.addEventListener("click", () => verDetalle(botonDetalle.dataset.url));

    fila.querySelector('[data-accion="editar"]').addEventListener("click", () => abrirEdicion(socio));

    // Un socio activo se puede dar de baja; uno dado de baja se puede volver a dar de alta.
    fila.querySelector('[data-accion="' + (socio.activo ? "alta" : "baja") + '"]').remove();

    for (const accion of ["pin", "baja", "alta"]) {
        const form = fila.querySelector('[data-accion="' + accion + '"]');
        if (!form) continue;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            enviarFormulario(form, mensaje, accion === "pin" ? null : cargarSocios);
        });
    }
    return fila;
}

async function verDetalle(url) {
    try {
        const socio = await obtener(url);
        llenarDetalle(document.getElementById("datos-detalle"), socio, {
            deuda: (s) => formatoPrecio(s.deuda),
            activo: (s) => (s.activo ? "Activo" : "Baja"),
        });
        dialogoDetalle.showModal();
    } catch (e) {
        mostrarMensaje(mensaje, e.message, true);
    }
}

function abrirEdicion(socio) {
    formEditar.setAttribute("action", actionEditarModelo);
    asignarId(formEditar, socio.id);
    llenarFormulario(formEditar, socio);
    dialogoEditar.showModal();
}

// ALTA
formAlta.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarFormulario(formAlta, mensaje, () => {
        formAlta.reset();
        cargarSocios();
    });
});

// MODIFICACION
formEditar.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarFormulario(formEditar, mensaje, () => {
        dialogoEditar.close();
        cargarSocios();
    });
});

document.getElementById("cancelar-editar").addEventListener("click", () => dialogoEditar.close());

// PAGO DE DEUDA (POST /api/pagos, segun declara el form en el HTML)
const dialogoPagar = document.getElementById("dialogo-pagar");
const formPagar = document.getElementById("form-pagar");

function abrirPago(socio) {
    formPagar.reset();
    document.getElementById("pagar-socioId").value = socio.id;
    document.getElementById("pagar-monto").max = socio.deuda;
    document.getElementById("pagar-monto").value = socio.deuda;
    const texto = document.getElementById("texto-pagar");
    texto.textContent = plantilla(texto.dataset.texto, {
        nombre: socio.nombre,
        apellido: socio.apellido,
        deuda: formatoPrecio(socio.deuda),
    });
    dialogoPagar.showModal();
}

formPagar.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarFormulario(formPagar, mensaje, () => {
        dialogoPagar.close();
        cargarSocios();
    });
});

document.getElementById("cancelar-pagar").addEventListener("click", () => dialogoPagar.close());
botonRecargar.addEventListener("click", cargarSocios);
cargarSocios();
