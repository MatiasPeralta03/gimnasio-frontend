import { useEffect, useId, useRef } from "react";

/**
 * Ventana modal con el elemento nativo <dialog>: el navegador se encarga de atrapar el foco,
 * cerrar con la tecla Escape y devolver el foco al boton que la abrio.
 */
export default function Dialogo({ abierto, onCerrar, titulo, grande = false, children }) {
  const ref = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const d = ref.current;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog ref={ref} onClose={onCerrar} aria-labelledby={idTitulo} className={grande ? "grande" : undefined}>
      <h2 id={idTitulo}>{titulo}</h2>
      {children}
    </dialog>
  );
}
