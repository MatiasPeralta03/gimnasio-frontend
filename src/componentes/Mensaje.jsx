/**
 * Mensaje de exito o error. El contenedor existe siempre, asi los lectores de pantalla
 * anuncian el texto cuando aparece (aria-live).
 */
export default function Mensaje({ mensaje }) {
  return (
    <div className="zona-mensaje" aria-live="polite" aria-atomic="true">
      {mensaje.texto && <p className={"mensaje" + (mensaje.error ? " error" : "")}>{mensaje.texto}</p>}
    </div>
  );
}
