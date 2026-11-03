import Campo from "./Campo.jsx";
import { MEDIOS_PAGO } from "../js/membresias.js";
import { validarFormulario } from "../js/validaciones.js";

/**
 * Formulario para registrar un pago (cuota o deuda): POST /api/pagos.
 * "concepto" es CUOTA o DEUDA; "montoMaximo" (opcional) limita el monto, por ejemplo a la deuda actual.
 */
export default function FormPago({ socio, concepto, montoInicial, montoMaximo, textoExito, onEnviar, onCancelar }) {
  const alEnviar = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (validarFormulario(form)) onEnviar(form);
  };

  return (
    <form method="post" action="/api/pagos" onSubmit={alEnviar} noValidate data-ok={textoExito}>
      <input type="hidden" name="socioId" value={socio.id} />
      <input type="hidden" name="concepto" value={concepto} />

      <Campo
        id={"pago-monto-" + concepto}
        etiqueta="Monto a pagar ($)"
        name="monto"
        type="number"
        min="0.01"
        max={montoMaximo}
        step="0.01"
        required
        defaultValue={montoInicial}
        ayuda={montoMaximo ? "No puede superar $ " + montoMaximo + "." : undefined}
        data-mensaje-error={
          montoMaximo
            ? "Escribi un monto mayor a 0 y que no supere la deuda ($ " + montoMaximo + ")."
            : "Escribi un monto mayor a 0."
        }
      />
      <Campo id={"pago-medio-" + concepto} etiqueta="Medio de pago" as="select" name="medioPago" required>
        {MEDIOS_PAGO.map((m) => (
          <option key={m.valor} value={m.valor}>
            {m.nombre}
          </option>
        ))}
      </Campo>

      <div className="botonera">
        <button type="submit">Registrar pago</button>
        <button type="button" className="secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
