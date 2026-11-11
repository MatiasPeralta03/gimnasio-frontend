# Paso a paso para entender el código

Esta guía es para recorrer el front en orden, de lo más simple a lo más complejo, y llegar a la defensa sabiendo
explicar cada parte con tus palabras. Hacé los pasos con el proyecto abierto en VS Code y el sitio corriendo en el
navegador: leé el fragmento, buscalo en el archivo y probalo en la pantalla.

Las otras guías: [FRONTEND.md](FRONTEND.md) (cómo está hecho) y [DEFENSA.md](DEFENSA.md) (preguntas y guion de demo).

Tiempo estimado: 2 a 3 horas.

---

## Paso 0. Levantarlo

1. Levantá MySQL y el back (en `aplicaciones-interactivas`): `./mvnw spring-boot:run`.
2. En `gimnasio-frontend`: `npm install` (solo la primera vez) y `npm run dev`.
3. Abrí http://localhost:5173 y recorré todas las pantallas del menú.

**Qué tenés que poder decir:** "El front es una app React que corre en el puerto 5173 y le pide los datos al back de
Spring en el 8080".

---

## Paso 1. Cómo arranca la app

Abrí `index.html`. Es casi vacío:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

Todo lo que ves en pantalla lo dibuja React adentro de ese `div`. Esto es una **SPA** (Single Page Application):
hay un solo HTML y el contenido cambia sin recargar la página.

Abrí `src/main.jsx`:

```jsx
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- `createRoot(...).render(...)`: React toma el `div#root` y dibuja ahí el componente `<App>`.
- `BrowserRouter`: habilita la navegación por URL (`/socios`, `/clases`...).
- `StrictMode`: solo en desarrollo, hace controles extra para detectar errores.
- El `import "./estilo.css"` de arriba carga los estilos de todo el sitio.

**Recorrido para memorizar:** `index.html` → `main.jsx` → `App.jsx` → la página de la ruta.

---

## Paso 2. App: la estructura común y las rutas

Abrí `src/App.jsx`:

```jsx
<Encabezado />
<main id="contenido" ref={contenido} tabIndex={-1}>
  <Routes>
    <Route path="/" element={<Inicio />} />
    <Route path="/socios" element={<Socios />} />
    ...
    <Route path="*" element={<NoEncontrada />} />
  </Routes>
</main>
<Pie />
```

- El encabezado y el pie están **siempre**. Lo que cambia es lo de adentro de `<Routes>`.
- Cada `<Route>` dice: "si la URL es esta, mostrá este componente". `path="*"` atrapa cualquier URL que no exista.
- El `useEffect` de arriba mueve el foco al contenido cuando cambiás de pantalla, para quien navega con teclado o
  lector de pantalla.

**Probalo:** entrá a http://localhost:5173/cualquier-cosa → aparece "Página no encontrada".

Abrí `src/componentes/Encabezado.jsx`. El menú se arma con un `.map()` sobre una lista de enlaces, y usa `NavLink`
(no `<a>`) para navegar sin recargar. `NavLink` marca solo la página actual con `aria-current="page"`, y el CSS
la resalta.

---

## Paso 3. Un componente simple: Acerca de

Abrí `src/paginas/Acerca.jsx`. Es la página más simple, ideal para entender JSX:

```jsx
const INTEGRANTES = ["Ezequiel Ibarra", "Lucas Bollini", "Matias Peralta", "Ignacio Barborini"];

/** Iniciales para la tarjeta de cada integrante: "Lucas Bollini" -> "LB". */
const iniciales = (nombre) => nombre.split(" ").map((parte) => parte[0]).join("");
...
{INTEGRANTES.map((nombre) => (
  <li className="integrante" key={nombre}>
    <span className="avatar" aria-hidden="true">
      {iniciales(nombre)}
    </span>
    {nombre}
  </li>
))}
```

- Un **componente** es una función que devuelve JSX. Su nombre va con mayúscula (`Acerca`) para que React no lo
  confunda con una etiqueta HTML.
- **JSX** parece HTML, pero entre `{ }` se ejecuta JavaScript. En JSX se escribe `className`, no `class`.
- `.map()` convierte la lista de nombres en una lista de `<li>`. La **`key`** le sirve a React para identificar
  cada elemento cuando la lista cambia.
- `aria-hidden="true"`: las iniciales son decorativas, así el lector de pantalla no lee "L B".

