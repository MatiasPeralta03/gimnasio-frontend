import { useCallback } from "react";
import Estado from "./Estado.jsx";
import Tabla from "./Tabla.jsx";
import useDatos from "../hooks/useDatos.js";
import { historialDeSocio } from "../js/socios.js";
import { formatoDuracion, formatoFechaHora, formatoPrecio } from "../js/formatos.js";

const SIN_DATOS = { visitas: [], compras: [], pagos: [], clases: [] };

/** Contenido de la ventana de historial: visitas, compras, pagos y clases de un socio. */
export default function HistorialSocio({ socioId }) {
  const cargar = useCallback(() => historialDeSocio(socioId), [socioId]);
  const { datos: h, cargando, error, recargar } = useDatos(cargar, SIN_DATOS);

  return (
    <Estado cargando={cargando} error={error} recargar={recargar}>
      <section aria-labelledby="h-visitas">
        <h3 id="h-visitas">Visitas</h3>
        <Estado vacio={h.visitas.length === 0} textoVacio="Sin visitas registradas.">
          <Tabla titulo="Visitas al gimnasio" columnas={["Ingreso", "Salida", "Duracion"]}>
            {h.visitas.map((v) => (
              <tr key={v.id}>
                <td data-label="Ingreso">{formatoFechaHora(v.fechaHoraIngreso)}</td>
                <td data-label="Salida">{v.fechaHoraSalida ? formatoFechaHora(v.fechaHoraSalida) : "Adentro"}</td>
                <td data-label="Duracion">{formatoDuracion(v.fechaHoraIngreso, v.fechaHoraSalida)}</td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      <section aria-labelledby="h-compras">
        <h3 id="h-compras">Compras del kiosco</h3>
        <Estado vacio={h.compras.length === 0} textoVacio="Sin compras registradas.">
          <Tabla titulo="Compras" columnas={["Fecha", "Producto", "Cantidad", "Monto", "Pago"]}>
            {h.compras.map((v) => (
              <tr key={v.id}>
                <td data-label="Fecha">{formatoFechaHora(v.fechaHora)}</td>
                <td data-label="Producto">{v.productoNombre}</td>
                <td data-label="Cantidad">{v.cantidad}</td>
                <td data-label="Monto">{formatoPrecio(v.montoTotal)}</td>
                <td data-label="Pago">{v.pagada ? "Pagada" : "A deuda"}</td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      <section aria-labelledby="h-pagos">
        <h3 id="h-pagos">Pagos</h3>
        <Estado vacio={h.pagos.length === 0} textoVacio="Sin pagos registrados.">
          <Tabla titulo="Pagos" columnas={["Fecha", "Concepto", "Medio", "Monto"]}>
            {h.pagos.map((p) => (
              <tr key={p.id}>
                <td data-label="Fecha">{formatoFechaHora(p.fechaHora)}</td>
                <td data-label="Concepto">{p.concepto === "CUOTA" ? "Cuota" : "Deuda"}</td>
                <td data-label="Medio">{p.medioPago}</td>
                <td data-label="Monto">{formatoPrecio(p.monto)}</td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>

      <section aria-labelledby="h-clases">
        <h3 id="h-clases">Clases</h3>
        <Estado vacio={h.clases.length === 0} textoVacio="Sin clases registradas.">
          <Tabla titulo="Inscripciones a clases" columnas={["Actividad", "Horario", "Estado"]}>
            {h.clases.map((c) => (
              <tr key={c.id}>
                <td data-label="Actividad">{c.claseActividad}</td>
                <td data-label="Horario">{formatoFechaHora(c.claseHorario)}</td>
                <td data-label="Estado">{c.estado === "ACTIVA" ? "Activa" : "Cancelada"}</td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>
    </Estado>
  );
}
