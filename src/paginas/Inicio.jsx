import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <>
      <section className="portada">
        <h2>Bienvenido a tu gimnasio</h2>
        <p>Gestion de socios, membresias y kiosco en un solo lugar.</p>
        <p><Link to="/socios">Ver socios</Link> | <Link to="/productos">Ver productos</Link></p>
      </section>

      <section>
        <h2>Que podes hacer</h2>
        <div className="tarjetas">
          <article>
            <h3>Socios</h3>
            <p>Alta presencial, edicion de datos, regeneracion de PIN y baja de socios.</p>
            <p><Link to="/socios">Ir a socios</Link></p>
          </article>
          <article>
            <h3>Productos</h3>
            <p>Catalogo del kiosco: consulta, detalle, modificacion y borrado.</p>
            <p><Link to="/productos">Ir a productos</Link></p>
          </article>
          <article>
            <h3>Comprar</h3>
            <p>Simulacion del proceso de compra en el kiosco.</p>
            <p><Link to="/compra">Ir a comprar</Link></p>
          </article>
        </div>
      </section>
    </>
  );
}