**Ejercicio:** agregá un integrante inventado a la lista, guardá y mirá cómo aparece sin recargar. Eso es el
**HMR** de Vite. Después sacalo.

---

## Paso 4. Componentes reutilizables y props

Abrí `src/componentes/Dialogo.jsx`:

```jsx
export default function Dialogo({ abierto, onCerrar, titulo, grande = false, children }) {
  const ref = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const d = ref.current;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog ref={ref} onClose={onCerrar} aria-labelledby={idTitulo} className={grande ? "grande" : undefined}>
      <h2 id={idTitulo}>{titulo}</h2>
      {children}
    </dialog>
  );
}
```

- **Props:** `abierto`, `onCerrar`, `titulo` son datos que le pasa el componente padre. El hijo no los modifica.
- **`children`:** es lo que el padre pone entre `<Dialogo>` y `</Dialogo>`. Así el mismo modal sirve para el
  detalle, la edición y el pago de deuda.
- **`useRef`:** guarda una referencia al `<dialog>` real del HTML para poder llamar a `showModal()`.
- **`useEffect`:** cada vez que cambia `abierto`, abre o cierra el modal.
- **`useId`:** genera un id único para unir el título con `aria-labelledby` (accesibilidad).
- Usamos el `<dialog>` nativo porque el navegador ya resuelve el foco, la tecla Escape y la accesibilidad.

Cómo se usa, en `Productos.jsx`:

```jsx
<Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar producto">
```

Mirá también `src/componentes/Campo.jsx`: junta en un solo componente la etiqueta, el campo, la ayuda y el mensaje
de error. Lo usan **todos** los formularios. Si mañana cambia cómo se muestran los errores, se cambia en un solo
lugar.

---

## Paso 5. El estado: useState

Abrí `src/paginas/Compra.jsx` y buscá:

```jsx
const [cantidad, setCantidad] = useState("1");
...
const total = producto ? producto.precio * (Number(cantidad) || 0) : 0;
const paso = venta ? 3 : producto ? 2 : 1;
```

- `useState` guarda un dato que cambia. Devuelve el valor (`cantidad`) y una función para cambiarlo (`setCantidad`).
- Cuando llamás a `setCantidad`, React **vuelve a dibujar** el componente: por eso el total se actualiza solo
  mientras escribís.
- `total` y `paso` no son estados: se **calculan** a partir de otros estados. Así nunca quedan desactualizados.
- Renderizado condicional: `{paso === 1 && (...)}` muestra cada paso solo cuando corresponde.

**Probalo:** en Comprar, elegí un producto y cambiá la cantidad: el total cambia al instante.

---

## Paso 6. Traer datos del back: useEffect y el hook useDatos

Abrí `src/hooks/useDatos.js`:

```js
export default function useDatos(cargador, inicial = []) {
  const [datos, setDatos] = useState(inicial);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setDatos(await cargador());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [cargador]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { datos, cargando, error, recargar };
}
```

- Es un **hook propio**: una función `use...` que junta otros hooks. Todas las páginas cargan datos igual, así que
  esto se escribe una vez.
- `useEffect` llama a `recargar()` cuando la página aparece: ahí se pide la información al back.
- Devuelve los tres estados que pide la rúbrica: **cargando**, **error** y los **datos**.
- `useCallback` mantiene la misma función `recargar` entre dibujos; si no, el `useEffect` se repetiría sin parar.

Cómo se usa, en `Productos.jsx`:

```jsx
const { datos: productos, cargando, error, recargar } = useDatos(listarProductos);
```

Y el componente `<Estado>` decide qué mostrar: "Cargando...", el error con un botón **Reintentar**, "no hay datos"
o la tabla.

**Probalo:** frená el back y recargá Socios → aparece el error con Reintentar. Levantá el back y tocá Reintentar.

---

## Paso 7. Cómo se habla con el back: api.js

Abrí `src/js/api.js`. Es el **único archivo que hace `fetch`**.

```js
export function enviar(form, datos = datosDe(form)) {
  const metodo = metodoDe(form);
  const opciones = { method: metodo, headers: { Accept: "application/json" } };
  if (metodo === "POST" || metodo === "PUT") {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(datos);
  }
  return pedir(form.getAttribute("action"), opciones);
}
```

- `enviar` recibe un **formulario** y lee de él el método y la URL. La convención que pidió el profe es que el
  método HTTP quede declarado en el HTML:
  ```jsx
  <form method="post" action="/api/productos" ...>
  <form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id} ...>
  ```
  HTML solo admite GET y POST, por eso PUT y DELETE van en `data-metodo`.
