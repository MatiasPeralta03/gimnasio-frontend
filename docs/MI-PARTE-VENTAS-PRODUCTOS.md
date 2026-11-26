# Mi parte: Productos y Ventas (más lo que sabemos todos)

El código se dividió entre los tres. Este resumen tiene **solo lo que necesito para defender mi parte**:

- **Parte A (la sabemos todos):** cómo arranca la app (`index.html`, `main.jsx`, `App.jsx`), los **hooks de React** (los
  que vienen con la librería), nuestros **hooks propios**, cómo se habla con el back y el login.
- **Parte B:** la pantalla **Productos**, completa.
- **Parte C:** la pantalla **Ventas**, completa.
- **Parte D:** **botón por botón**: qué toco en la pantalla, dónde está en el código y qué pasa.
- **Parte E:** lo de `js/` y los componentes que usan mis pantallas (formatos, validaciones, Campo, Tabla...).
- **Parte F:** preguntas probables, limitaciones y cambios en vivo de mi parte.

La defensa es **solo del front**: acá no hay código del back. Donde mis pantallas dependen de lo que responde el back
(por ejemplo, el error "Stock insuficiente"), está explicado desde el lado del front.

Las líneas son de la versión actual de la rama `matiFront`. En VS Code: **Ctrl + P** abre un archivo por nombre y
**Ctrl + G** va a un número de línea. Para la explicación de todos los archivos del proyecto, ver
[ARCHIVOS.md](ARCHIVOS.md).

---

## Mapa de mi parte

| Archivo | Productos | Ventas | Qué aporta |
|---|:-:|:-:|---|
| `src/paginas/Productos.jsx` | ✅ | | La pantalla de productos (CRUD) |
| `src/paginas/Ventas.jsx` | | ✅ | La pantalla de ventas (3 pasos + listado) |
| `src/js/productos.js` | ✅ | ✅ | Pedir productos al back, filtrar, ordenar, `hayStock` |
| `src/js/ventas.js` | | ✅ | Pedir ventas, formas de pago, ordenar por fecha |
| `src/js/socios.js` (solo `listarSociosActivos`) | | ✅ | Los socios para el desplegable de la venta |
| `src/componentes/Ticket.jsx` | | ✅ | El comprobante |
| `src/componentes/Campo.jsx` | ✅ | ✅ | Cada campo de formulario con su error |
| `src/componentes/Tabla.jsx` | ✅ | ✅ | La tabla del catálogo y la de ventas |
| `src/componentes/Estado.jsx` | ✅ | ✅ | Cargando / error / vacío |
| `src/componentes/Mensaje.jsx` | ✅ | ✅ | El mensaje verde o rojo |
| `src/componentes/Dialogo.jsx` | ✅ | | Los modales de detalle y edición |
| `src/componentes/Detalle.jsx` | ✅ | | La lista de datos del detalle |
| `src/js/validaciones.js` | ✅ | ✅ | Patrón de texto, topes de precio y stock, `validarFormulario` |
| `src/js/formatos.js` | ✅ | ✅ | Precio en pesos y fecha argentina |
| `src/estilo.css` (pasos, ticket, impresión, tablas) | ✅ | ✅ | Cómo se ve |

---

# Parte A. Lo que sabemos todos

## A1. Cómo arranca la app

**`index.html`** es la única página HTML (por eso es una **SPA**, Single Page Application):

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

React dibuja toda la app adentro de ese `div`. `type="module"` carga el script como módulo (con `import`/`export`) y
**ya se comporta como `defer`**: se ejecuta cuando el HTML terminó de cargar.

**`src/main.jsx`** es el primer JavaScript que corre:

```jsx
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- `createRoot(...).render(...)`: React toma el `div#root` y dibuja ahí `<App>`.
- `<BrowserRouter>`: activa la navegación por URL (React Router).
- `<React.StrictMode>`: solo en desarrollo, hace controles extra para detectar errores.
- Arriba importa `estilo.css`: los estilos de todo el sitio, una sola vez.

**Recorrido para memorizar:** `index.html` → `main.jsx` → `App.jsx` → la página de la URL.

**`src/App.jsx`** define la estructura común y qué página va en cada URL:

```jsx
const [sesion, setSesion] = useState(obtenerSesion);                     // línea 24
...
const protegida = (pagina, roles) => (                                   // línea 41
  <RutaProtegida sesion={sesion} roles={roles}>
    {pagina}
  </RutaProtegida>
);
...
<Encabezado sesion={sesion} onSalir={salir} />
<main id="contenido" ref={contenido} tabIndex={-1}>
  <Routes>
    <Route path="/" element={<Inicio />} />
    <Route path="/login" element={<Login sesion={sesion} onLogin={setSesion} />} />
    ...
    <Route path="/productos" element={protegida(<Productos />)} />       // línea 63
    <Route path="/ventas" element={protegida(<Ventas />)} />             // línea 64
    <Route path="/empleados" element={protegida(<Empleados />, ["ADMIN"])} />
    <Route path="*" element={<NoEncontrada />} />
  </Routes>
</main>
<Pie />
```

- `sesion` es **quién inició sesión** (o `null`). Arranca con lo guardado en `sessionStorage`.
- **Mis dos pantallas están protegidas**: `protegida(...)` las envuelve en `RutaProtegida`. Sin sesión, te manda al
  login. Las puede usar cualquier usuario logueado (admin o empleado); solo Empleados es exclusiva del ADMIN.
- El encabezado y el pie están siempre; lo que cambia es lo de adentro de `<Routes>`.
- `path="*"`: cualquier URL que no exista muestra la página 404.
- El `useEffect` de App mueve el foco al contenido al cambiar de pantalla (accesibilidad).

## A2. Los hooks de React (los que vienen con la librería)

Un **hook** es una función de React que empieza con `use` y le da capacidades a un componente. **Reglas:** se llaman
**solo** dentro de un componente (o de otro hook) y **siempre en el mismo orden**: nunca adentro de un `if` o un `for`.

| Hook | Qué hace | Dónde lo usamos en mi parte |
|---|---|---|
| **`useState`** | Guarda un dato que cambia. Devuelve `[valor, setValor]`; al llamar a `setValor`, React vuelve a dibujar el componente | `Ventas.jsx`: `cantidad`, `productoId`, `socioId`, `pago`, `venta`... `Productos.jsx`: `filtro`, `detalle`, `editando` |
| **`useEffect`** | Ejecuta código **después** de dibujar. El segundo parámetro (`[...]`) dice cuándo repetirlo: `[]` una sola vez, `[x]` cada vez que cambia `x` | `useDatos` (pedir los datos al back al abrir la página), `Dialogo` (abrir o cerrar el modal) |
| **`useRef`** | Guarda un valor o un elemento del HTML **sin volver a dibujar** cuando cambia | `Dialogo` (el `<dialog>` real), `useMensaje` (`enCurso`, para evitar el doble clic) |
| **`useCallback`** | Guarda **la misma función** entre dibujos (si no, cada dibujo crea una nueva) | `useDatos` (`recargar`), para que su `useEffect` no se repita sin fin |
| **`useId`** | Genera un id único y estable | `Dialogo` (une el título con `aria-labelledby`) |

Y los de **React Router** (la librería de navegación):

