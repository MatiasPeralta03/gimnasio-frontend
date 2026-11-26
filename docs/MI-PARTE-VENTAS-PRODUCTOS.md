# Mi parte: Productos y Ventas (más lo que sabemos todos)

El código se dividió entre los tres. Este resumen tiene **solo lo que necesito para defender mi parte**:

- **Parte A (la sabemos todos):** cómo arranca la app (`index.html`, `main.jsx`, `App.jsx`), los **hooks de React** (los
  que vienen con la librería), nuestros **hooks propios**, cómo se habla con el back y el login.
- **Parte B:** la pantalla **Productos**, completa, con el back que la atiende.
- **Parte C:** la pantalla **Ventas**, completa, con el back que la atiende.
- **Parte D:** preguntas probables, limitaciones y cambios en vivo de mi parte.

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
| **Back:** `ProductoController`, `ProductoService`, `Producto` | ✅ | | Lo que pasa en Java al llamar a `/api/productos` |
| **Back:** `VentaController`, `VentaService`, `Venta`, `VentaRequest`, `VentaResponse` | | ✅ | Lo que pasa en Java al llamar a `/api/ventas` |

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
  de la clase Java (`name="precio"` → `producto.precio`).
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
`data-metodo="DELETE"`. **En el back es una baja lógica** (ver B7).

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

## B7. El back de Productos (Java)

**`ProductoController`** (capa de comunicación HTTP):

```java
@GetMapping
public List<Producto> listar(@RequestParam(defaultValue = "false") boolean soloDisponibles) {
    return soloDisponibles ? productoService.listarDisponibles() : productoService.listar();
}
@GetMapping("/{id}")       public Producto obtener(@PathVariable Long id)
@PostMapping  @ResponseStatus(HttpStatus.CREATED)      public Producto crear(@RequestBody Producto producto)
@PutMapping("/{id}")       public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto)
@DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)   public void eliminar(@PathVariable Long id)
```

- `@RequestParam`: lee `?soloDisponibles=true` de la URL. `@PathVariable`: lee el `{id}`.
- `@RequestBody`: convierte el JSON que manda el front en un objeto `Producto`.
- `201 CREATED` al crear, `204 NO_CONTENT` al borrar (por eso `api.js` trata el 204 aparte).

**`ProductoService`** (lógica de negocio):
- `listarDisponibles()` → `productoRepository.findByActivoTrue()`: un **query method**. Spring arma el SQL solo a partir
  del nombre del método.
- `crear`: pone `activo = true` y stock 0 si no viene.
- `actualizar`: cambia nombre, precio y stock.
- **`eliminar`: baja lógica.** No borra la fila: pone `activo = false`. **¿Por qué?** Porque las ventas viejas apuntan a
  ese producto (clave foránea): si se borrara, se perdería el historial. Por eso desaparece del catálogo pero sigue en
  la base.

**`Producto`** (entidad, tabla `productos`): `id`, `nombre`, `precio` (Double), `stock` (Integer) y `activo`. Usa
`@Entity`, `@Id` con `@GeneratedValue` (autoincremental) y `@Column(nullable = false)`.

## B8. De punta a punta: dar de alta un producto

```
Clic en "Agregar producto"
 → alta(e): preventDefault + validarFormulario
 → ejecutar(() => enviar(form))
 → api.js: POST /api/productos  { "nombre": "Agua", "precio": 800, "stock": 20 }
 → proxy de Vite → ProductoController.crear → ProductoService.crear → ProductoRepository.save → MySQL
 → 201 + el producto creado (con id)
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
3. **Arma el JSON a mano** (`datosVenta`) con exactamente lo que espera Java (`VentaRequest`), y lo manda con
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

## C7. El back de Ventas (Java)

**`VentaController`:**

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public VentaResponse registrar(@RequestBody VentaRequest request) {
    return ventaService.registrar(request);
}

@GetMapping
public List<VentaResponse> listar(@RequestParam(required = false) Long socioId) { ... }
```

Solo `POST` y `GET`: **no hay PUT ni DELETE porque una venta es un registro histórico** (inmutable).

**DTOs (Data Transfer Objects):**
- `VentaRequest` (lo que **entra**): `socioId`, `productoId`, `cantidad`, `pagada`. Son los mismos nombres que
  `datosVenta` en el front.
- `VentaResponse` (lo que **sale**): `id`, `socioId`, `socioNombre`, `productoId`, `productoNombre`, `cantidad`,
  `montoTotal`, `fechaHora`, `pagada`.

**¿Por qué DTOs y no la entidad?** La entidad `Venta` tiene relaciones (`@ManyToOne` con `Socio` y `Producto`). El DTO
de entrada recibe solo los ids, y el de salida "aplana" la relación (manda `socioNombre` en vez del socio entero).
Así el JSON es simple y no se exponen datos de más.

**`VentaService.registrar()`**: la lógica de negocio. La clase tiene `@Transactional`:

```java
Socio socio = socioRepository.findById(req.getSocioId())
        .orElseThrow(() -> new RecursoNoEncontradoException("No existe el socio con id " + ...));   // 404
Producto producto = productoRepository.findById(req.getProductoId()).orElseThrow(...);              // 404

if (!socio.getActivo())          throw new ReglaDeNegocioException("El socio esta dado de baja");    // 409
if (!producto.getActivo())       throw new ReglaDeNegocioException("El producto no esta disponible");
if (cantidad <= 0)               throw new ReglaDeNegocioException("La cantidad tiene que ser mayor a 0");
if (producto.getStock() < cantidad)
    throw new ReglaDeNegocioException("Stock insuficiente (hay " + producto.getStock() + ")");

double montoTotal = producto.getPrecio() * cantidad;
producto.setStock(producto.getStock() - cantidad);         // descuenta el stock
if (!pagada) socio.setDeuda(socio.getDeuda() + montoTotal); // si no se pagó, va a la deuda
... guarda la Venta con LocalDateTime.now() y devuelve new VentaResponse(...)
```

- **Las reglas de negocio están en el back.** Aunque el front ya limita la cantidad al stock, el back lo vuelve a
  controlar: alguien podría llamar a la API desde Postman, o el stock pudo cambiar mientras tanto.
- **El precio lo calcula el back** (`producto.getPrecio() * cantidad`), no el front. El total del front es solo para
  mostrar.
- **`@Transactional`:** todo el método es **una transacción**. Si algo falla en el medio, se deshace todo: no puede
  quedar el stock descontado sin la venta registrada.
- **Excepciones → códigos HTTP:** `ManejadorGlobalDeErrores` (`@RestControllerAdvice`) convierte
  `RecursoNoEncontradoException` en **404** y `ReglaDeNegocioException` en **409**, con un `ProblemDetail` cuyo `detail`
  es el mensaje. Ese `detail` es el que muestra el front.

**`Venta`** (entidad, tabla `ventas`): `@ManyToOne` con `Socio` y con `Producto` (columnas `socio_id` y
`producto_id`, claves foráneas), `cantidad`, `montoTotal`, `fechaHora` y `pagada`.

## C8. De punta a punta: registrar una venta a cuenta

```
Paso 1: elegir "Agua" y cantidad 2 → cargarProducto: valida → cargado = true → paso 2
Paso 2: elegir socio y "Anotar en la cuenta" → "Registrar venta"
 → confirmar: valida → procesando = true
 → api.js: POST /api/ventas  { "socioId": 2, "productoId": 4, "cantidad": 2, "pagada": false }
 → VentaController → VentaService.registrar (@Transactional):
     valida socio, producto y stock → stock 8 → 6 → deuda del socio + $300 → guarda la Venta
 → 201 + VentaResponse (id, fecha, monto...)
 → setVenta(...) → paso 3: Ticket ("quedó anotado en la cuenta del socio")
 → ventas.recargar() (el listado) + recargar() (el stock)
```

---

# Parte D. Para la defensa

## D1. Preguntas probables de mi parte

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
| ¿Cómo es el flujo de una venta? | Producto y cantidad → socio y forma de pago → un `POST /api/ventas` → comprobante (C8) |
| ¿Por qué un producto por venta? | Porque en el back `Venta` tiene un producto. Así cada venta es atómica |
| ¿Qué hace el back al registrar una venta? | Valida socio, producto y stock, calcula el monto, descuenta el stock, suma la deuda si no se pagó y guarda, todo en una transacción |
| ¿Por qué el back vuelve a validar el stock? | Porque la validación del front se puede saltear (Postman) y el stock puede cambiar entre que elegís y confirmás |
| ¿Quién calcula el total? | Los dos: el front para mostrarlo mientras escribís, y el back el que se guarda (`precio * cantidad`) |
| ¿Por qué el ticket usa los datos del back? | Para que muestre lo que realmente quedó guardado: el número de venta, la fecha y el monto reales |
| ¿Cómo funciona imprimir? | `window.print()` y `@media print`, que oculta todo lo que no es el ticket |
| ¿Por qué la forma de pago no está en el listado de ventas? | Porque el back solo guarda si quedó pagada o no. La forma de pago se muestra en el ticket |
| ¿Por qué `String(p.id) === productoId`? | Porque un `<select>` devuelve el valor como texto y el id es número |
| ¿Qué evita el doble clic? | En Ventas, `procesando` deshabilita el botón. En Productos, `useMensaje` ignora el segundo clic con `useRef` |
| ¿Qué es `async/await`? ¿No era mejor `defer`? | Son cosas distintas: `defer` es para cargar un script en el HTML; `async/await` es para esperar la respuesta del back sin congelar la página. El profe también lo usa |
| ¿Por qué hay DTOs en Venta y no en Producto? | `Producto` no tiene relaciones, así que se manda la entidad directa. `Venta` tiene `@ManyToOne`: los DTOs reciben ids y aplanan la respuesta |

## D2. Limitaciones de mi parte (decirlas antes de que las encuentren)

| Limitación | Cómo se resolvería |
|---|---|
| El back acepta un producto con nombre vacío o precio negativo si alguien llama a la API directo (el front lo bloquea) | `@Valid` con `@NotBlank` y `@Positive` en el back |
| Una venta es de un solo producto | Una entidad de detalle (`DetalleVenta`) para que un POST registre varios productos en una transacción |
| El back no guarda la forma de pago, solo si quedó pagada | Agregar el campo a `Venta` |
| El listado de ventas no tiene paginación ni filtros | `Pageable` en el back y filtros en la tabla |
| El login es simulado y la API no está protegida | Login real en el back con token, y proteger los endpoints |

## D3. Si piden un cambio en vivo

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
