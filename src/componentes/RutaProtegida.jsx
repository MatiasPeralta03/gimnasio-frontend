import { Link, Navigate, useLocation } from "react-router-dom";
import { tienePermiso } from "../js/sesion.js";
import useTitulo from "../hooks/useTitulo.js";

/** Aviso para quien inicio sesion pero no tiene el rol necesario. */
function SinPermiso() {
  useTitulo("Sin permiso");
  return (
    <section className="panel">
      <h1>No tenés permiso para ver esta pantalla</h1>
      <p>Esta sección es solo para administradores. Podés volver al <Link to="/">inicio</Link> o usar el menú.</p>
    </section>
  );
}

/**
 * Envuelve una pantalla que necesita sesion.
 * - Sin sesion: lleva al login y recuerda a donde se queria ir (state.desde).
 * - Con sesion pero sin el rol pedido (ej: EMPLEADO en /empleados): muestra "sin permiso".
 * - Si esta todo bien: muestra la pantalla (children).
 */
export default function RutaProtegida({ sesion, roles, children }) {
  const location = useLocation();
  if (!sesion) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (!tienePermiso(sesion, roles)) return <SinPermiso />;
  return children;
}
