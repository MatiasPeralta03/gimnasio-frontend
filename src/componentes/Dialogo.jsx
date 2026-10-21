import { useEffect, useRef } from "react";

/** <dialog> nativo controlado por la prop "abierto". */
export default function Dialogo({ abierto, onCerrar, titulo, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog ref={ref} onClose={onCerrar} aria-label={titulo}>
      <h3>{titulo}</h3>
      {children}
    </dialog>
  );
}
