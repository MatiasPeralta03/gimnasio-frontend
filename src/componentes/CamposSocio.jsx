import Campo from "./Campo.jsx";
import { MEDIOS_PAGO, MEMBRESIAS } from "../js/membresias.js";
import { PATRON_DNI, PATRON_TELEFONO } from "../js/validaciones.js";

/** Campos del formulario de socio (se usan en el alta y en la edicion). "prefijo" evita ids repetidos. */
export default function CamposSocio({ prefijo, socio = {}, conDni = false }) {
  return (
    <div className="campos">
      {conDni && (
        <Campo
          id={prefijo + "-dni"}
          etiqueta="DNI"
          name="dni"
          required
          pattern={PATRON_DNI}
          inputMode="numeric"
          autoComplete="off"
          ayuda="7 u 8 números, sin puntos."
          data-mensaje-error="Escribí el DNI con 7 u 8 números, sin puntos ni letras."
        />
      )}
      <Campo
        id={prefijo + "-nombre"}
        etiqueta="Nombre"
        name="nombre"
        required
        minLength={2}
        maxLength={100}
        defaultValue={socio.nombre}
        autoComplete="given-name"
        data-mensaje-error="Escribí el nombre (al menos 2 letras)."
      />
      <Campo
        id={prefijo + "-apellido"}
        etiqueta="Apellido"
        name="apellido"
        required
        minLength={2}
        maxLength={100}
        defaultValue={socio.apellido}
        autoComplete="family-name"
        data-mensaje-error="Escribí el apellido (al menos 2 letras)."
      />
      <Campo
        id={prefijo + "-email"}
        etiqueta="Email"
        name="email"
        type="email"
        required
        maxLength={150}
        defaultValue={socio.email}
        autoComplete="email"
        ayuda="Ejemplo: nombre@correo.com"
        data-mensaje-error="Escribí un email válido, por ejemplo nombre@correo.com."
      />
      <Campo
        id={prefijo + "-telefono"}
        etiqueta="Teléfono"
        name="telefono"
        type="tel"
        pattern={PATRON_TELEFONO}
        maxLength={30}
        defaultValue={socio.telefono ?? ""}
        autoComplete="tel"
        ayuda="Opcional. Solo números, espacios, + y guiones."
        data-mensaje-error="El teléfono debe tener entre 8 y 20 caracteres: números, espacios, + o guiones."
      />
      <Campo id={prefijo + "-membresia"} etiqueta="Membresía" as="select" name="membresia" required defaultValue={socio.membresia ?? "MENSUAL"}>
        {MEMBRESIAS.map((m) => (
          <option key={m.valor} value={m.valor}>
            {m.nombre}
          </option>
        ))}
      </Campo>
      <Campo id={prefijo + "-medioPago"} etiqueta="Medio de pago" as="select" name="medioPago" required defaultValue={socio.medioPago ?? "EFECTIVO"}>
        {MEDIOS_PAGO.map((m) => (
          <option key={m.valor} value={m.valor}>
            {m.nombre}
          </option>
        ))}
      </Campo>
    </div>
  );
}