| Hook | Qué hace | Dónde |
|---|---|---|
| **`useLocation`** | Da la URL actual (`pathname`) | `App.jsx` (el foco al cambiar de página), `RutaProtegida` y `Login` (recordar a dónde se quería ir) |
| **`useNavigate`** | Navega desde código, sin un enlace | `Login` (después de entrar), `Encabezado` (al cerrar sesión) |

**Diferencia clave, `useState` contra `useRef`:** los dos guardan un valor. Cambiar un `useState` **vuelve a dibujar**
la pantalla; cambiar un `useRef` no. Para algo que se muestra, `useState`; para algo interno (como "ya hay un envío en
curso"), `useRef`.

## A3. Nuestros hooks propios (`src/hooks/`)

Son funciones `use...` que escribimos nosotros juntando hooks de React, para no repetir el mismo código en cada página.

### `useDatos.js`: cargar datos del back

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

- **Recibe** `cargador`: la función que trae los datos (`listarProductos`, `listarVentas`...).
- **Tres estados:** `datos`, `cargando` (arranca en `true`) y `error` (texto vacío = sin error).
- **`recargar`:** pide los datos. Si sale bien los guarda; si falla guarda el mensaje. `finally` corre siempre.
- **`useEffect`:** al abrir la página llama a `recargar()`: **ahí sale el pedido al back**.
- **`useCallback`:** sin él, `recargar` sería una función nueva en cada dibujo, el `useEffect` la vería "cambiada" y
  pediría los datos sin parar.
- **Uso en mi parte:**
  - Productos: `useDatos(listarProductos)`.
  - Ventas, **tres veces**: `useDatos(listarProductos)`, `useDatos(listarSociosActivos)` y `useDatos(listarVentas)`.

### `useMensaje.js`: avisar el resultado de una acción

```js
const [mensaje, setMensaje] = useState({ texto: "", error: false });
const enCurso = useRef(false);
...
async function ejecutar(accion, textoExito, despues) {
  if (enCurso.current) return;          // doble clic: se ignora
  enCurso.current = true;
  try {
    const resultado = await accion();   // por ejemplo: () => enviar(form)
    avisar(typeof textoExito === "function" ? textoExito(resultado) : textoExito);
    if (despues) await despues(resultado);
  } catch (e) {
    avisarError(e.message);             // el error del back, en rojo
  } finally {
    enCurso.current = false;
  }
}
```

- `mensaje`: el texto y si es error. Lo dibuja `<Mensaje>`.
- `avisar`, `avisarError` y `limpiar` cambian el mensaje.
- **`ejecutar(accion, textoExito, despues)`:** corre la acción contra el back, muestra el éxito o el error y, si salió
  bien, ejecuta `despues` (por ejemplo, limpiar el formulario y recargar la lista).
- **`enCurso` con `useRef`:** si ya hay una acción corriendo, el segundo clic se ignora. Así un doble clic no da de
  alta dos veces el mismo producto.
- **Productos** usa `ejecutar`. **Ventas** maneja el envío a mano (con `procesando`) y de este hook usa
  `mensaje`, `avisarError` y `limpiar`, pero no `ejecutar`.

### `useTitulo.js`: el título de la pestaña

```js
useEffect(() => {
  document.title = titulo + " - Gimnasio de Barrio";
}, [titulo]);
```

En una SPA el `<title>` no cambia solo. Mis páginas llaman `useTitulo("Productos")` y `useTitulo("Ventas")`. El lector
de pantalla anuncia en qué página estás.

## A4. Cómo se habla con el back (`src/js/api.js`)

**Regla de oro:** `api.js` es **el único archivo que hace `fetch`**. Mis páginas nunca llaman al back directamente.

```js
export function enviar(form, datos = datosDe(form)) {
  const metodo = metodoDe(form);       // POST, o PUT/DELETE si el form tiene data-metodo
  const opciones = { method: metodo, headers: { Accept: "application/json" } };
  if (metodo === "POST" || metodo === "PUT") {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(datos);
  }
  return pedir(form.getAttribute("action"), opciones);   // la URL sale del action del form
}
```

- **El método y la URL los declara el formulario** (convención que pidió el profe):
  ```jsx
  <form method="post" action="/api/productos">                                   // POST
  <form method="post" data-metodo="PUT" action={"/api/productos/" + id}>         // PUT
  <form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id}>    // DELETE
  ```
  HTML solo admite GET y POST, por eso PUT y DELETE van en `data-metodo`.
- `datosDe(form)` arma el objeto con los campos que tienen `name`: los números van como número y a los textos se les
  sacan los espacios de los extremos. **El `name` del campo es la clave del JSON** y tiene que coincidir con el atributo
  que espera el back (`name="precio"` → `"precio": 800`).
- `obtener(url)` hace un GET simple (listar, ver detalle).
- `pedir(...)` hace el `fetch`:
  - Sin conexión → "No se pudo conectar con el servidor".
  - `204` (al borrar) → no hay JSON, devuelve `null`.
  - Si el back responde con error → toma el `detail` del `ProblemDetail` ("Stock insuficiente (hay 2)") y lo lanza.
    Lo atrapa `useMensaje` o `useDatos` y lo muestra.

**¿Por qué las URLs empiezan con `/api` y no hay problema de CORS?** Por el **proxy** de `vite.config.js`: el
navegador le pide todo a Vite (5173) y Vite reenvía `/api` a Spring (8080). Para el navegador es el mismo origen.
`BACKEND_URL` en `.env` permite apuntar a un back en otra máquina.

**`async` / `await`:** `fetch` tarda, así que devuelve una **promesa**. `await` espera la respuesta sin congelar la
página, y solo se puede usar dentro de una función `async`. **No es lo mismo que `defer`**: `defer` es un atributo del
`<script>` en el HTML para cargar el archivo sin trabar la página. El profe también usa `async/await` en el TodoList.

## A5. Login y rutas protegidas (lo justo para mi parte)

- **`js/sesion.js`:** usuarios de prueba (`admin` / `admin123`, `empleado` / `empleado123`). `iniciarSesion` los compara
  y guarda la sesión en **`sessionStorage`** (sobrevive a recargar, se borra al cerrar la pestaña).
- **`componentes/RutaProtegida.jsx`:** sin sesión → `<Navigate to="/login">`. Sin el rol pedido → "No tenés permiso".
  Si está todo bien, muestra la página (`children`).
- **Es una simulación del lado del front:** las contraseñas están en el código y la API no está protegida. En un sistema
  real el back valida (`POST /api/auth/login`) y devuelve un token.

---

# Parte B. Productos (`src/paginas/Productos.jsx`, 210 líneas)

## B1. Qué hace la pantalla

El catálogo del kiosco con su **CRUD**:

| Operación | Cómo | Request |
|---|---|---|
| Listar | Al abrir la página (`useDatos`) | `GET /api/productos?soloDisponibles=true` |
| Alta | Formulario "Nuevo producto" | `POST /api/productos` |
| Ver detalle | Botón "Ver" → modal | `GET /api/productos/{id}` |
| Editar | Botón "Editar" → modal | `PUT /api/productos/{id}` |
| Borrar | Botón "Borrar" → confirmación | `DELETE /api/productos/{id}` |
| Buscar, filtrar por stock, ordenar | Filtros arriba de la tabla | Ninguno: se hace en el navegador |

## B2. Los campos: `CamposProducto` (líneas 17–57)

Un componente chico **dentro del mismo archivo**, porque solo lo usa esta página. Tiene los tres campos y **se usa dos
veces**: en el alta (`prefijo="alta"`) y en el modal de edición (`prefijo="editar"`, con `producto={editando}`).

```jsx
<Campo id={prefijo + "-nombre"} name="nombre" required minLength={2} maxLength={100}
       pattern={PATRON_TEXTO} defaultValue={producto.nombre} ... />
<Campo id={prefijo + "-precio"} name="precio" type="number" min="0.01" max={PRECIO_MAXIMO} step="0.01" required ... />
<Campo id={prefijo + "-stock"} name="stock" type="number" min="0" max={STOCK_MAXIMO} step="1" required ... />
```

- `prefijo`: el alta y la edición están en la misma página, y dos campos no pueden tener el mismo `id`.
- `defaultValue`: en la edición arranca con el valor actual; en el alta, `producto` es `{}` y queda vacío. Son campos
  **no controlados**: el valor lo tiene el navegador y se lee recién al enviar.
- **Validaciones:**
  - Nombre: 2 a 100 caracteres, y no solo espacios (`PATRON_TEXTO`).
  - Precio: entre $0,01 y $10.000.000 (`PRECIO_MAXIMO`), con hasta 2 decimales (`step="0.01"`).
  - Stock: entero (`step="1"`) entre 0 y 100.000 (`STOCK_MAXIMO`).
- `data-mensaje-error`: el texto claro que muestra `Campo` si el valor no cumple.

## B3. El estado (líneas 60–68)

```jsx
useTitulo("Productos");
const { datos: productos, cargando, error, recargar } = useDatos(listarProductos);
const { mensaje, avisarError, limpiar, ejecutar } = useMensaje();
const [filtro, setFiltro] = useState({ texto: "", stock: "todos", orden: "nombre" });
const [detalle, setDetalle] = useState(null);
const [editando, setEditando] = useState(null);

const visibles = filtrarProductos(productos, filtro);
```

- `{ datos: productos }`: **destructuring con renombre**: toma `datos` y lo llama `productos`.
- `filtro`: lo que escribiste en "Buscar", el filtro de stock y el orden.
- `detalle` y `editando` valen `null` con el modal cerrado, y el producto con el modal abierto.
- `visibles` **no es un estado**: se calcula en cada dibujo a partir de `productos` y `filtro`.

## B4. Las funciones

**Alta (líneas 76–84):**

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

1. `e.preventDefault()`: un form, al enviarse, recargaría la página. Lo frenamos.
2. `e.currentTarget`: el formulario que se envió.
3. `validarFormulario(form)`: si algún campo no cumple, `Campo` muestra el error y se corta acá.
4. `ejecutar(...)`: `POST /api/productos` → "Producto agregado." → limpia el form y recarga la tabla.

**Modificar (líneas 86–93):** igual, pero con el formulario del modal (`PUT`). Si sale bien, cierra el modal
(`setEditando(null)`) y recarga.

**Borrar (líneas 95–99):**

```jsx
function borrar(e, producto) {
  e.preventDefault();
  if (!window.confirm("¿Borrar el producto " + producto.nombre + "?")) return;
  ejecutar(() => enviar(e.currentTarget), "Producto borrado.", recargar);
}
```

`window.confirm` muestra la pregunta nativa del navegador. El form de la fila (línea 174) tiene
`data-metodo="DELETE"`. Es una **baja lógica**: el producto deja de aparecer en el catálogo, pero no se borra de la
base (las ventas viejas lo siguen nombrando).

**Ver detalle (líneas 101–107):** `obtenerProducto(id)` → `GET /api/productos/{id}` → guarda el resultado en `detalle`,
y eso abre el modal.

**Abrir edición (líneas 71–74):** limpia el mensaje anterior y guarda el producto en `editando`.

## B5. El JSX (lo que se dibuja)

| Línea | Qué es |
|---|---|
| 111 | `<h1>Productos del kiosco</h1>`: un solo `h1` por página |
| 112 | `<Mensaje>`: el resultado de la última acción |
| 117 | El form de alta (`POST /api/productos`) con `<CamposProducto prefijo="alta" />` |
| 129–147 | Los filtros. Son campos **controlados** (`value` + `onChange` → `setFiltro({ ...filtro, texto: ... })`) |
| 149 | `<Estado>`: muestra "Cargando...", el error con Reintentar, "No hay productos..." o la tabla |
| 156 | `<Tabla>` con una fila por producto (`visibles.map(...)`, `key={p.id}`) |
| 163 | Etiqueta "N unidades" (verde) o "Agotado" (roja) según `hayStock(p)` |
| 167 / 170 / 174 | Botones Ver, Editar y el form de Borrar |
| 186 | Modal de detalle: `<Dialogo>` con `<Detalle datos={datosDetalleProducto(detalle)} />` |
| 194–207 | Modal de edición |

El modal de edición, línea por línea:

```jsx
<Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar producto">
  {editando && (
    <form key={editando.id} method="post" data-metodo="PUT" action={"/api/productos/" + editando.id} onSubmit={modificar} noValidate>
      <Mensaje mensaje={mensaje} />
      <CamposProducto prefijo="editar" producto={editando} />
```

- `abierto={editando !== null}`: el modal se abre cuando hay un producto en edición.
- `{editando && (...)}`: renderizado condicional, el form solo existe mientras se edita.
- `key={editando.id}`: si se edita otro producto, React crea un form nuevo con los valores correctos.
- `<Mensaje>` también **adentro** del modal: si falla el guardado, el error se ve ahí y no detrás del modal.
- `noValidate`: no aparece el globo del navegador; el error lo muestra `Campo`, debajo del campo.

**Accesibilidad en la tabla:** "Ver" se repite en cada fila, así que tiene un texto oculto
(`<span className="solo-lectores"> {p.nombre}</span>`): el lector de pantalla lee "Ver Agua".

## B6. `src/js/productos.js`

```js
export const listarProductos = () => obtener("/api/productos?soloDisponibles=true");
export const obtenerProducto = (id) => obtener("/api/productos/" + id);
export const hayStock = (producto) => producto.stock > 0;
```

- `?soloDisponibles=true` es un **parámetro de la URL**: el back devuelve solo los productos activos.
- `filtrarProductos(productos, { texto, stock, orden })` filtra por texto y stock y **ordena** con `sort` y un
  comparador. `[...filtrados]` hace una copia antes de ordenar, porque `sort` modifica la lista original.
- `datosDetalleProducto(p)` arma los pares `[título, valor]` que muestra el modal de detalle.
- **`listarProductos` y `hayStock` también los usa Ventas.**

## B7. De punta a punta: dar de alta un producto

```
Clic en "Agregar producto"
 → alta(e): preventDefault + validarFormulario
 → ejecutar(() => enviar(form))
 → api.js: POST /api/productos  { "nombre": "Agua", "precio": 800, "stock": 20 }
 → el back lo guarda y responde 201 con el producto creado (con su id)
 → "Producto agregado." + form.reset() + recargar() → GET /api/productos → la tabla se actualiza
```

---

# Parte C. Ventas (`src/paginas/Ventas.jsx`, 265 líneas)

## C1. Qué hace la pantalla

La usa el **personal del gimnasio** (admin o empleado) para registrar lo que se vende en el kiosco. Tiene dos partes:

1. **Registrar una venta en 3 pasos:** cargar producto y cantidad → socio y forma de pago → comprobante.
2. **Listado de ventas registradas,** de la más nueva a la más vieja.

| Momento | Request |
|---|---|
| Al abrir | `GET /api/productos?soloDisponibles=true`, `GET /api/socios` y `GET /api/ventas` (tres `useDatos`) |
| Al confirmar | **Un solo** `POST /api/ventas` |
| Después de confirmar | Recarga ventas (para el listado) y productos (para el stock) |

**Por qué un producto por venta:** en el back cada `Venta` es de un producto. Con un carrito serían varios POST: si
fallaba uno, los anteriores ya quedaban vendidos. Así cada venta es **atómica**: se registra completa o no se registra.

## C2. El estado y los valores calculados (líneas 30–47)

```jsx
const { datos, cargando, error, recargar } = useDatos(listarProductos);
const socios = useDatos(listarSociosActivos);
const ventas = useDatos(listarVentas);
const { mensaje, avisarError, limpiar } = useMensaje();

const [productoId, setProductoId] = useState("");
const [cantidad, setCantidad] = useState("1");
const [cargado, setCargado] = useState(false);
const [socioId, setSocioId] = useState("");
const [pago, setPago] = useState("EFECTIVO");
const [venta, setVenta] = useState(null);
const [procesando, setProcesando] = useState(false);

const productos = datos.filter(hayStock);
const producto = productos.find((p) => String(p.id) === productoId);
const total = producto ? producto.precio * (Number(cantidad) || 0) : 0;
const paso = venta ? 3 : cargado && producto ? 2 : 1;
```

- Tres `useDatos`: `socios` y `ventas` se usan como objeto (`socios.datos`, `ventas.recargar`) para que sus nombres no
  choquen con los de productos.
- **Campos controlados** (`value` + `onChange`): el valor vive en el estado, porque el **total** se recalcula mientras
  escribís. En Productos se usa `defaultValue` (no controlados) porque los datos se leen recién al enviar.
- `productoId` es un **texto**: un `<select>` siempre devuelve texto, por eso se compara con `String(p.id)`.
- Se guarda el **id**, no el producto entero: después de recargar, `producto` se busca en la lista nueva y así el stock
  y el precio quedan actualizados.
- **`paso` se calcula, no se guarda:** con la venta registrada, paso 3; con el producto cargado, paso 2; si no, paso 1.
  Así es imposible que el indicador de pasos y la pantalla queden desincronizados.

## C3. Las funciones

**Paso 1 → 2, `cargarProducto` (líneas 50–55):** valida el form (producto elegido y cantidad entre 1 y el stock) y pone
`cargado = true`. Todavía **no se guardó nada**.

**Confirmar, `confirmar` (líneas 68–89):**

```jsx
async function confirmar(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validarFormulario(form)) return;
  limpiar();
  setProcesando(true);
  try {
    const datosVenta = {
      socioId: Number(socioId),
      productoId: producto.id,
      cantidad: Number(cantidad),
      pagada: estaPagada(pago),
    };
    setVenta({ ...(await enviar(form, datosVenta)), formaDePago: pago });
    ventas.recargar();
  } catch (err) {
    avisarError(err.message);
  } finally {
    setProcesando(false);
    recargar(); // el stock cambio (por esta venta o por otra)
  }
}
```

1. Valida que haya un socio elegido.
2. `setProcesando(true)`: deshabilita los botones y muestra "Procesando...". Así un doble clic no registra dos ventas.
3. **Arma el JSON a mano** (`datosVenta`) con exactamente los nombres que espera el back, y lo manda con
   `enviar(form, datosVenta)`. El método (`POST`) y la URL (`/api/ventas`) salen del form.
4. `pagada: estaPagada(pago)`: el back no recibe la forma de pago, solo si la venta quedó **pagada**. "Anotar en la
   cuenta del socio" → `false` → el back suma el monto a la deuda.
5. `setVenta({ ...respuesta, formaDePago: pago })`: guarda la venta que devolvió el back **y le agrega** la forma de
   pago para mostrarla en el ticket. El `...` (spread) copia todo el objeto. Al haber `venta`, pasa al paso 3.
6. `ventas.recargar()`: la venta nueva aparece en el listado.
7. Si el back responde con error (por ejemplo, "Stock insuficiente"), se muestra en rojo.
8. `finally`, que corre siempre: deja de procesar y recarga productos, porque el stock cambió.

**`reiniciar` (líneas 58–66):** "Nueva venta". Pone todo el estado como al principio: vuelve al paso 1 limpio.

## C4. El JSX

| Línea | Qué es |
|---|---|
| 94 | `<ol className="pasos">`: el indicador "1. Cargar producto 2. Socio y pago 3. Comprobante". El paso actual lleva `aria-current="step"` |
| 113 | **Paso 1:** form con `onSubmit={cargarProducto}` |
| 117 | Desplegable "Producto": solo los que tienen stock, con precio y stock en el texto |
| 133 | "Cantidad": `min="1"` y `max={producto?.stock}` |
| 144 | "Subtotal" (`aria-live`: el lector anuncia cuando cambia) |
| 169 | **Paso 2:** `<form method="post" action="/api/ventas" onSubmit={confirmar}>` |
| 172 | Desplegable "Socio": solo los activos |
| 191 | Las tres formas de pago (radios), desde `FORMAS_DE_PAGO` |
| 201 / 204 | "Volver" (`setCargado(false)`, conserva producto y cantidad) y "Registrar venta" (dice "Procesando..." mientras espera) |
| 219 | **Paso 3:** `<Ticket venta={venta} />` |
| 221 / 224 | "Nueva venta" (`reiniciar`) e "Imprimir comprobante" (`window.print()`) |
| 232 | El listado de ventas (clase `solo-pantalla`: no sale al imprimir) |
| 246 | `<Tabla>` con `ordenarPorFecha(ventas.datos)`. Etiqueta "Pagada" (verde) o "A cuenta" (amarilla) |

`producto?.stock`: **optional chaining**. Si todavía no se eligió producto, no falla y da `undefined`.

## C5. `src/js/ventas.js`

```js
export const listarVentas = () => obtener("/api/ventas");

export const FORMAS_DE_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo", pagada: true },
  { valor: "TRANSFERENCIA", nombre: "Transferencia", pagada: true },
  { valor: "DEUDA", nombre: "Anotar en la cuenta del socio", pagada: false },
];

export const estaPagada = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.pagada ?? true;
export const ordenarPorFecha = (ventas) => [...ventas].sort((a, b) => b.id - a.id);
```

- `FORMAS_DE_PAGO`: los radios del paso 2 se dibujan recorriendo esta lista. Para agregar una forma de pago se suma una
  línea.
- `estaPagada`: traduce la forma elegida al `true`/`false` que espera el back. `?.` evita fallar si no la encuentra y
  `?? true` da `true` por defecto.
- `ordenarPorFecha`: de la más nueva a la más vieja. Usa el `id`, que es autoincremental (una venta nueva siempre
  tiene un id mayor). Copia la lista antes de ordenar.
- `nombreFormaDePago`: el texto que muestra el ticket.

## C6. El ticket y la impresión

**`src/componentes/Ticket.jsx`** muestra **los datos que devolvió el back** (`venta.id`, `venta.fechaHora`,
`venta.montoTotal`, `venta.socioNombre`, `venta.productoNombre`), no los que calculó el front: así el comprobante
refleja lo que realmente se guardó. Si `venta.pagada` es `false`, aclara "El importe quedó anotado en la cuenta del
socio".

**Imprimir:**

```jsx
<button type="button" className="secundario" onClick={() => window.print()}>Imprimir comprobante</button>
```

```css
@media print {
    .encabezado, .pie, .solo-pantalla, .saltar-contenido { display: none !important; }
    .ticket { border-style: solid; }
}
```

- `window.print()` abre el diálogo de impresión del navegador. No hace falta ninguna librería, y desde ahí se puede
  guardar como PDF.
- `@media print` son estilos que **solo se aplican al imprimir**: se ocultan el menú, el pie, los botones y el listado
  (todo lo que tiene `solo-pantalla`). Queda el ticket.

**El resto del CSS de mi parte** (`estilo.css`, sección "Compra"): `.pasos` dibuja el indicador con un **contador de
CSS** (`counter-increment` y `content: counter(paso)`, que pone los números 1, 2, 3) y resalta el
`[aria-current="step"]`. `.ticket` usa una fuente monoespaciada y borde punteado, como un ticket de caja.

## C7. De punta a punta: registrar una venta a cuenta

```
Paso 1: elegir "Agua" y cantidad 2 → cargarProducto: valida → cargado = true → paso 2
Paso 2: elegir socio y "Anotar en la cuenta" → "Registrar venta"
 → confirmar: valida → procesando = true
 → api.js: POST /api/ventas  { "socioId": 2, "productoId": 4, "cantidad": 2, "pagada": false }
 → el back valida, descuenta el stock (8 → 6), suma $300 a la deuda del socio y guarda la venta
 → responde 201 con la venta (id, fecha, monto...)
 → setVenta(...) → paso 3: Ticket ("quedó anotado en la cuenta del socio")
 → ventas.recargar() (el listado) + recargar() (el stock)
```

---

# Parte D. Botón por botón

Para cuando el profe señala algo de la pantalla y pregunta **"¿qué pasa cuando toco esto?"** o **"¿dónde está?"**.

**La regla que sirve para cualquier botón:**

```
1. El botón en el JSX           → onClick={...}   o   type="submit" dentro de un <form onSubmit={...}>
2. La función que se ejecuta    → alta, modificar, borrar, verDetalle, cargarProducto, confirmar...
3. Si va al back                → enviar(form) u obtener(url), de js/api.js
4. Qué cambia en pantalla       → un setAlgo(...) cambia el estado y React vuelve a dibujar
```

**Cómo buscarlo en vivo:** **Ctrl + Shift + F** con el texto del botón ("Agregar producto") → te lleva al botón → mirás
su `onClick` o el `onSubmit` de su `<form>` → **Ctrl + clic** sobre la función y te lleva a donde está escrita.

## D1. Productos (`Productos.jsx`)

| Toco... | Dónde está | Qué función corre | Pide al back | Qué cambia en pantalla |
|---|---|---|---|---|
| **"Agregar producto"** | Botón: 122. Form: 117 (`onSubmit={alta}`) | `alta` (76) | `POST /api/productos` | "Producto agregado.", el form se vacía y la tabla se recarga |
| Escribir en **"Buscar producto"** | 130–136 | `setFiltro({ ...filtro, texto })` | Nada | La tabla muestra solo los que coinciden (`visibles`) |
| Elegir en **"Stock"** | 137 | `setFiltro({ ...filtro, stock })` | Nada | Todos, con stock o agotados |
| Elegir en **"Ordenar por"** | 142 | `setFiltro({ ...filtro, orden })` | Nada | La tabla se reordena (`filtrarProductos`) |
| **"Ver"** (en una fila) | 167 | `verDetalle(p.id)` (101) | `GET /api/productos/{id}` | Se abre el modal "Detalle del producto" |
| **"Cerrar"** (modal de detalle) | 188 | `setDetalle(null)` | Nada | Se cierra el modal |
| **"Editar"** (en una fila) | 170 | `abrirEdicion(p)` (71) | Nada | Se abre el modal "Editar producto" con los datos cargados |
| **"Guardar cambios"** | Botón: 200. Form: 196 (`onSubmit={modificar}`) | `modificar` (86) | `PUT /api/productos/{id}` | "Producto actualizado.", se cierra el modal y la tabla se recarga |
| **"Cancelar"** (modal de edición) | 201 | `setEditando(null)` | Nada | Se cierra sin guardar |
| Tecla **Escape** en un modal | `Dialogo.jsx` (`onClose`) | `setDetalle(null)` o `setEditando(null)` | Nada | Se cierra el modal |
| **"Borrar"** (en una fila) | Botón: 175. Form: 174 (`onSubmit={(e) => borrar(e, p)}`) | `borrar` (95) | `DELETE /api/productos/{id}` | Pregunta "¿Borrar...?", "Producto borrado." y la tabla se recarga |
| **"Reintentar"** (si falló la carga) | `Estado.jsx:18` | `recargar` de `useDatos` | `GET /api/productos?soloDisponibles=true` | Vuelve a cargar la tabla |

### "Ver", paso a paso

```jsx
// línea 167: el botón de cada fila
<button type="button" className="secundario" onClick={() => verDetalle(p.id)}>Ver ...</button>

// línea 101: la función
async function verDetalle(id) {
  try {
    setDetalle(await obtenerProducto(id));   // GET /api/productos/{id}
  } catch (e) {
    avisarError(e.message);
  }
}

// línea 186: el modal se abre solo porque detalle dejó de ser null
<Dialogo abierto={detalle !== null} onCerrar={() => setDetalle(null)} titulo="Detalle del producto">
  {detalle && <Detalle datos={datosDetalleProducto(detalle)} />}
```

1. `onClick={() => verDetalle(p.id)}`: se usa una **función flecha** para pasarle el id de **esa** fila. Si se escribiera
   `onClick={verDetalle(p.id)}`, se ejecutaría al dibujar la tabla, no al hacer clic.
2. `verDetalle` pide el producto al back y lo guarda con `setDetalle`.
3. Al cambiar el estado, React vuelve a dibujar: `detalle !== null` es `true` → `Dialogo` recibe `abierto={true}` → su
   `useEffect` llama a `showModal()`.
4. `<Detalle>` muestra los pares que arma `datosDetalleProducto` (ID, nombre, precio, stock).
5. Si el back falla, `avisarError` muestra el error en rojo y el modal no se abre.

### "Editar" → "Guardar cambios", paso a paso

```jsx
// línea 170
<button type="button" className="secundario" onClick={() => abrirEdicion(p)}>Editar ...</button>

// línea 71
function abrirEdicion(producto) {
  limpiar();               // borra el mensaje anterior
  setEditando(producto);   // esto abre el modal
}

// línea 196: el form del modal
<form key={editando.id} method="post" data-metodo="PUT" action={"/api/productos/" + editando.id} onSubmit={modificar} noValidate>

// línea 86
function modificar(e) {
  e.preventDefault();
  if (!validarFormulario(e.currentTarget)) return;
  ejecutar(() => enviar(e.currentTarget), "Producto actualizado.", () => {
    setEditando(null);     // cierra el modal
    return recargar();     // recarga la tabla
  });
}
```

1. "Editar" **no va al back**: el producto ya está en la tabla, así que se guarda en `editando` y eso abre el modal.
2. Los campos arrancan con los valores actuales (`defaultValue={producto.nombre}` en `CamposProducto`).
3. "Guardar cambios" envía el form: `modificar` valida y `enviar` lee del form el método (**PUT**, por `data-metodo`) y
   la URL (`/api/productos/4`).
4. Si sale bien: mensaje, se cierra el modal y la tabla se recarga. Si falla, el error se ve **dentro** del modal.

### "Borrar", paso a paso

```jsx
// línea 174: cada fila tiene su propio form que declara el método y la URL
<form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id} onSubmit={(e) => borrar(e, p)}>
  <button type="submit" className="peligro">Borrar ...</button>
</form>

// línea 95
function borrar(e, producto) {
  e.preventDefault();
  if (!window.confirm("¿Borrar el producto " + producto.nombre + "?")) return;
  ejecutar(() => enviar(e.currentTarget), "Producto borrado.", recargar);
}
```

1. El botón es `type="submit"` dentro de un form, así que dispara el `onSubmit` de **ese** form.
2. `window.confirm` pregunta. Si tocás "Cancelar", devuelve `false` y se corta con `return`.
3. `enviar` hace el **DELETE** que declara el form. El back responde **204** (sin contenido).
4. "Producto borrado." y la tabla se recarga: el producto ya no aparece (baja lógica).

## D2. Ventas (`Ventas.jsx`)

| Toco... | Dónde está | Qué función corre | Pide al back | Qué cambia en pantalla |
|---|---|---|---|---|
| Elegir en **"Producto"** | 115–130 | `setProductoId(e.target.value)` (121) | Nada | Se calcula el subtotal y se fija el máximo de la cantidad |
| Escribir en **"Cantidad"** | 131–142 | `setCantidad(e.target.value)` (140) | Nada | El subtotal se recalcula al instante |
| **"Continuar"** | Botón: 148. Form: 113 (`onSubmit={cargarProducto}`) | `cargarProducto` (50) | Nada | Si el producto y la cantidad son válidos, pasa al paso 2 |
| Elegir en **"Socio"** | 170–185 | `setSocioId(e.target.value)` (176) | Nada | Queda elegido el socio |
| Elegir una **forma de pago** | 191 | `setPago(f.valor)` | Nada | Queda marcada la forma de pago |
| **"Volver"** | 201 | `setCargado(false)` | Nada | Vuelve al paso 1 **conservando** el producto y la cantidad |
| **"Registrar venta"** | Botón: 204. Form: 169 (`onSubmit={confirmar}`) | `confirmar` (68) | `POST /api/ventas` | "Procesando..." → paso 3 con el ticket. La venta aparece en el listado y el stock baja |
| **"Nueva venta"** | 221 | `reiniciar` (58) | Nada | Vuelve al paso 1 con todo vacío |
| **"Imprimir comprobante"** | 224 | `window.print()` | Nada | Se abre el diálogo de impresión, y solo se imprime el ticket |
| **"Actualizar listado"** | 235 | `ventas.recargar` | `GET /api/ventas` | El listado de ventas se vuelve a cargar |
| **"Reintentar"** (si falló algo) | `Estado.jsx:18` | El `recargar` de lo que falló | El GET que corresponda | Vuelve a cargar esa parte |

### "Continuar" (paso 1 → paso 2), paso a paso

```jsx
// línea 113
<form onSubmit={cargarProducto} noValidate>
  ... <Campo id="venta-producto" as="select" required value={productoId} onChange={(e) => setProductoId(e.target.value)} ...>
  ... <Campo id="venta-cantidad" type="number" min="1" max={producto?.stock} required value={cantidad} onChange={(e) => setCantidad(e.target.value)} ... />
  <button type="submit">Continuar</button>
</form>

// línea 50
function cargarProducto(e) {
  e.preventDefault();
  if (!validarFormulario(e.currentTarget)) return;
  limpiar();
  setCargado(true);
}
```

1. Al elegir producto y escribir la cantidad, **cada tecla** cambia el estado (`setProductoId`, `setCantidad`) y React
   recalcula el subtotal. Son campos **controlados**.
2. "Continuar" **no va al back** (este form no tiene `action`): solo valida.
3. `validarFormulario` revisa que haya producto (`required`) y que la cantidad esté entre 1 y el stock (`min`/`max`).
   Si no, `Campo` muestra el error.
4. `setCargado(true)` → `paso` pasa a valer 2 (`cargado && producto`) → se dibuja el paso 2.

### "Registrar venta"

Está explicado completo en **C3** (la función `confirmar`) y **C7** (de punta a punta). En resumen: valida el socio →
`procesando = true` → un `POST /api/ventas` → guarda la respuesta en `venta` → `paso` pasa a 3 y se ve el ticket →
recarga el listado y el stock.

### "Imprimir comprobante"

```jsx
<button type="button" className="secundario" onClick={() => window.print()}>Imprimir comprobante</button>
```

`window.print()` es del navegador. Lo que se oculta al imprimir lo decide el CSS de `@media print` (ver C6).

---

# Parte E. Lo de `js/` y los componentes que usan mis pantallas

## E1. `src/js/formatos.js`: precios y fechas

```js
const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
export const formatoPrecio = (valor) => moneda.format(Number(valor) || 0);
```

- `Intl.NumberFormat` es nativo del navegador: `1500.5` → `$ 1.500,50` (formato argentino).
- `Number(valor) || 0`: si el valor no es un número, muestra `$ 0,00` en vez de "NaN".
- **Dónde lo uso:** el precio en la tabla de Productos, el precio y el stock en el desplegable de Ventas, el subtotal y
  el total, el monto del ticket y el del listado de ventas, y el mensaje de error del precio máximo.

```js
export function aFecha(valor) {
  const texto = String(valor);
  return new Date(texto.length === 10 ? texto + "T00:00:00" : texto.slice(0, 19));
}
```

- Convierte la fecha que manda el back (`"2026-11-20T18:00:00.123"`) en un `Date` de JavaScript.
- **Arregla un error real:** una fecha sin hora (`"2026-10-08"`) se interpretaba en hora UTC, y en Argentina (UTC−3)
  eso es el día anterior a las 21 hs: se mostraba **un día antes**. Con `T00:00:00` se toma como hora local.
- `.slice(0, 19)` corta los decimales de los segundos, que no todos los navegadores aceptan.

```js
export function formatoFechaHora(valor) {
  if (!valor) return "-";
  return aFecha(valor).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric",
                                                 hour: "2-digit", minute: "2-digit", hour12: false });
}
```

- Da `20/11/2026, 18:00`: año con 4 dígitos y 24 horas.
- **Dónde lo uso:** la fecha del ticket y la columna "Fecha" del listado de ventas.

## E2. `src/js/validaciones.js`: lo que usan mis formularios

```js
export const PATRON_TEXTO = "\\s*\\S.*";
export const PRECIO_MAXIMO = 10000000;
export const STOCK_MAXIMO = 100000;

export function validarFormulario(form) {
  const valido = form.checkValidity();
  if (!valido) form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
  return valido;
}
```

- `PATRON_TEXTO`: expresión regular para el `pattern` del nombre del producto. Exige al menos un carácter que no sea
  espacio, así "   " no pasa. (La doble barra `\\` es porque dentro de un texto de JavaScript `\\` vale una sola `\`.)
- `PRECIO_MAXIMO` y `STOCK_MAXIMO`: topes para que no entren valores absurdos, como un precio de un billón.
- **`validarFormulario(form)`:** lo llaman `alta` y `modificar` (Productos) y `cargarProducto` y `confirmar` (Ventas).
  1. `form.checkValidity()` es **nativo del navegador**: revisa todos los `required`, `min`, `max`, `pattern`...
  2. En cada campo que no cumple, el navegador dispara el evento **`invalid`**. Ese evento lo atrapa `Campo` para
     mostrar el mensaje debajo del campo (ver E4).
  3. Si hay errores, pone el foco en el primero, así el usuario sabe dónde corregir.
  4. Devuelve `true` o `false`. Si es `false`, la función de la página corta con `return` y no se envía nada.

## E3. `src/js/socios.js`: lo único que usa Ventas

```js
export async function listarSociosActivos() {
  const socios = await listarSocios();
  return socios.filter((s) => s.activo);
}
```

Pide los socios (`GET /api/socios`) y deja **solo los activos**: a un socio dado de baja no se le puede vender. Llena
el desplegable "Socio" del paso 2. Es `async` porque tiene que **esperar** (`await`) la respuesta del back antes de
filtrar.

## E4. Los componentes que usan mis pantallas

**`Campo.jsx`: el campo de formulario con su error** (lo usan todos los campos de Productos y de Ventas):

```jsx
export default function Campo({ id, etiqueta, ayuda, as: Control = "input", children, ...props }) {
  const [error, setError] = useState("");

  const alInvalido = (e) => {
    e.preventDefault();               // sin el globo del navegador
    const campo = e.target;
    setError(campo.validity.customError ? campo.validationMessage : campo.dataset.mensajeError || campo.validationMessage);
    props.onInvalid?.(e);
  };

  const alEscribir = (e) => {
    if (error) setError("");          // al corregir, el error desaparece
    props.onInput?.(e);
  };
  ...
  <label htmlFor={id}>{etiqueta}{props.required && <span aria-hidden="true"> *</span>}</label>
  <Control id={id} {...props} onInvalid={alInvalido} onInput={alEscribir}
           aria-invalid={error ? "true" : undefined} aria-describedby={describedBy}>
    {children}
  </Control>
  <small id={id + "-error"} className="error-campo" role="alert">{error}</small>
```

- **Props:** `id`, `etiqueta`, `ayuda` y `as` (para elegir `input` o `select`). `...props` junta **todo lo demás**
  (`name`, `type`, `required`, `min`, `pattern`, `value`, `onChange`...) y se lo pasa tal cual al campo real.
- `as: Control = "input"`: renombra la prop `as` a `Control`, con mayúscula, para poder usarla como etiqueta. Por eso
  `<Campo as="select">` dibuja un `<select>` (el desplegable de productos y el de socios en Ventas).
- **Cómo aparece el error:** `validarFormulario` → el navegador dispara `invalid` → `alInvalido` guarda el texto de
  `data-mensaje-error` → se dibuja en el `<small>` de abajo. Al escribir, `alEscribir` lo borra.
- **Accesibilidad:** `label htmlFor` une la etiqueta con el campo (en JSX es `htmlFor` porque `for` es palabra reservada
  de JavaScript), `aria-describedby` hace que el lector lea el error junto al campo, `aria-invalid` lo marca en rojo y
  `role="alert"` lo anuncia apenas aparece.

**`Tabla.jsx`: la tabla del catálogo y la del listado de ventas**

```jsx
<table className="tabla-datos">
  <caption>{titulo}</caption>
  <thead><tr>{columnas.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
  <tbody>{children}</tbody>
</table>
```

- Recibe el `titulo` (el `<caption>`, que lee el lector de pantalla), las `columnas` y las filas como `children`.
- `scope="col"` indica que cada `<th>` encabeza su columna.
- Cada `<td>` de mis filas lleva `data-label` ("Precio", "Stock"...): en el celular el CSS convierte cada fila en una
  tarjeta y muestra ese nombre antes del dato.

**`Estado.jsx`: cargando / error / vacío**

```jsx
if (cargando) return <p className="estado" role="status">Cargando...</p>;
if (error) return (<div className="estado error" role="alert"><p>{error}</p>
                   {recargar && <button ... onClick={recargar}>Reintentar</button>}</div>);
if (vacio) return <p className="estado">{textoVacio}</p>;
return children;
```

**Renderizado condicional** con `if` y `return`. Envuelve la tabla de Productos, el paso 1 y el paso 2 de Ventas y el
listado de ventas. Si el back está apagado, se ve el error con **Reintentar**, que vuelve a llamar a `recargar` de
`useDatos`.

**`Mensaje.jsx`: el mensaje verde o rojo**

```jsx
<div className="zona-mensaje" aria-live="polite" aria-atomic="true">
  {mensaje.texto && <p className={"mensaje" + (mensaje.error ? " error" : "")}>{mensaje.texto}</p>}
</div>
```

- Dibuja el `mensaje` de `useMensaje`. `mensaje.texto && ...`: si no hay texto, no muestra nada.
- El `div` con `aria-live` existe siempre, para que el lector de pantalla anuncie el texto cuando aparece.
- `zona-mensaje` es `sticky` en el CSS: el mensaje sigue visible aunque hayas bajado por la tabla.

**`Dialogo.jsx`: los modales de Productos** (detalle y edición)

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
    <dialog ref={ref} onClose={onCerrar} aria-labelledby={idTitulo} ...>
      <h2 id={idTitulo}>{titulo}</h2>
      {children}
    </dialog>
  );
}
```

- Usa el `<dialog>` **nativo** del HTML: el navegador ya resuelve el fondo oscuro, el foco atrapado adentro, cerrar con
  **Escape** y devolver el foco al botón que lo abrió.
- `useRef` guarda el `<dialog>` real para llamar a `showModal()` y `close()`. `useEffect` lo abre o cierra cuando cambia
  la prop `abierto`.
- `onClose={onCerrar}`: si se cierra con Escape, avisa a Productos (`setEditando(null)`).
- **`children`:** lo que Productos pone adentro: el `<Detalle>` o el form de edición. Un solo componente sirve para los
  dos modales.

**`Detalle.jsx`: la lista del modal de detalle**

```jsx
<dl>
  {datos.map(([titulo, valor]) => (
    <div key={titulo}><dt>{titulo}</dt><dd>{valor ?? "-"}</dd></div>
  ))}
</dl>
```

Recibe pares `[título, valor]` (los arma `datosDetalleProducto`) y los muestra como **lista de definición**
(`<dl>`, `<dt>`, `<dd>`), la etiqueta semántica para "dato: valor". `valor ?? "-"`: si no hay valor, muestra "-".

**`Ticket.jsx`:** explicado en C6.

## E5. JavaScript que aparece en mi parte

| Qué | Significa | Ejemplo en mi código |
|---|---|---|
| `{ datos: productos } = ...` | Destructuring con renombre | `useDatos(listarProductos)` en Productos |
| `[valor, setValor] = useState(...)` | Destructuring de una lista | `const [cantidad, setCantidad] = useState("1")` |
| `{ ...filtro, texto: "x" }` | Spread: copia el objeto y pisa una propiedad | Los filtros de Productos |
| `[...ventas].sort(...)` | Copia la lista antes de ordenarla | `ordenarPorFecha` |
| `producto?.stock` | Optional chaining: no falla si `producto` es `undefined` | `max={producto?.stock}` en Ventas |
| `a ?? b` | Si `a` es `null` o `undefined`, usa `b` | `?.pagada ?? true` en `estaPagada` |
| `cond ? a : b` | If/else en una línea | `hayStock(p) ? p.stock + " unidades" : "Agotado"` |
| `cond && <X />` | Muestra X solo si `cond` es verdadera | `{editando && (<form ...>)}` |
| `.filter` / `.find` / `.map` / `.sort` | Filtrar, buscar uno, transformar, ordenar listas | `datos.filter(hayStock)`, `productos.find(...)` |
| `async` / `await` | Esperar una respuesta (como `fetch`) sin congelar la página | `confirmar` en Ventas |
| `try / catch / finally` | Intentar; si falla, atrapar; y al final, siempre | `confirmar` en Ventas |
| `e.preventDefault()` | Cancela lo que el navegador haría solo (recargar al enviar un form) | `alta`, `confirmar`... |

---

# Parte F. Para la defensa

## F1. Preguntas probables de mi parte

| Pregunta | Respuesta |
|---|---|
| ¿Qué hace Productos? | El CRUD del catálogo del kiosco: alta, listado con búsqueda, filtro y orden, detalle, edición y borrado |
| ¿El borrado borra de la base? | No: es baja lógica (`activo = false`), porque las ventas viejas apuntan a ese producto. Sale del catálogo pero queda en la base |
| ¿Dónde está la búsqueda? ¿Va al back? | En `filtrarProductos` (`js/productos.js`). No va al back: filtra en el navegador la lista que ya se cargó |
| ¿Por qué hay un `CamposProducto`? | Porque el alta y la edición usan los mismos campos. Se escriben una vez y se usan dos |
| ¿Qué es `prefijo`? | Para que los ids no se repitan: `alta-nombre` y `editar-nombre` están en la misma página |
| ¿Para qué el `key={editando.id}`? | Para que React arme un formulario nuevo al editar otro producto, con sus valores |
| ¿Por qué se muestra el mensaje dentro del modal? | Si falla el guardado, el error tiene que verse ahí, no detrás del modal |
| ¿Qué validaciones tiene un producto? | Nombre de 2 a 100 caracteres que no sea solo espacios; precio entre $0,01 y $10.000.000; stock entero entre 0 y 100.000 |
| ¿Cómo es el flujo de una venta? | Producto y cantidad → socio y forma de pago → un `POST /api/ventas` → comprobante (C7) |
| ¿Por qué un producto por venta? | Porque cada venta que guarda el back es de un producto. Con un carrito serían varios POST y, si fallaba uno, los anteriores ya quedaban vendidos. Así cada venta se registra completa o no se registra |
| ¿Alcanza con que el front limite la cantidad al stock? | No: la validación del front se puede saltear y el stock puede cambiar entre que elegís y confirmás. Si el back rechaza la venta, el front muestra su mensaje ("Stock insuficiente") y recarga el stock |
| ¿Quién calcula el total? | Los dos: el front para mostrarlo mientras escribís, y el back el que se guarda (`precio * cantidad`) |
| ¿Por qué el ticket usa los datos del back? | Para que muestre lo que realmente quedó guardado: el número de venta, la fecha y el monto reales |
| ¿Qué es `formatoPrecio`? ¿Y por qué `aFecha`? | `formatoPrecio` usa `Intl.NumberFormat` para mostrar `$ 1.500,50`. `aFecha` arregla que una fecha sin hora se mostraba un día antes (UTC contra hora local) |
| ¿Dónde se valida un formulario? | En los atributos de cada `<Campo>` (`required`, `min`, `max`, `pattern`). `validarFormulario` llama a `checkValidity()` antes de enviar y `Campo` muestra el error |
| ¿Cómo funciona imprimir? | `window.print()` y `@media print`, que oculta todo lo que no es el ticket |
| ¿Por qué el listado dice "Pagada" o "A cuenta" y no la forma de pago? | Porque al back solo se le manda si quedó pagada (`estaPagada`). La forma de pago se muestra en el ticket |
| ¿Por qué `String(p.id) === productoId`? | Porque un `<select>` devuelve el valor como texto y el id es número |
| ¿Qué evita el doble clic? | En Ventas, `procesando` deshabilita el botón. En Productos, `useMensaje` ignora el segundo clic con `useRef` |
| ¿Qué es `async/await`? ¿No era mejor `defer`? | Son cosas distintas: `defer` es para cargar un script en el HTML; `async/await` es para esperar la respuesta del back sin congelar la página. El profe también lo usa |

## F2. Limitaciones de mi parte (decirlas antes de que las encuentren)

| Limitación | Cómo se resolvería |
|---|---|
| Una venta es de un solo producto | Un carrito que mande todos los productos juntos (necesita un cambio en el back) |
| El listado de ventas no tiene filtros ni paginación | Filtros por socio o por fecha en el navegador, como los de Productos |
| El listado no muestra la forma de pago, solo "Pagada" o "A cuenta" | Que el back también la guarde |
| Las validaciones del front se pueden saltear llamando a la API directo | Es normal: el front ayuda al usuario y el back tiene que volver a validar |
| El login es simulado en el front (los usuarios de prueba están en el código) | Un login real, validado por el back |

## F3. Si piden un cambio en vivo

| Te pueden pedir | Qué tocar |
|---|---|
| "Cambiá el precio máximo" | `PRECIO_MAXIMO` en `js/validaciones.js` |
| "Cambiá el mensaje al agregar un producto" | `"Producto agregado."` en `alta` de `Productos.jsx` (línea 80) |
| "Agregá una forma de pago" | Una línea en `FORMAS_DE_PAGO` de `js/ventas.js` (con `pagada: true` o `false`) |
| "Que el listado de ventas vaya de la más vieja a la más nueva" | `ordenarPorFecha` en `js/ventas.js`: `a.id - b.id` |
| "Mostrá también los productos agotados en Ventas" | Sacar el `.filter(hayStock)` de la línea 43 de `Ventas.jsx` (el back igual rechaza si no hay stock) |
| "Agregá una columna a la tabla de productos" | Sumarla en `columnas` de `<Tabla>` (línea 156) y una `<td data-label="...">` en la fila |
| "Que no se pida confirmación al borrar" | Sacar la línea del `window.confirm` en `borrar` (línea 97) |
| "Cambiá el texto del ticket" | `componentes/Ticket.jsx` |

Tené el front corriendo (`npm run dev`): al guardar el archivo, el cambio se ve al instante (HMR de Vite).
