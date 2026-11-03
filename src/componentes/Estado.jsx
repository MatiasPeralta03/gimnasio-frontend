/**
 * Comunica los estados de una lista: cargando, error (con boton para reintentar) o vacia.
 * Si no hay nada de eso, muestra el contenido (children).
 */
export default function Estado({ cargando, error, vacio, textoVacio, recargar, children }) {
  if (cargando) {
    return (
      <p className="estado" role="status">
        Cargando...
      </p>
    );
  }
  if (error) {
    return (
      <div className="estado error" role="alert">
        <p>{error}</p>
        {recargar && (
          <button type="button" className="secundario" onClick={recargar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }
  if (vacio) return <p className="estado">{textoVacio}</p>;
  return children;
}
