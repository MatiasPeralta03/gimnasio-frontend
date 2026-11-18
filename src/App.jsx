import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Encabezado from "./componentes/Encabezado.jsx";
import Pie from "./componentes/Pie.jsx";
import RutaProtegida from "./componentes/RutaProtegida.jsx";
import Inicio from "./paginas/Inicio.jsx";
import Login from "./paginas/Login.jsx";
import Socios from "./paginas/Socios.jsx";
import Clases from "./paginas/Clases.jsx";
import Productos from "./paginas/Productos.jsx";
import Ventas from "./paginas/Ventas.jsx";
import Empleados from "./paginas/Empleados.jsx";
import Acerca from "./paginas/Acerca.jsx";
import Politicas from "./paginas/Politicas.jsx";
import NoEncontrada from "./paginas/NoEncontrada.jsx";
import { cerrarSesion, obtenerSesion } from "./js/sesion.js";

/** Estructura comun de todas las pantallas: encabezado, contenido (rutas) y pie. */
export default function App() {
  const { pathname } = useLocation();
  const contenido = useRef(null);
  const rutaAnterior = useRef(pathname);
  // Quien inicio sesion ({ usuario, nombre, rol }) o null. Arranca con lo guardado en sessionStorage.
  const [sesion, setSesion] = useState(obtenerSesion);

  function salir() {
    cerrarSesion();
    setSesion(null);
  }

  // Al cambiar de pantalla, el foco pasa al contenido (quien usa teclado o lector no queda en el menu).
  // Al abrir el sitio no se mueve: asi el primer Tab llega al enlace "Saltar al contenido".
  useEffect(() => {
    if (rutaAnterior.current === pathname) return;
    rutaAnterior.current = pathname;
    window.scrollTo(0, 0);
    contenido.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Pantallas de gestion: cualquier usuario logueado. Empleados: solo ADMIN.
  const protegida = (pagina, roles) => (
    <RutaProtegida sesion={sesion} roles={roles}>
      {pagina}
    </RutaProtegida>
  );

  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <Encabezado sesion={sesion} onSalir={salir} />
      <main id="contenido" ref={contenido} tabIndex={-1}>
        <Routes>
          {/* Publicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login sesion={sesion} onLogin={setSesion} />} />
          <Route path="/acerca" element={<Acerca />} />
          <Route path="/politicas" element={<Politicas />} />
          {/* Con sesion */}
          <Route path="/socios" element={protegida(<Socios />)} />
          <Route path="/clases" element={protegida(<Clases />)} />
          <Route path="/productos" element={protegida(<Productos />)} />
          <Route path="/ventas" element={protegida(<Ventas />)} />
          <Route path="/empleados" element={protegida(<Empleados />, ["ADMIN"])} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Pie />
    </>
  );
}
