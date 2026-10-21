/*
 * Logica de la pagina de productos. El HTML declara los metodos, URLs y mensajes;
 * este archivo arma la tabla y conecta los formularios con api.js.
 */
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tabla-productos");
const filaModelo = document.getElementById("fila-producto");
const dialogoDetalle = document.getElementById("dialogo-detalle");
const dialogoEditar = document.getElementById("dialogo-editar");
const formAlta = document.getElementById("form-alta");
const formEditar = document.getElementById("form-editar");
const botonRecargar = document.getElementById("boton-recargar");

const actionEditarModelo = formEditar.getAttribute("action");

async function cargarProductos() {
    try {
        const productos = await obtener(botonRecargar.dataset.url);
        tabla.replaceChildren();
        if (productos.length === 0) {
            const fila = document.createElement("tr");
            const td = celda(tabla.dataset.vacio);
            td.colSpan = 5;
            fila.append(td);
            tabla.append(fila);
        }
        productos.forEach((producto) => tabla.append(crearFila(producto)));
    } catch (e) {
        mostrarMensaje(mensaje, e.message, true);
    }
}

function crearFila(producto) {
    const fila = filaModelo.content.firstElementChild.cloneNode(true);
    fila.querySelector('[data-campo="id"]').textContent = producto.id;
    fila.querySelector('[data-campo="nombre"]').textContent = producto.nombre;
    fila.querySelector('[data-campo="precio"]').textContent = formatoPrecio(producto.precio);
    fila.querySelector('[data-campo="stock"]').textContent = producto.stock;

    fila.querySelectorAll("form").forEach((form) => asignarId(form, producto.id));

    const botonDetalle = fila.querySelector('[data-accion="detalle"]');
    botonDetalle.dataset.url = botonDetalle.dataset.url.replace("{id}", producto.id);
    botonDetalle.addEventListener("click", () => verDetalle(botonDetalle.dataset.url));

    fila.querySelector('[data-accion="editar"]').addEventListener("click", () => abrirEdicion(producto));

    const formBorrar = fila.querySelector('[data-accion="borrar"]');
    formBorrar.addEventListener("submit", (e) => {
        e.preventDefault();
        enviarFormulario(formBorrar, mensaje, cargarProductos);
    });
    return fila;
}

async function verDetalle(url) {
    try {
        const producto = await obtener(url);
        llenarDetalle(document.getElementById("datos-detalle"), producto, {
            precio: (p) => formatoPrecio(p.precio),
        });
        dialogoDetalle.showModal();
    } catch (e) {
        mostrarMensaje(mensaje, e.message, true);
    }
}

function abrirEdicion(producto) {
    formEditar.setAttribute("action", actionEditarModelo);
    asignarId(formEditar, producto.id);
    llenarFormulario(formEditar, producto);
    dialogoEditar.showModal();
}

// ALTA
formAlta.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarFormulario(formAlta, mensaje, () => {
        formAlta.reset();
        cargarProductos();
    });
});

// MODIFICACION
formEditar.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarFormulario(formEditar, mensaje, () => {
        dialogoEditar.close();
        cargarProductos();
    });
});

document.getElementById("cancelar-editar").addEventListener("click", () => dialogoEditar.close());
botonRecargar.addEventListener("click", cargarProductos);
cargarProductos();
