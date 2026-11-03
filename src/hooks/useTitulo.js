import { useEffect } from "react";

/** Cambia el titulo de la pestaña: ayuda a quien usa lector de pantalla a saber en que pagina esta. */
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo + " - Gimnasio de Barrio";
  }, [titulo]);
}
