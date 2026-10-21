export default function Acerca() {
  return (
    <>
      <section>
        <h2>Acerca de la compañía</h2>
        {/* TODO: ajustar la descripcion con los datos reales de la compañía del grupo */}
        <p>
          Gimnasio de Barrio es un gimnasio de cercania que ofrece clases grupales, acceso a sala
          de musculacion y un kiosco con productos para deportistas. Nuestro objetivo es brindar
          un servicio simple y cercano, con membresias mensuales, trimestrales y anuales.
        </p>
        <p>
          Este sitio es parte de un trabajo practico de Aplicaciones Interactivas (UADE): un
          sistema de gestion de socios, clases, ingresos, kiosco y cobros.
        </p>
      </section>

      <section>
        <h2>Integrantes del grupo</h2>
        {/* TODO: reemplazar por los datos reales del grupo */}
        <ul>
          <li><strong>Nombre Apellido</strong> - Legajo 000000</li>
          <li><strong>Nombre Apellido</strong> - Legajo 000000</li>
          <li><strong>Nombre Apellido</strong> - Legajo 000000</li>
          <li><strong>Nombre Apellido</strong> - Legajo 000000</li>
        </ul>
      </section>

      <section>
        <h2>Tecnologias</h2>
        <ul>
          <li>Back-end: Java, Spring Boot, JPA/Hibernate, MySQL (API REST en JSON)</li>
          <li>Front-end: React, HTML5 y CSS</li>
        </ul>
      </section>
    </>
  );
}
