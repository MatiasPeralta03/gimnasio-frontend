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

async function cargarSocios() {
    try {
        const socios = await obtener(botonRecargar.dataset.url);
        tabla.replaceChildren();
        if (socios.length === 0) {
            const fila = document.createElement("tr");
            const td = celda(tabla.dataset.vacio);
            td.colSpan = 7;
            fila.append(td);
            tabla.append(fila);
        }
        socios.forEach((socio) => tabla.append(crearFila(socio)));
    } catch (e) {
        mostrarMensaje(mensaje, e.message, true);
    }
}

function crearFila(socio) {
    const fila = filaModelo.content.firstElementChild.cloneNode(true);
    fila.querySelector('[data-campo="id"]').textContent = socio.id;
    fila.querySelector('[data-campo="dni"]').textContent = socio.dni;
    fila.querySelector('[data-campo="nombre"]').textContent = socio.nombre;
    fila.querySelector('[data-campo="apellido"]').textContent = socio.apellido;
    fila.querySelector('[data-campo="membresia"]').textContent = socio.membresia;
    fila.querySelector('[data-campo="estado"]').textContent = socio.activo ? "Activo" : "Baja";

    fila.querySelectorAll("form").forEach((form) => asignarId(form, socio.id));

    const botonDetalle = fila.querySelector('[data-accion="detalle"]');
    botonDetalle.dataset.url = botonDetalle.dataset.url.replace("{id}", socio.id);
    botonDetalle.addEventListener("click", () => verDetalle(botonDetalle.dataset.url));

    fila.querySelector('[data-accion="editar"]').addEventListener("click", () => abrirEdicion(socio));

    for (const accion of ["pin", "baja"]) {
        const form = fila.querySelector('[data-accion="' + accion + '"]');
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            enviarFormulario(form, mensaje, accion === "baja" ? cargarSocios : null);
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
botonRecargar.addEventListener("click", cargarSocios);
cargarSocios();
