/** Lista de definicion con pares [titulo, valor]. */
export default function Detalle({ datos }) {
  return (
    <dl>
      {datos.map(([titulo, valor]) => (
        <div key={titulo}>
          <dt>{titulo}</dt>
          <dd>{valor ?? "-"}</dd>
        </div>
      ))}
    </dl>
  );
}
