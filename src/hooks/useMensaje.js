import { useState } from "react";

/** Estado del mensaje de exito/error que muestra cada pagina (ver componente <Mensaje>). */
export default function useMensaje() {
  const [mensaje, setMensaje] = useState({ texto: "", error: false });
  const avisar = (texto) => setMensaje({ texto, error: false });
  const avisarError = (texto) => setMensaje({ texto, error: true });
  const limpiar = () => setMensaje({ texto: "", error: false });

  /**
   * Ejecuta una accion contra el backend y comunica el resultado: muestra el mensaje de exito
   * (texto fijo o funcion del resultado) o el error del servidor. "despues" corre solo si salio bien.
   */
  async function ejecutar(accion, textoExito, despues) {
    try {
      const resultado = await accion();
      avisar(typeof textoExito === "function" ? textoExito(resultado) : textoExito);
      if (despues) await despues(resultado);
    } catch (e) {
      avisarError(e.message);
    }
  }

  return { mensaje, avisar, avisarError, limpiar, ejecutar };
}
