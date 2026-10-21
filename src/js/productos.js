/*
 * Logica de Productos: llamadas al backend y datos listos para mostrar.
 * Los textos de los mensajes al usuario NO estan aca: los define la pagina (HTML/JSX).
 */
import { enviar, obtener } from "./api.js";

/** Solo los productos activos (los dados de baja no se muestran). */
export const listarProductos = () => obtener("/api/productos?soloDisponibles=true");

export const obtenerProducto = (id) => obtener("/api/productos/" + id);

/**
 * Envia un <form> de productos (alta, modificacion o borrado).
 * El metodo HTTP y la URL los declara el propio formulario en el HTML.
 */
export const enviarFormularioProducto = (form) => enviar(form);

export const formatoPrecio = (valor) => "$ " + Number(valor).toFixed(2);

/** Pares [titulo, valor] para la ventana de detalle. */
export function datosDetalleProducto(p) {
  return [
    ["ID", p.id],
    ["Nombre", p.nombre],
    ["Precio", formatoPrecio(p.precio)],
    ["Stock", p.stock],
  ];
}
