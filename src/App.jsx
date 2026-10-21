import { Routes, Route } from "react-router-dom";
import Encabezado from "./componentes/Encabezado.jsx";
import Inicio from "./paginas/Inicio.jsx";
import Socios from "./paginas/Socios.jsx";
import Productos from "./paginas/Productos.jsx";
import Compra from "./paginas/Compra.jsx";
import Acerca from "./paginas/Acerca.jsx";

export default function App() {
  return (
    <>
      <Encabezado />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/compra" element={<Compra />} />
          <Route path="/acerca" element={<Acerca />} />
        </Routes>
      </main>
      <footer>
        <p>Aplicaciones Interactivas - UADE - 2do Cuatrimestre 2026</p>
      </footer>
    </>
  );
}
