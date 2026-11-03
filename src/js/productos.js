/* Logica de Productos del kiosco: consultas, filtros y orden. */
import { obtener } from "./api.js";
import { formatoPrecio } from "./formatos.js";

/** Solo los productos activos (los dados de baja no se muestran). */
export const listarProductos = () => obtener("/api/productos?soloDisponibles=true");
export const obtenerProducto = (id) => obtener("/api/productos/" + id);

export const hayStock = (producto) => producto.stock > 0;

/**
 * Filtra por texto y por stock ("todos" | "conStock" | "sinStock") y ordena
 * ("nombre" | "precioAsc" | "precioDesc").
 */
export function filtrarProductos(productos, { texto, stock, orden }) {
  const buscado = texto.trim().toLowerCase();
  const filtrados = productos.filter((p) => {
    if (stock === "conStock" && !hayStock(p)) return false;
    if (stock === "sinStock" && hayStock(p)) return false;
    return !buscado || p.nombre.toLowerCase().includes(buscado);
  });
  const comparadores = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
    precioAsc: (a, b) => a.precio - b.precio,
    precioDesc: (a, b) => b.precio - a.precio,
  };
  return [...filtrados].sort(comparadores[orden] || comparadores.nombre);
}

export function datosDetalleProducto(p) {
  return [
    ["ID", p.id],
    ["Nombre", p.nombre],
    ["Precio", formatoPrecio(p.precio)],
    ["Stock", p.stock + (hayStock(p) ? " unidades" : " (agotado)")],
  ];
}
