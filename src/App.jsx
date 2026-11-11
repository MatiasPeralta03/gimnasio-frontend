import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Encabezado from "./componentes/Encabezado.jsx";
import Pie from "./componentes/Pie.jsx";
import Inicio from "./paginas/Inicio.jsx";
import Socios from "./paginas/Socios.jsx";
import Clases from "./paginas/Clases.jsx";
import Productos from "./paginas/Productos.jsx";
import Compra from "./paginas/Compra.jsx";
import Empleados from "./paginas/Empleados.jsx";
import Acerca from "./paginas/Acerca.jsx";
import Politicas from "./paginas/Politicas.jsx";
import NoEncontrada from "./paginas/NoEncontrada.jsx";

/** Estructura comun de todas las pantallas: encabezado, contenido (rutas) y pie. */
export default function App() {
  const { pathname } = useLocation();
  const contenido = useRef(null);
  const rutaAnterior = useRef(pathname);

  // Al cambiar de pantalla, el foco pasa al contenido (quien usa teclado o lector no queda en el menu).
  // Al abrir el sitio no se mueve: asi el primer Tab llega al enlace "Saltar al contenido".
  useEffect(() => {
    if (rutaAnterior.current === pathname) return;
    rutaAnterior.current = pathname;
    window.scrollTo(0, 0);
    contenido.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <Encabezado />
      <main id="contenido" ref={contenido} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/acerca" element={<Acerca />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Pie />
    </>
  );
}
