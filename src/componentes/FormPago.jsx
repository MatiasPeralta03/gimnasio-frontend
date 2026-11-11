import Campo from "./Campo.jsx";
import { formatoPrecio } from "../js/formatos.js";
import { MEDIOS_PAGO } from "../js/membresias.js";
import { validarFormulario } from "../js/validaciones.js";

/** Formulario para pagar la deuda de un socio: POST /api/pagos con concepto DEUDA. */
export default function FormPago({ socio, onEnviar, onCancelar }) {
  const alEnviar = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (validarFormulario(form)) onEnviar(form);
  };

  return (
    <form method="post" action="/api/pagos" onSubmit={alEnviar} noValidate>
      <input type="hidden" name="socioId" value={socio.id} />
      <input type="hidden" name="concepto" value="DEUDA" />

      <Campo
        id="pago-monto"
        etiqueta="Monto a pagar ($)"
        name="monto"
        type="number"
        min="0.01"
        max={socio.deuda}
        step="0.01"
        required
        defaultValue={socio.deuda}
        data-mensaje-error={"Escribí un monto mayor a 0 y que no supere la deuda (" + formatoPrecio(socio.deuda) + ")."}
      />
      <Campo id="pago-medio" etiqueta="Medio de pago" as="select" name="medioPago" required>
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
