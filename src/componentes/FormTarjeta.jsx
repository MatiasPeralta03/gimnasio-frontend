import Campo from "./Campo.jsx";
import {
  cvvValido,
  errorVencimiento,
  formatearNumeroTarjeta,
  formatearVencimiento,
  numeroTarjetaValido,
} from "../js/validaciones.js";

/**
 * Campos de tarjeta de credito o debito. ES UNA SIMULACION: los datos no tienen "name",
 * asi que nunca se envian al servidor, y viven solo en la memoria de esta pantalla.
 * Se obliga a un formato fijo para evitar errores: numero en grupos de 4, vencimiento MM/AA y CVV numerico.
 */
export default function FormTarjeta({ tarjeta, setTarjeta }) {
  const cambiar = (campo, valor, mensajeError, e) => {
    e.target.setCustomValidity(mensajeError);
    setTarjeta({ ...tarjeta, [campo]: valor });
  };

  return (
    <fieldset>
      <legend>Datos de la tarjeta (simulacion)</legend>
      <p className="ayuda">Para probar: 4111 1111 1111 1111, un vencimiento futuro (por ejemplo 12/30) y cualquier CVV de 3 numeros.</p>
      <div className="campos">
        <Campo
          id="tarjeta-numero"
          etiqueta="Numero de tarjeta"
          value={tarjeta.numero}
          onChange={(e) => {
            const v = formatearNumeroTarjeta(e.target.value);
            cambiar("numero", v, v === "" || numeroTarjetaValido(v) ? "" : "El numero de la tarjeta no es valido. Revisalo.", e);
          }}
          required
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          ayuda="Entre 13 y 19 numeros. Los espacios se agregan solos."
          data-mensaje-error="Escribi el numero de la tarjeta."
        />
        <Campo
          id="tarjeta-titular"
          etiqueta="Nombre del titular"
          value={tarjeta.titular}
          onChange={(e) => setTarjeta({ ...tarjeta, titular: e.target.value })}
          required
          minLength={3}
          autoComplete="cc-name"
          ayuda="Como figura en la tarjeta."
          data-mensaje-error="Escribi el nombre del titular tal como figura en la tarjeta."
        />
        <Campo
          id="tarjeta-vencimiento"
          etiqueta="Vencimiento (MM/AA)"
          value={tarjeta.vencimiento}
          onChange={(e) => {
            const v = formatearVencimiento(e.target.value);
            cambiar("vencimiento", v, v === "" ? "" : errorVencimiento(v), e);
          }}
          required
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/AA"
          maxLength={5}
          ayuda="Ejemplo: 08/28. La barra se agrega sola."
          data-mensaje-error="Escribi el vencimiento como MM/AA, por ejemplo 08/28."
        />
        <Campo
          id="tarjeta-cvv"
          etiqueta="Codigo de seguridad (CVV)"
          type="password"
          value={tarjeta.cvv}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 4);
            cambiar("cvv", v, v === "" || cvvValido(v) ? "" : "El codigo de seguridad tiene 3 o 4 numeros.", e);
          }}
          required
          inputMode="numeric"
          autoComplete="cc-csc"
          maxLength={4}
          ayuda="3 o 4 numeros, atras de la tarjeta."
          data-mensaje-error="Escribi el codigo de seguridad (3 o 4 numeros)."
        />
      </div>
    </fieldset>
  );
}
