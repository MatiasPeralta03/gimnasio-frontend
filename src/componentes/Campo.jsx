import { useState } from "react";

/**
 * Campo de formulario: etiqueta + control + ayuda + mensaje de error propio.
 * - "as" permite usar "input" (por defecto) o "select".
 * - Los atributos HTML (required, pattern, min...) validan; si falla, el mensaje aparece debajo
 *   del campo. Se puede personalizar con data-mensaje-error="Texto claro para el usuario".
 */
export default function Campo({ id, etiqueta, ayuda, as: Control = "input", children, ...props }) {
  const [error, setError] = useState("");

  const alInvalido = (e) => {
    e.preventDefault(); // evita el globo del navegador: mostramos el mensaje en la pagina
    const campo = e.target;
    setError(campo.validity.customError ? campo.validationMessage : campo.dataset.mensajeError || campo.validationMessage);
    props.onInvalid?.(e);
  };

  const alEscribir = (e) => {
    if (error) setError("");
    props.onInput?.(e);
  };

  const describedBy = [ayuda ? id + "-ayuda" : "", id + "-error"].filter(Boolean).join(" ");

  return (
    <div className="campo">
      <label htmlFor={id}>
        {etiqueta}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <Control
        id={id}
        {...props}
        onInvalid={alInvalido}
        onInput={alEscribir}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
      >
        {children}
      </Control>
      {ayuda && (
        <small id={id + "-ayuda"} className="ayuda">
          {ayuda}
        </small>
      )}
      <small id={id + "-error"} className="error-campo" role="alert">
        {error}
      </small>
    </div>
  );
}
