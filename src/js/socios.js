/*
 * Logica de Socios: llamadas al backend y datos listos para mostrar.
 * Los textos de los mensajes al usuario NO estan aca: los define la pagina (HTML/JSX).
 */
import { enviar, obtener } from "./api.js";

export const listarSocios = () => obtener("/api/socios");

export const obtenerSocio = (id) => obtener("/api/socios/" + id);

/**
 * Envia un <form> de socios (alta, modificacion, nuevo PIN o baja).
 * El metodo HTTP y la URL los declara el propio formulario en el HTML.
 */
export const enviarFormularioSocio = (form) => enviar(form);

export const estadoDeSocio = (socio) => (socio.activo ? "Activo" : "Baja");

export const nombreCompleto = (socio) => socio.nombre + " " + socio.apellido;

/** Pares [titulo, valor] para la ventana de detalle. */
export function datosDetalleSocio(s) {
  return [
    ["ID", s.id],
    ["DNI", s.dni],
    ["PIN", s.pin],
    ["Nombre", s.nombre],
    ["Apellido", s.apellido],
    ["Email", s.email],
    ["Telefono", s.telefono],
    ["Membresia", s.membresia],
    ["Medio de pago", s.medioPago],
    ["Deuda", "$ " + s.deuda],
    ["Estado", estadoDeSocio(s)],
    ["Fecha de alta", s.fechaAlta],
  ];
}
