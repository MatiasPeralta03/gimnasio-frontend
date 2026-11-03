/**
 * Tabla de datos accesible: <caption>, encabezados con scope="col".
 * En celular cada fila se ve como una tarjeta (cada <td> lleva data-label con el nombre de su columna).
 */
export default function Tabla({ titulo, columnas, children }) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-datos">
        <caption>{titulo}</caption>
        <thead>
          <tr>
            {columnas.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
