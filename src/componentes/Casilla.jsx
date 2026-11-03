import { useState } from "react";

/** Casilla de verificacion (checkbox) con su mensaje de error. El texto puede incluir enlaces. */
export default function Casilla({ id, children, ...props }) {
  const [error, setError] = useState("");

  return (
    <div className="campo">
      <label className="opcion" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          {...props}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={id + "-error"}
          onInvalid={(e) => {
            e.preventDefault();
            setError(e.target.dataset.mensajeError || e.target.validationMessage);
          }}
          onChange={() => setError("")}
        />
        {children}
      </label>
      <small id={id + "-error"} className="error-campo" role="alert">
        {error}
      </small>
    </div>
  );
}
