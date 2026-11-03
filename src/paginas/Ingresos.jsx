import { useState } from "react";
import { enviar } from "../js/api.js";
import { formatoDuracion, formatoHora } from "../js/formatos.js";
import { listarPresentes } from "../js/ingresos.js";
import { PATRON_PIN, validarFormulario } from "../js/validaciones.js";
import useDatos from "../hooks/useDatos.js";
import useMensaje from "../hooks/useMensaje.js";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../componentes/Campo.jsx";
import Estado from "../componentes/Estado.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import Tabla from "../componentes/Tabla.jsx";

const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "borrar", "0", "limpiar"];

/** Simulacion del molinete: el socio marca su PIN; el mismo PIN registra la entrada y luego la salida. */
export default function Ingresos() {
  useTitulo("Ingresos");
  const { datos: presentes, cargando, error, recargar } = useDatos(listarPresentes);
  const { mensaje, ejecutar } = useMensaje();
  const [pin, setPin] = useState("");

  function tocarTecla(tecla) {
    // Se usa el valor previo (p) para no perder toques muy seguidos.
    if (tecla === "borrar") setPin((p) => p.slice(0, -1));
    else if (tecla === "limpiar") setPin("");
    else setPin((p) => (p.length < 4 ? p + tecla : p));
  }

  // POST /api/ingresos: el backend decide si fue una entrada o una salida.
  function registrar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validarFormulario(form)) return;
    ejecutar(
      () => enviar(form),
      (i) =>
        i.dentro
          ? "Entrada registrada: " + i.socioNombre + " - " + formatoHora(i.fechaHoraIngreso)
          : "Salida registrada: " + i.socioNombre + " - " + formatoHora(i.fechaHoraSalida),
      () => {
        setPin("");
        return recargar();
      }
    );
  }

  return (
    <>
      <h1>Ingresos</h1>
      <p>Simulacion del molinete: el socio marca su PIN para entrar y el mismo PIN registra la salida.</p>
      <Mensaje mensaje={mensaje} />

      <section className="panel" aria-labelledby="titulo-registrar">
        <h2 id="titulo-registrar">Registrar entrada o salida</h2>
        <form method="post" action="/api/ingresos" onSubmit={registrar} noValidate>
          <Campo
            id="ingreso-pin"
            etiqueta="PIN del socio"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
            pattern={PATRON_PIN}
            inputMode="numeric"
            maxLength={4}
            autoComplete="off"
            placeholder="0000"
            ayuda="Son 4 numeros. Podes escribirlo o usar el teclado."
            data-mensaje-error="El PIN tiene 4 numeros."
          />

          <div className="teclado" role="group" aria-label="Teclado numerico">
            {TECLAS.map((t) => (
              <button
                key={t}
                type="button"
                className="secundario"
                onClick={() => tocarTecla(t)}
                aria-label={t === "borrar" ? "Borrar un digito" : t === "limpiar" ? "Limpiar el PIN" : "Numero " + t}
              >
                {t === "borrar" ? "⌫" : t === "limpiar" ? "C" : t}
              </button>
            ))}
          </div>
          <button type="submit">Registrar</button>
        </form>
      </section>

      <section aria-labelledby="titulo-presentes">
        <h2 id="titulo-presentes">Quien esta adentro ahora</h2>
        <p aria-live="polite">
          <strong>{presentes.length}</strong> socios en el gimnasio
        </p>
        <p>
          <button type="button" className="secundario" onClick={recargar}>
            Actualizar
          </button>
        </p>
        <Estado
          cargando={cargando}
          error={error}
          recargar={recargar}
          vacio={presentes.length === 0}
          textoVacio="No hay socios en el gimnasio."
        >
          <Tabla titulo="Socios presentes" columnas={["Socio", "Hora de ingreso", "Tiempo adentro"]}>
            {presentes.map((i) => (
              <tr key={i.id}>
                <td data-label="Socio">{i.socioNombre}</td>
                <td data-label="Hora de ingreso">{formatoHora(i.fechaHoraIngreso)}</td>
                <td data-label="Tiempo adentro">{formatoDuracion(i.fechaHoraIngreso)}</td>
              </tr>
            ))}
          </Tabla>
        </Estado>
      </section>
    </>
  );
}