- `datosDe(form)` arma el objeto con los campos que tienen `name`: los números van como número y a los textos se les
  sacan los espacios de los extremos.
- `JSON.stringify` convierte el objeto en el texto JSON que espera Spring.

Y en `pedir`:

```js
if (respuesta.status === 204) return null;
...
if (!respuesta.ok) {
  throw new Error(json?.detail || (respuesta.status >= 500 ? ERROR_DEL_SERVIDOR : json?.title) || ERROR_DEL_SERVIDOR);
}
return json;
```

- 204 (sin contenido) es lo que devuelve el back al borrar: no hay JSON que leer.
- Si el back responde con error, se toma el `detail` del `ProblemDetail`. Así en pantalla se ve el mensaje que armó
  la regla de negocio en Java, por ejemplo "Ya existe un socio con DNI ...".

**¿Por qué las URLs empiezan con `/api` y no con `http://localhost:8080`?** Por el **proxy** de `vite.config.js`:
el navegador le pide todo a Vite (5173) y Vite reenvía `/api` a Spring (8080). Para el navegador es el mismo origen,
así que no hay problema de **CORS**.

---

## Paso 8. Un CRUD completo, de punta a punta: Productos

Abrí `src/paginas/Productos.jsx` y seguí el alta:

```jsx
<form method="post" action="/api/productos" onSubmit={alta} noValidate>
  <fieldset>
    <legend>Datos del producto</legend>
    <CamposProducto prefijo="alta" />
  </fieldset>
  <button type="submit">Agregar producto</button>
</form>
```

```jsx
function alta(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validarFormulario(form)) return;
  ejecutar(() => enviar(form), "Producto agregado.", () => {
    form.reset();
    return recargar();
  });
}
```

Qué pasa al tocar "Agregar producto":

1. `e.preventDefault()` evita que el navegador recargue la página (el comportamiento normal de un form).
2. `validarFormulario(form)` revisa `required`, `min`, `max`, `pattern`. Si algo falla, el error aparece debajo del
   campo y no se envía nada.
3. `ejecutar(...)` (de `useMensaje`) hace el `POST /api/productos`, muestra "Producto agregado." o el error del back,
   y evita que un doble clic lo mande dos veces.
4. Si salió bien, limpia el formulario y `recargar()` vuelve a pedir la lista: la tabla se actualiza sola.

Las otras operaciones siguen la misma idea:

| Operación | Cómo | Request |
|---|---|---|
| Listar | `useDatos(listarProductos)` | `GET /api/productos?soloDisponibles=true` |
| Ver detalle | botón Ver → `obtenerProducto(id)` → modal | `GET /api/productos/{id}` |
| Editar | botón Editar → modal con el form de edición | `PUT /api/productos/{id}` |
| Borrar | form con `data-metodo="DELETE"` → `window.confirm` | `DELETE /api/productos/{id}` |
| Buscar y ordenar | `filtrarProductos(productos, filtro)` | ninguno: se filtra en el navegador |

**Ejercicio:** dá de alta un producto, editalo y borralo, y en cada paso abrí las DevTools (F12 → **Network**) para
ver el request, el método y el JSON que viaja.

Socios, Empleados y Clases funcionan **igual**. Si entendiste Productos, entendiste los cuatro.

---

## Paso 9. El flujo de compra

Abrí `src/paginas/Compra.jsx`. Tiene 3 pasos, que salen de los estados:

```jsx
const paso = venta ? 3 : producto ? 2 : 1;
```

- Sin producto elegido → paso 1 (catálogo).
- Con producto elegido → paso 2 (cantidad, socio, forma de pago).
- Con la venta registrada → paso 3 (comprobante).

Al confirmar se manda **un solo** request:

```jsx
const datosVenta = {
  socioId: Number(socioId),
  productoId,
  cantidad: Number(cantidad),
  pagada: estaPagada(pago),
};
setVenta({ ...(await enviar(form, datosVenta)), formaDePago: pago });
```

Del lado del back, `VentaService.registrar()` valida el socio, el producto y el stock, descuenta el stock, suma la
deuda si `pagada` es `false` y guarda la venta. El comprobante se arma con la venta que devolvió el back.

**Para defender:** "Es un producto por compra porque en el back cada `Venta` tiene un producto. Así la compra es una
sola operación: o se registra completa o no se registra".

