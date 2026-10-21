/*
 * Logica del flujo de compra (simulacion). El HTML declara las URLs y los mensajes;
 * este archivo carga los datos, calcula los totales y pasa de un paso al siguiente.
 */
const mensaje = document.getElementById("mensaje");
const pasos = [1, 2, 3, 4].map((n) => document.getElementById("paso-" + n));
const formProductos = document.getElementById("form-productos");
const formPago = document.getElementById("form-pago");
const tablaCompra = document.getElementById("tabla-compra");
const selectSocio = document.getElementById("compra-socio");

let productos = [];
let socios = [];
let items = []; // { producto, cantidad }

function irAlPaso(numero) {
    pasos.forEach((p, i) => p.classList.toggle("oculto", i !== numero - 1));
    mostrarMensaje(mensaje, "", false);
}

// PASO 1: listar productos con stock (la URL y el metodo salen del form)
async function cargarProductos() {
    try {
        const lista = await obtener(formProductos.getAttribute("action"));
        productos = lista.filter((p) => p.stock > 0);

        tablaCompra.replaceChildren();
        if (productos.length === 0) {
            const fila = document.createElement("tr");
            const td = celda(tablaCompra.dataset.vacio);
            td.colSpan = 4;
            fila.append(td);
            tablaCompra.append(fila);
        }
        for (const p of productos) {
            const fila = document.createElement("tr");
            const tdCantidad = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.max = p.stock;
            input.value = "0";
            input.name = "cantidad-" + p.id;
            input.setAttribute("aria-label", "Cantidad de " + p.nombre);
            tdCantidad.append(input);
            fila.append(celda(p.nombre), celda(formatoPrecio(p.precio)), celda(p.stock), tdCantidad);
            tablaCompra.append(fila);
        }
    } catch (e) {
        mostrarMensaje(mensaje, e.message, true);
    }
}

formProductos.addEventListener("submit", async (e) => {
    e.preventDefault();
    items = productos
        .map((p) => {
            const cantidad = Number(formProductos.elements["cantidad-" + p.id].value) || 0;
            return { producto: p, cantidad: Math.min(p.stock, Math.max(0, cantidad)) };
        })
        .filter((i) => i.cantidad > 0);
    if (items.length === 0) {
        mostrarMensaje(mensaje, formProductos.dataset.errorVacio, true);
        return;
    }
    try {
        const lista = await obtener(formPago.getAttribute("action"));
        socios = lista.filter((s) => s.activo);
        if (socios.length === 0) {
            mostrarMensaje(mensaje, formPago.dataset.errorSinSocios, true);
            return;
        }
        selectSocio.replaceChildren();
        for (const s of socios) {
            const opcion = document.createElement("option");
            opcion.value = s.id;
            opcion.textContent = s.apellido + ", " + s.nombre + " (DNI " + s.dni + ")";
            selectSocio.append(opcion);
        }
        irAlPaso(2);
    } catch (err) {
        mostrarMensaje(mensaje, err.message, true);
    }
});

// PASO 2 -> 3: armar el resumen
formPago.addEventListener("submit", (e) => {
    e.preventDefault();
    const resumen = document.getElementById("tabla-resumen");
    resumen.replaceChildren();
    let total = 0;
    for (const { producto, cantidad } of items) {
        const subtotal = producto.precio * cantidad;
        total += subtotal;
        const fila = document.createElement("tr");
        fila.append(celda(producto.nombre), celda(cantidad), celda(formatoPrecio(producto.precio)), celda(formatoPrecio(subtotal)));
        resumen.append(fila);
    }
    document.getElementById("total").textContent = formatoPrecio(total);
    const socio = socios.find((s) => String(s.id) === selectSocio.value);
    const pago = formPago.elements["pago"].value;
    document.getElementById("resumen-datos").textContent =
        "Socio: " + socio.nombre + " " + socio.apellido + " | Forma de pago: " + pago;
    irAlPaso(3);
});

document.getElementById("volver-1").addEventListener("click", () => irAlPaso(1));
document.getElementById("volver-2").addEventListener("click", () => irAlPaso(2));

// PASO 3: confirmacion simulada (no se envia nada al servidor)
const botonConfirmar = document.getElementById("confirmar");
botonConfirmar.addEventListener("click", () => {
    const total = document.getElementById("total").textContent;
    document.getElementById("texto-final").textContent = plantilla(botonConfirmar.dataset.ok, { total });
    irAlPaso(4);
});

cargarProductos();