**Probalo:** comprá "a la cuenta del socio" y andá a Socios: aparece la deuda. Pagala con "Pagar deuda".

---

## Paso 10. Clases y cupos

Abrí `src/paginas/Clases.jsx` y `src/componentes/InscriptosClase.jsx`.

- Los cupos (`cuposDisponibles`) los calcula el **back**, contando las inscripciones activas.
- El front deshabilita "Inscribir" cuando no hay lugar, pero la regla la vuelve a controlar el back
  (`InscripcionClaseService`): si alguien la saltea, responde 409.
- Al editar una clase, la capacidad no puede quedar por debajo de los inscriptos:
  ```jsx
  const inscriptos = esAlta ? 0 : clase.capacidad - clase.cuposDisponibles;
  ...
  min={Math.max(1, inscriptos)}
  ```

**Probalo:** creá una clase con capacidad 1, inscribí un socio y fijate que aparece "Sin cupo".

---

## Paso 11. Validaciones: que no se pueda romper

Abrí `src/js/validaciones.js` y `src/componentes/Campo.jsx`.

- Las reglas están en los atributos del HTML: `required`, `min`, `max`, `maxLength`, `pattern`, `type="email"`.
- Los formularios tienen `noValidate`: así no aparece el globo del navegador y `Campo` muestra el mensaje debajo del
  campo (lo hace en `onInvalid`, con el texto de `data-mensaje-error`).
- Topes para que no entren valores absurdos: `PRECIO_MAXIMO`, `STOCK_MAXIMO` y las clases dentro de los próximos
  2 años.
- El doble clic se frena en `useMensaje` con un `useRef` (`enCurso`).
- Si alguien escribe `<script>` en un nombre, React lo muestra como texto: no se ejecuta.

**Para defender:** "Validar en el front ayuda al usuario, pero no alcanza: se puede llamar a la API desde Postman.
El back tiene que validar todo otra vez".

**Probalo:** intentá crear una clase en el año 9999, un producto con precio negativo o un socio llamado "123".

---

## Paso 12. Estilos, responsive y accesibilidad

Abrí `src/estilo.css`:

- **Variables** en `:root` (`--principal`, `--fondo`...). Para el modo oscuro, `@media (prefers-color-scheme: dark)`
  cambia solo los valores de las variables.
- **Mobile first:** el diseño base es el de celular, y `@media (min-width: 761px)` lo amplía.
- En celular las **tablas pasan a tarjetas**: cada celda muestra el nombre de su columna con
  `content: attr(data-label)`.

Accesibilidad, para nombrar en la defensa:

- Etiquetas semánticas (`header`, `nav`, `main`, `footer`) y un solo `h1` por página.
- Cada campo con su `label`, y el error unido con `aria-describedby`.
- Mensajes con `aria-live`, para que el lector de pantalla los anuncie.
- Enlace "Saltar al contenido", foco visible y modales nativos.
- Contraste verificado con axe (WCAG AA), en modo claro y oscuro.

**Probalo:** achicá la ventana del navegador (o F12 → modo celular), y recorré una página solo con la tecla Tab.

---

## Paso 13. Chequeo final: ¿estás listo?

Contestá en voz alta, sin mirar:

- [ ] ¿Cómo arranca la app? (Paso 1)
- [ ] ¿Qué es un componente, una prop y `children`? (Pasos 3 y 4)
- [ ] ¿Qué hacen `useState`, `useEffect` y `useRef`? (Pasos 4, 5 y 6)
- [ ] ¿Qué devuelve `useDatos` y para qué? (Paso 6)
- [ ] ¿Dónde se hace el `fetch` y cómo sabe el método y la URL? (Paso 7)
- [ ] ¿Qué es CORS y por qué no tenemos ese problema? (Paso 7)
- [ ] Explicá el alta de un producto de punta a punta. (Paso 8)
- [ ] ¿Por qué la compra es de un producto? ¿Qué hace el back al confirmar? (Paso 9)
- [ ] ¿Quién calcula los cupos? (Paso 10)
- [ ] ¿Alcanza con validar en el front? (Paso 11)
- [ ] ¿Cómo funciona el responsive y el modo oscuro? (Paso 12)
- [ ] ¿Por qué no hay login y cómo se agregaría? ([DEFENSA.md](DEFENSA.md), sección "Login")

Si alguna no te sale, volvé a ese paso y después practicá con las preguntas de [DEFENSA.md](DEFENSA.md).
