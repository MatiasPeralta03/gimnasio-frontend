# Qué hace cada archivo, con su código importante

Esta guía recorre **todos** los archivos del front. Para cada uno explica para qué sirve, quién lo usa, sus líneas
importantes y qué decir si te lo preguntan.

- Los números de línea son de la versión actual. En VS Code, **Ctrl + G** y el número te lleva a la línea, y
  **Ctrl + P** abre un archivo por su nombre.
- El orden va de lo general a lo particular: configuración → arranque → hooks → lógica → componentes → páginas → CSS.
- Al final hay un **glosario** de JavaScript con los símbolos raros que aparecen en el código (`?.`, `??`, `...`).

Otras guías: [PASO-A-PASO.md](PASO-A-PASO.md) (recorrido para entender), [DEFENSA.md](DEFENSA.md) (preguntas y demo)
y [FRONTEND.md](FRONTEND.md) (arquitectura).

---

## Mapa general

```
gimnasio-frontend/
├── index.html            la única página HTML
├── package.json          dependencias y comandos
├── vite.config.js        servidor de desarrollo y proxy al back
├── .env.example          ejemplo para apuntar a otro back
└── src/
    ├── main.jsx          arranque de React
    ├── App.jsx           estructura común y rutas
    ├── estilo.css        todos los estilos
    ├── hooks/            estado reutilizable (useDatos, useMensaje, useTitulo)
    ├── js/               lógica sin HTML (api, validaciones, formatos, una por entidad)
    ├── componentes/      piezas reutilizables (Campo, Tabla, Dialogo...)
    └── paginas/          una por pantalla
```

**Quién usa a quién:**

```
páginas  ──usan──>  componentes  (Campo, Tabla, Dialogo, Estado, Mensaje...)
   │
   ├──usan──>  hooks  (useDatos para cargar, useMensaje para avisar, useTitulo)
   │
   └──usan──>  js/<entidad>.js  ──usa──>  js/api.js  ──fetch──>  /api  ──proxy de Vite──>  Spring (8080)
```

Regla de oro del proyecto: **solo `js/api.js` hace `fetch`**. Las páginas nunca llaman al back directamente.

---

# Parte 1. Configuración

## `index.html` (13 líneas)

**Para qué:** es la única página HTML del sitio (SPA). Casi está vacía: React dibuja todo adentro del `div`.

```html
<html lang="es">
  ...
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Gimnasio de Barrio: gestión de socios, empleados, clases con cupos y compras del kiosco" />
  <title>Gimnasio de Barrio</title>
  ...
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
```

- `lang="es"`: el lector de pantalla lee en español. Es parte de la accesibilidad.
- `viewport`: sin esto, el celular mostraría la página como si fuera de escritorio, achicada. Es la base del responsive.
- `description`: el resumen que muestran los buscadores.
- `<div id="root">`: el lugar donde React monta la aplicación.
- `type="module"`: carga `main.jsx` como módulo moderno de JavaScript (con `import`/`export`).

## `package.json` (20 líneas)

**Para qué:** describe el proyecto para npm: sus dependencias y sus comandos.

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
},
"dependencies": {
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "react-router-dom": "6.28.0"
},
"devDependencies": {
  "@vitejs/plugin-react": "4.3.4",
  "vite": "5.4.11"
}
```

- `scripts`: `npm run dev` levanta el servidor de desarrollo. `npm run build` arma la versión final en `dist/`.
  `npm run preview` muestra esa versión final.
- `dependencies`: lo que la app necesita para funcionar. `react` (componentes), `react-dom` (dibuja en el navegador)
  y `react-router-dom` (navegación entre pantallas).
- `devDependencies`: solo para programar, como Vite y su plugin de React. No forman parte de la app final.
- Las versiones son **exactas** (sin `^`), así todo el equipo usa las mismas.
- `"type": "module"`: los archivos usan `import`/`export`.

`package-lock.json` guarda las versiones exactas de **todo** lo que se instala, incluidas las dependencias de las
dependencias. `node_modules/` es la carpeta donde se instala, y no se sube a GitHub (está en `.gitignore`): se regenera
con `npm install`.

## `vite.config.js` (15 líneas)

**Para qué:** configura el servidor de desarrollo, y sobre todo el **proxy** que conecta con el back.

```js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: { "/api": env.BACKEND_URL || "http://localhost:8080" },
    },
  };
});
```

- `plugins: [react()]`: permite que Vite entienda JSX.
- `port: 5173`: el puerto del front.
- `proxy`: **todo pedido que empiece con `/api` se reenvía al back.** El navegador le pide `/api/socios` a
  `localhost:5173` y Vite se lo pasa a `localhost:8080`. Para el navegador es el mismo origen, así que no hay problema
  de **CORS**.
- `loadEnv` lee el archivo `.env`. Si existe `BACKEND_URL`, se usa esa dirección; si no, `localhost:8080`.
  **Así el back se puede mover a otro equipo sin tocar el código.**

## `.env.example`

```
BACKEND_URL=http://localhost:8080
```

Es un ejemplo. Para usarlo se copia como `.env` y se cambia la dirección. El `.env` real no se sube a GitHub, porque
cada uno puede tener la suya.

---

# Parte 2. Arranque

## `src/main.jsx` (13 líneas)

**Para qué:** es el primer código JavaScript que se ejecuta. Arranca React.

```jsx
import App from "./App.jsx";
import "./estilo.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- `import "./estilo.css"`: carga los estilos de todo el sitio, una sola vez.
- `createRoot(document.getElementById("root"))`: React toma el `div#root` del `index.html`.
- `.render(...)`: dibuja ahí el componente `<App>`.
- `<BrowserRouter>`: activa la navegación por URL. Todo lo que está adentro puede usar rutas y enlaces.
- `<React.StrictMode>`: **solo en desarrollo**, React ejecuta algunas cosas dos veces para detectar errores. No afecta
  a la versión final.

## `src/App.jsx` (52 líneas)

**Para qué:** define la **estructura común** de todas las pantallas (encabezado, contenido, pie) y **qué página
mostrar según la URL**.

**Líneas 16–28: el foco al cambiar de pantalla**

```jsx
export default function App() {
  const { pathname } = useLocation();
  const contenido = useRef(null);
  const rutaAnterior = useRef(pathname);

  useEffect(() => {
    if (rutaAnterior.current === pathname) return;
    rutaAnterior.current = pathname;
    window.scrollTo(0, 0);
    contenido.current?.focus({ preventScroll: true });
  }, [pathname]);
```

- `useLocation()`: hook de React Router que da la URL actual. `pathname` es, por ejemplo, `"/socios"`.
- `useRef(null)`: una "caja" que guarda una referencia al `<main>` real del HTML.
- `useEffect(..., [pathname])`: se ejecuta cada vez que cambia la URL.
- Adentro: sube la página (`scrollTo`) y pone el foco en el contenido. **¿Por qué?** Quien navega con teclado o lector
  de pantalla, al cambiar de página, quedaría con el foco en el menú. Así empieza a leer el contenido nuevo.
- `rutaAnterior`: evita hacerlo al abrir el sitio por primera vez. Así el primer Tab llega a "Saltar al contenido".

**Líneas 30–51: lo que se dibuja**

```jsx
<>
  <a className="saltar-contenido" href="#contenido">Saltar al contenido</a>
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
</>
```

- `<> ... </>`: un **fragmento**. Un componente debe devolver un solo elemento padre; el fragmento agrupa sin agregar
  un `div` extra al HTML.
- "Saltar al contenido": enlace oculto que aparece con el primer Tab. Permite saltear el menú (accesibilidad).
- `<Encabezado />` y `<Pie />` están siempre. Lo único que cambia es lo de adentro de `<Routes>`.
- Cada `<Route>` asocia una URL con una página. `path="*"` atrapa cualquier URL inexistente → página 404.
- `tabIndex={-1}`: permite darle el foco al `<main>` por código (normalmente no se puede, porque no es un control).

**Si te preguntan "¿cómo navega sin recargar?":** "React Router mira la URL y muestra el componente de esa ruta.
Los enlaces del menú son `NavLink`, que cambian la URL sin pedir otra página al servidor. Es una SPA".

---

# Parte 3. Hooks (`src/hooks/`)

Un **hook** es una función de React que empieza con `use` y le da capacidades a un componente: guardar estado,
ejecutar algo al dibujar, etc. Estos tres son **hooks propios**: los escribimos nosotros, juntando hooks de React,
para no repetir código en cada página.

## `useDatos.js` (29 líneas): cargar datos del back

**Para qué:** todas las páginas cargan datos igual: piden algo al back y muestran "cargando", el error o los datos.
Este hook hace eso una vez para todas.

**Quién lo usa:** todas las páginas con listas, `Inicio`, `Compra` e `InscriptosClase`.

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

- **Recibe** `cargador`, la función que trae los datos (por ejemplo `listarSocios`), e `inicial`, el valor mientras
  carga (una lista vacía por defecto).
- **Tres estados con `useState`:** `datos`, `cargando` (empieza en `true`) y `error` (texto vacío = sin error).
- **`recargar`:** marca que está cargando, llama al back y guarda los datos. Si falla, guarda el mensaje de error.
  `finally` se ejecuta siempre, salió bien o mal: deja de cargar.
- **`useCallback`:** guarda la **misma** función `recargar` entre dibujos. Sin eso, en cada dibujo habría una función
  nueva, el `useEffect` la vería "cambiada" y volvería a pedir los datos sin fin.
- **`useEffect`:** al montar la página, llama a `recargar()` una vez. Ahí se hace el pedido al back.
- **Devuelve** un objeto con todo. Las páginas lo usan así:
  `const { datos: socios, cargando, error, recargar } = useDatos(listarSocios);`

**Si te preguntan "¿por qué un hook propio?":** "Porque las seis pantallas cargan datos igual. Si mañana queremos
cambiar cómo se muestra un error de carga, se cambia en un solo lugar".

## `useMensaje.js` (31 líneas): avisar el resultado de una acción

**Para qué:** maneja el mensaje verde (éxito) o rojo (error) de cada página, y **ejecuta las acciones contra el
back** (alta, edición, baja) mostrando el resultado.

```js
const [mensaje, setMensaje] = useState({ texto: "", error: false });
const enCurso = useRef(false);
const avisar = (texto) => setMensaje({ texto, error: false });
const avisarError = (texto) => setMensaje({ texto, error: true });
const limpiar = () => setMensaje({ texto: "", error: false });

async function ejecutar(accion, textoExito, despues) {
  if (enCurso.current) return;
  enCurso.current = true;
  try {
    const resultado = await accion();
    avisar(typeof textoExito === "function" ? textoExito(resultado) : textoExito);
    if (despues) await despues(resultado);
  } catch (e) {
    avisarError(e.message);
  } finally {
    enCurso.current = false;
  }
}
```

- `mensaje`: un objeto con el texto y si es error o no. Lo dibuja el componente `<Mensaje>`.
- `avisar`, `avisarError`, `limpiar`: atajos para cambiar el mensaje.
- **`ejecutar(accion, textoExito, despues)`** es la pieza central:
  1. `accion`: la función que llama al back, por ejemplo `() => enviar(form)`.
  2. Si sale bien, muestra `textoExito`. Puede ser un texto fijo ("Producto agregado.") o una función que arma el texto
     con la respuesta del back (`(s) => "Socio " + nombreCompleto(s) + " creado."`).
  3. `despues`: lo que hay que hacer si salió bien, por ejemplo limpiar el formulario y recargar la lista.
  4. Si falla, muestra el error del back en rojo.
- **`enCurso` (`useRef`): evita el doble clic.** Si ya hay una acción corriendo, la segunda se ignora.
  **¿Por qué `useRef` y no `useState`?** Porque cambiar un `useRef` no vuelve a dibujar la pantalla y su valor está
  disponible al instante; un estado se actualizaría recién en el próximo dibujo y el segundo clic lo vería viejo.

## `useTitulo.js` (8 líneas): el título de la pestaña

```js
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo + " - Gimnasio de Barrio";
  }, [titulo]);
}
```

Cambia el título de la pestaña del navegador ("Socios - Gimnasio de Barrio"). En una SPA el `<title>` del HTML no
cambia solo. Sirve para la accesibilidad: el lector de pantalla anuncia en qué página estás.

---

# Parte 4. Lógica sin HTML (`src/js/`)

Funciones de JavaScript puro: no dibujan nada. Así las páginas quedan concentradas en la interfaz, y la lógica
(consultas, filtros, formatos, validaciones) se puede leer y cambiar aparte.

## `api.js` (69 líneas): **el único lugar que habla con el back**

**Líneas 12–14: qué método HTTP usar**

```js
export function metodoDe(form) {
  return (form.dataset.metodo || form.getAttribute("method") || "get").toUpperCase();
}
```

Lee el método del formulario. Primero mira `data-metodo` (para PUT y DELETE, que HTML no admite en `method`), después
`method` y, si no hay ninguno, GET. `form.dataset.metodo` es la forma de leer el atributo `data-metodo` desde JS.

**Líneas 17–30: los datos del formulario como objeto**

```js
export function datosDe(form) {
  const datos = {};
  for (const campo of form.elements) {
    if (!campo.name || campo.disabled) continue;
    if (campo.type === "radio" && !campo.checked) continue;
    if (campo.type === "number") {
      datos[campo.name] = campo.value === "" ? null : Number(campo.value);
    } else {
      datos[campo.name] = campo.value.trim();
    }
  }
  return datos;
}
```

- Recorre todos los campos del formulario (`form.elements`).
- Saltea los que no tienen `name` (por eso los campos de búsqueda no se envían) y los radios no elegidos.
- Los números se envían como **número** (`Number`), no como texto, porque así los espera Java.
- `.trim()` saca los espacios del principio y el final: "  Ana " llega como "Ana".
- El `name` del campo es la clave del JSON: `<input name="nombre">` → `{ "nombre": "..." }`. **Tiene que coincidir con
  el nombre del atributo en la clase Java.**

**Líneas 33–41: enviar el formulario**

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

- `datos = datosDe(form)`: **parámetro por defecto**. Si no le pasan datos, los saca del formulario. Clases y Compra le
  pasan datos armados a mano.
- Solo POST y PUT llevan cuerpo (`body`). `Content-Type: application/json` le avisa a Spring que va JSON.
- `JSON.stringify` convierte el objeto en texto JSON.
- La URL sale del `action` del formulario.

**Líneas 44–46:** `obtener(url)` es un GET simple, para listar y ver detalles.

**Líneas 50–69: el `fetch` y el manejo de errores**

```js
async function pedir(url, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
  }
  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  let json = null;
  try {
    json = texto ? JSON.parse(texto) : null;
  } catch {
    // la respuesta no es JSON
  }
  if (!respuesta.ok) {
    throw new Error(json?.detail || (respuesta.status >= 500 ? ERROR_DEL_SERVIDOR : json?.title) || ERROR_DEL_SERVIDOR);
  }
  return json;
}
```

- `await fetch(...)`: hace el pedido HTTP y espera la respuesta. Si **ni siquiera hay conexión** (back apagado), `fetch`
  falla y se lanza un error claro.
- `204` (sin contenido): lo que devuelve el back al borrar. No hay JSON, se devuelve `null`.
- Se lee el texto y se intenta pasar a JSON.
- `respuesta.ok` es `true` para los códigos 200 a 299. Si no, se lanza un error con el `detail` del `ProblemDetail`
  del back ("Ya existe un socio con DNI ..."). Si es un error 500 sin detalle, un mensaje entendible.
- Ese error lo atrapan `useDatos` o `useMensaje` y lo muestran en pantalla.

## `validaciones.js` (29 líneas)

**Patrones (líneas 7–15):** expresiones regulares que se ponen en el atributo `pattern` de los campos.

```js
export const PATRON_DNI = "[0-9]{7,8}";
export const PATRON_TELEFONO = "[0-9 +\\(\\)\\-]{8,20}";
export const PATRON_USUARIO = "[a-zA-Z0-9._\\-]{3,30}";
export const PATRON_NOMBRE = " *[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ' \\-]{1,99}";
export const PATRON_TEXTO = "\\s*\\S.*";
```

- `[0-9]{7,8}`: entre 7 y 8 dígitos.
- Nombre: puede empezar con espacios (después se recortan), después una letra y luego letras, espacios, apóstrofe o
  guion. **No acepta números.**
- `\s*\S.*`: tiene que haber al menos un carácter que no sea espacio, así "   " no pasa.
- La doble barra (`\\`) es porque, dentro de un texto de JavaScript, `\\` se convierte en una sola `\`.

**Topes (líneas 18–19):** `PRECIO_MAXIMO = 10000000` y `STOCK_MAXIMO = 100000`, para que no entren valores absurdos.

**Líneas 25–29: validar un formulario entero**

```js
export function validarFormulario(form) {
  const valido = form.checkValidity();
  if (!valido) form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
  return valido;
}
```

- `checkValidity()`: función nativa del navegador. Revisa todos los `required`, `min`, `max`, `pattern`... y dispara el
  evento `invalid` en cada campo que falla. **Ese evento lo escucha `Campo` para mostrar el mensaje.**
- Si hay errores, pone el foco en el primer campo inválido.

## `formatos.js` (54 líneas): dinero y fechas

```js
const moneda = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });
export const formatoPrecio = (valor) => moneda.format(Number(valor) || 0);
```

`Intl.NumberFormat` es nativo del navegador: `1500.5` → `$ 1.500,50` (formato argentino).

```js
export function aFecha(valor) {
  const texto = String(valor);
  return new Date(texto.length === 10 ? texto + "T00:00:00" : texto.slice(0, 19));
}
```

Convierte la fecha que manda el back en un `Date` de JS. **Arregla un error real:** `new Date("2026-10-08")`, sin
hora, se interpreta en hora UTC; en Argentina (UTC−3) eso es el día anterior a las 21 hs, así que la fecha se mostraba
**un día antes**. Agregando `T00:00:00` se toma como hora local.

El resto del archivo:

| Función | Qué hace |
|---|---|
| `formatoFechaHora` | `20/11/2026, 18:00`, con el año de 4 dígitos y 24 horas |
| `formatoFecha` | Solo la fecha |
| `paraInputFechaHora` | Prepara una fecha para mostrarla en un `<input type="datetime-local">` |
| `ahoraParaInput` | La fecha y hora de ahora, para usarla como mínimo en el alta de clases |
| `enAniosParaInput(2)` | La fecha dentro de 2 años, usada como máximo: así no se puede poner el año 9999 |
| `paraBackend` | El input da `"2026-11-20T18:00"` y Java espera los segundos: le agrega `":00"` |

## `socios.js` (46 líneas)

```js
export const listarSocios = () => obtener("/api/socios");
export const obtenerSocio = (id) => obtener("/api/socios/" + id);

export async function listarSociosActivos() {
  const socios = await listarSocios();
  return socios.filter((s) => s.activo);
}
```

- Las funciones que piden datos al back (las usan `useDatos` y las páginas).
- `listarSociosActivos`: solo los activos, para la compra y para inscribir a clases.
- `filtrarSocios(socios, { texto, estado })` (líneas 22–30): filtra **en el navegador** (sin volver a pedir al back) por
  texto (nombre, apellido o DNI) y por estado.
- `datosDetalleSocio(s)` (líneas 33–46): arma los pares `[título, valor]` que muestra el modal de detalle.

## `productos.js` (37 líneas)

```js
export const listarProductos = () => obtener("/api/productos?soloDisponibles=true");
export const hayStock = (producto) => producto.stock > 0;
```

- `?soloDisponibles=true` es un **parámetro de la URL**: el back devuelve solo los productos activos (los borrados son
  baja lógica, siguen en la base).
- `filtrarProductos` (líneas 15–28): filtra por texto y stock, y **ordena** con `sort` y un comparador.
  `[...filtrados]` hace una **copia** antes de ordenar, porque `sort` modifica la lista original.

## `clases.js` (24 líneas)

- `listarClases`, `listarInscriptos(claseId)`: `GET /api/clases` y `GET /api/inscripciones?claseId=...`.
- `listarInstructores` (líneas 8–11): pide los empleados y deja solo los activos. Llenan el desplegable "Instructor".
- `filtrarClases` (líneas 14–22): por estado (activas o canceladas), por texto y "solo con lugares libres".

## `empleados.js` (22 líneas)

- `listarEmpleados`, `obtenerEmpleado(id)`.
- `nombreRol`: traduce `"ADMIN"` a "Administrador" para mostrar.
- `datosDetalleEmpleado`: los pares del modal de detalle. **No incluye la contraseña**: el back nunca la devuelve.

## `compra.js` (12 líneas)

```js
export const FORMAS_DE_PAGO = [
  { valor: "EFECTIVO", nombre: "Efectivo", pagada: true },
  { valor: "TRANSFERENCIA", nombre: "Transferencia", pagada: true },
  { valor: "DEUDA", nombre: "Anotar en la cuenta del socio", pagada: false },
];
export const estaPagada = (valor) => FORMAS_DE_PAGO.find((f) => f.valor === valor)?.pagada ?? true;
```

El back solo necesita saber si la venta quedó **pagada**. Si es `false`, suma el monto a la deuda del socio.
`estaPagada` traduce la forma de pago elegida a ese `true`/`false`.

## `membresias.js` (18 líneas)

`MEMBRESIAS` (con los precios de la landing) y `MEDIOS_PAGO`. Los valores (`"MENSUAL"`, `"EFECTIVO"`) son los
**mismos textos que los enums de Java**. Los precios son contenido fijo: el back no guarda precios de membresía.

---

# Parte 5. Componentes (`src/componentes/`)

Un **componente** es una función que recibe **props** (datos de su padre) y devuelve JSX. Se nombra con mayúscula
(PascalCase) para que React no lo confunda con una etiqueta HTML.

## `Encabezado.jsx` (47 líneas): el menú

```jsx
const ENLACES = [
  ["/", "Inicio"],
  ["/socios", "Socios"],
  ...
];

export default function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  ...
  <button type="button" className="boton-menu" aria-expanded={abierto} aria-controls="menu-principal"
          onClick={() => setAbierto(!abierto)}>
    {abierto ? "Cerrar menú" : "Menú"}
  </button>
  <nav id="menu-principal" className="menu" aria-label="Navegación principal" hidden={!abierto}>
    <ul>
      {ENLACES.map(([ruta, texto]) => (
        <li key={ruta}>
          <NavLink to={ruta} end={ruta === "/"} onClick={() => setAbierto(false)}>
            {texto}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
```

- Los enlaces están en una lista y se dibujan con `.map()`: para agregar una página al menú se suma una línea.
- `abierto` (`useState`): en celular el menú arranca cerrado y el botón lo abre o lo cierra.
- `aria-expanded`: le dice al lector de pantalla si el menú está abierto. `aria-controls` indica qué controla el botón.
- `hidden={!abierto}`: oculta el menú. En pantallas grandes el CSS lo muestra igual y esconde el botón.
- **`NavLink`** en lugar de `<a>`: navega **sin recargar** y agrega `aria-current="page"` en la página actual. El CSS
  usa eso para resaltarla.
- `end={ruta === "/"}`: sin esto, "Inicio" (`/`) quedaría marcado en todas las páginas, porque todas las rutas
  empiezan con `/`.
- Al tocar un enlace se cierra el menú (`setAbierto(false)`).

## `Pie.jsx` (18 líneas)

El pie de todas las páginas, con los enlaces a **Políticas** y **Acerca de**. Usa `Link` (de React Router) para
navegar sin recargar. Que estén acá cumple el pedido del profe de que esos enlaces estén siempre visibles.

## `Campo.jsx` (52 líneas): **el campo de formulario de todo el sitio**

**Quién lo usa:** todos los formularios.

```jsx
export default function Campo({ id, etiqueta, ayuda, as: Control = "input", children, ...props }) {
  const [error, setError] = useState("");

  const alInvalido = (e) => {
    e.preventDefault();
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
      <Control id={id} {...props} onInvalid={alInvalido} onInput={alEscribir}
               aria-invalid={error ? "true" : undefined} aria-describedby={describedBy}>
        {children}
      </Control>
      {ayuda && <small id={id + "-ayuda"} className="ayuda">{ayuda}</small>}
      <small id={id + "-error"} className="error-campo" role="alert">{error}</small>
    </div>
  );
}
```

- **Props:** `id`, `etiqueta`, `ayuda`, y `as` para elegir si es un `input` o un `select`. `...props` junta **todo lo
  demás** (`name`, `type`, `required`, `pattern`, `min`...) y se lo pasa tal cual al campo real (`{...props}`).
- `as: Control = "input"`: renombra la prop `as` a `Control` (con mayúscula, para poder usarla como componente) y vale
  `"input"` si no la pasan.
- **Cómo aparece el error:**
  1. `validarFormulario()` llama a `checkValidity()`, y el navegador dispara el evento `invalid` en el campo que falla.
  2. `alInvalido` lo atrapa: `preventDefault()` evita el globo nativo del navegador y guarda el mensaje en `error`.
     Usa el texto de `data-mensaje-error` (por ejemplo "Escribí el DNI con 7 u 8 números") o el del navegador.
  3. El mensaje se dibuja en el `<small>` de abajo.
  4. `alEscribir`: apenas el usuario corrige, el error desaparece.
- **Accesibilidad:**
  - `label htmlFor={id}` une la etiqueta con el campo: tocar el texto enfoca el campo. En JSX se escribe `htmlFor`
    porque `for` es una palabra reservada de JavaScript.
  - `aria-describedby`: el lector lee la ayuda y el error junto con el campo.
  - `aria-invalid`: marca el campo inválido. El CSS le pone el borde rojo.
  - `role="alert"`: el lector anuncia el error apenas aparece.
  - El asterisco tiene `aria-hidden` porque es decorativo: el lector ya sabe que es obligatorio por `required`.

## `Casilla.jsx` (29 líneas)

Lo mismo que `Campo`, pero para un **checkbox** ("El socio aceptó las políticas"). Recibe `children` porque el texto
lleva un enlace adentro.

## `CamposSocio.jsx` (84 líneas)

Los campos del socio (DNI, nombre, apellido, email, teléfono, membresía, medio de pago). **Se usa en el alta y en la
edición**, así no se repite el formulario.

```jsx
export default function CamposSocio({ prefijo, socio = {}, conDni = false }) {
  ...
  {conDni && ( <Campo id={prefijo + "-dni"} ... /> )}
  <Campo id={prefijo + "-nombre"} ... defaultValue={socio.nombre} pattern={PATRON_NOMBRE} ... />
```

- `prefijo` ("alta" o "editar"): el alta y la edición están en la misma página, y dos campos no pueden tener el mismo
  `id`. Quedan `alta-nombre` y `editar-nombre`.
- `conDni`: el DNI solo se carga en el alta. Al editar no se muestra, porque el back no permite cambiarlo.
- `defaultValue={socio.nombre}`: en la edición, el campo arranca con el valor actual. En el alta, `socio` es `{}` y
  queda vacío.

## `FormPago.jsx` (47 líneas)

Formulario para pagar la deuda: `POST /api/pagos`.

```jsx
<form method="post" action="/api/pagos" onSubmit={alEnviar} noValidate>
  <input type="hidden" name="socioId" value={socio.id} />
  <input type="hidden" name="concepto" value="DEUDA" />
  <Campo id="pago-monto" ... type="number" min="0.01" max={socio.deuda} ... defaultValue={socio.deuda} />
```

- Los `hidden` son campos que no se ven pero se envían: el socio y el concepto.
- `max={socio.deuda}`: no se puede pagar más de lo que se debe. Arranca con el total de la deuda.
- No llama al back él mismo: valida y le pasa el formulario a la página (`onEnviar(form)`).

## `Dialogo.jsx` (23 líneas): las ventanas modales

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

- Usa el elemento **nativo** `<dialog>` del HTML: el navegador ya resuelve el fondo oscuro, atrapar el foco adentro,
  cerrar con **Escape** y devolver el foco al botón que lo abrió.
- `ref`: referencia al `<dialog>` real, para llamar a `showModal()` y `close()`.
- `useEffect`: cuando cambia la prop `abierto`, abre o cierra el modal.
- `onClose={onCerrar}`: si se cierra con Escape, avisa a la página para que actualice su estado.
- `useId()`: genera un id único para unir el título con `aria-labelledby`.
- **`children`:** lo que la página pone adentro (el detalle, el formulario de edición...). Un solo componente sirve para
  todos los modales.

## `Detalle.jsx` (13 líneas)

Recibe pares `[título, valor]` y los muestra como **lista de definición** (`<dl>`, `<dt>`, `<dd>`), la etiqueta
semántica para pares "dato: valor". Si un valor no existe, muestra "-" (`valor ?? "-"`).

## `Tabla.jsx` (23 líneas)

```jsx
<table className="tabla-datos">
  <caption>{titulo}</caption>
  <thead>
    <tr>
      {columnas.map((c) => (<th key={c} scope="col">{c}</th>))}
    </tr>
  </thead>
  <tbody>{children}</tbody>
</table>
```

- `<caption>`: el título de la tabla (lo lee el lector de pantalla).
- `scope="col"`: indica que cada `<th>` es el encabezado de su columna.
- Las filas las pone la página (`children`). Cada `<td>` lleva `data-label` con el nombre de su columna: el CSS lo usa
  para convertir las filas en tarjetas en el celular.

## `Estado.jsx` (27 líneas): cargando / error / vacío

```jsx
export default function Estado({ cargando, error, vacio, textoVacio, recargar, children }) {
  if (cargando) return <p className="estado" role="status">Cargando...</p>;
  if (error) {
    return (
      <div className="estado error" role="alert">
        <p>{error}</p>
        {recargar && <button type="button" className="secundario" onClick={recargar}>Reintentar</button>}
      </div>
    );
  }
  if (vacio) return <p className="estado">{textoVacio}</p>;
  return children;
}
```

**Renderizado condicional** con `if` y `return` temprano. Comunica los estados que pide la rúbrica: si está cargando,
"Cargando..."; si hubo error, el error con **Reintentar**; si no hay datos, el texto de lista vacía; y si está todo
bien, el contenido (`children`). `role="status"` y `role="alert"` hacen que el lector de pantalla los anuncie.

## `Mensaje.jsx` (11 líneas)

```jsx
<div className="zona-mensaje" aria-live="polite" aria-atomic="true">
  {mensaje.texto && <p className={"mensaje" + (mensaje.error ? " error" : "")}>{mensaje.texto}</p>}
</div>
```

- Muestra el mensaje de `useMensaje`, en verde o en rojo según `mensaje.error`.
- El `div` existe **siempre**, aunque esté vacío. `aria-live="polite"` hace que el lector anuncie el texto cuando
  aparece, y para eso el contenedor tiene que existir antes.
- `zona-mensaje` es `sticky` en el CSS: el mensaje queda visible aunque hayas bajado por una tabla larga.

## `Ticket.jsx` (39 líneas)

El comprobante de la compra. Muestra **los datos que devolvió el back** (`venta.id`, `venta.montoTotal`,
`venta.fechaHora`), no los que calculó el front: así el comprobante refleja lo que realmente se guardó. Si
`venta.pagada` es `false`, aclara que quedó anotado en la cuenta del socio.

## `InscriptosClase.jsx` (102 líneas): el modal de inscriptos

**Para qué:** dentro del modal de una clase, inscribir socios y cancelar inscripciones.

**Líneas 16–21: tres cargas de datos a la vez**

```jsx
const cargarInscriptos = useCallback(async () => (await listarInscriptos(clase.id)).filter((i) => i.estado === "ACTIVA"), [clase.id]);
const cargarCupos = useCallback(async () => (await listarClases()).find((c) => c.id === clase.id) ?? clase, [clase]);
const inscriptos = useDatos(cargarInscriptos);
const socios = useDatos(listarSociosActivos);
const cupos = useDatos(cargarCupos, clase);
```

- Usa `useDatos` **tres veces**: los inscriptos activos, los socios para el desplegable y los cupos actualizados de la
  clase.
- `useCallback` es obligatorio acá: las funciones se crean dentro del componente, y sin él `useDatos` las vería
  distintas en cada dibujo y pediría los datos sin parar.

**Líneas 23–26:** `refrescar` recarga inscriptos y cupos **en paralelo** (`Promise.all`) y avisa a la página
(`alCambiar`) para que actualice la tabla de clases.

**Línea 69:** `disabled={!clase.activa || cupos.datos.cuposDisponibles <= 0}`: el botón Inscribir se deshabilita si la
clase está cancelada o llena. El back lo vuelve a controlar.

---

# Parte 6. Páginas (`src/paginas/`)

Todas las páginas de CRUD siguen **el mismo esquema**. Si entendés una, entendés las cuatro:

```
1. useTitulo(...)                         título de la pestaña
2. useDatos(listar...)                    carga la lista
3. useMensaje()                           mensaje y ejecutar
4. useState: filtro, detalle, editando    qué está abierto o filtrado
5. funciones: alta, modificar, baja, verDetalle
6. JSX: <h1>, <Mensaje>, formulario de alta, filtros, <Estado><Tabla>, <Dialogo>s
```

## `Productos.jsx` (210 líneas): **la página modelo**

**Líneas 17–57: `CamposProducto`**, un componente chico dentro del mismo archivo. Los campos del producto, para el alta
y la edición, con los topes: `max={PRECIO_MAXIMO}` y `max={STOCK_MAXIMO}`.

**Líneas 60–68: el estado**

```jsx
const { datos: productos, cargando, error, recargar } = useDatos(listarProductos);
const { mensaje, avisarError, limpiar, ejecutar } = useMensaje();
const [filtro, setFiltro] = useState({ texto: "", stock: "todos", orden: "nombre" });
const [detalle, setDetalle] = useState(null);
const [editando, setEditando] = useState(null);

const visibles = filtrarProductos(productos, filtro);
```

- `datos: productos`: **destructuring con renombre**. Toma `datos` del objeto y lo llama `productos`.
- `detalle` y `editando` valen `null` cuando el modal está cerrado, y el producto cuando está abierto.
- `visibles` **no es un estado**: se calcula en cada dibujo a partir de la lista y el filtro.

**Líneas 76–84: el alta**

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

1. `preventDefault()`: el navegador, al enviar un form, recargaría la página. Lo frenamos.
2. `e.currentTarget`: el formulario que disparó el evento.
3. Si algún campo falla, se corta: `Campo` muestra los errores.
4. `ejecutar`: hace el `POST`, muestra el mensaje y, si salió bien, limpia el form y recarga la lista.

**Líneas 95–99: borrar**

```jsx
function borrar(e, producto) {
  e.preventDefault();
  if (!window.confirm("¿Borrar el producto " + producto.nombre + "?")) return;
  ejecutar(() => enviar(e.currentTarget), "Producto borrado.", recargar);
}
```

`window.confirm` muestra la pregunta nativa del navegador. El formulario de cada fila es
`<form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id}>` (línea 174).

**Líneas 101–107: `verDetalle`** hace `GET /api/productos/{id}` y guarda el resultado en `detalle`, lo que abre el modal.

**El JSX:** el formulario de alta (línea 117), los filtros (129), `<Estado>` con la `<Tabla>` (149–156) y los dos
`<Dialogo>`: detalle (186) y edición (194).

```jsx
<Dialogo abierto={editando !== null} onCerrar={() => setEditando(null)} titulo="Editar producto">
  {editando && (
    <form key={editando.id} method="post" data-metodo="PUT" action={"/api/productos/" + editando.id} ...>
      <Mensaje mensaje={mensaje} />
      <CamposProducto prefijo="editar" producto={editando} />
```

- `abierto={editando !== null}`: el modal se abre cuando hay un producto en edición.
- `{editando && (...)}`: el formulario solo existe mientras se edita.
- `key={editando.id}`: si se edita otro producto, React crea un formulario nuevo con los valores correctos, en vez de
  reutilizar el anterior.
- `<Mensaje>` también **adentro** del modal: si falla el guardado, el error se ve ahí y no queda escondido detrás.

## `Socios.jsx` (250 líneas)

Mismo esquema que Productos, más:

- **Líneas 45–53, `abrirEdicion` y `abrirPago`:** limpian el mensaje anterior antes de abrir un modal.
- **Líneas 55–63, alta:** el texto de éxito es una función: `(s) => "Socio " + nombreCompleto(s) + " creado."`.
  Usa la respuesta del back.
- **Líneas 74–78, `accionDelSocio`:** una sola función para la baja y la reactivación (pregunta si hace falta y ejecuta).
- **Líneas 80–85, `pagarDeuda`:** recibe el formulario de `FormPago` y hace `POST /api/pagos`.
- **Líneas 108–114, la casilla de políticas:** `required`, con un enlace que abre `/politicas` en otra pestaña
  (`target="_blank"`), así no se pierde lo que ya se cargó.
- **En la tabla:** si el socio está activo se muestra "Baja"; si no, "Dar de alta" (`PUT /api/socios/{id}/reactivar`).
  "Pagar deuda" aparece solo si `s.deuda > 0`.
- **Líneas 237–248:** el modal de pago de deuda.

## `Empleados.jsx` (219 líneas)

Mismo esquema. Lo particular:

- **Líneas 17–86, `CamposEmpleado`** con `conCredenciales`: usuario y contraseña se piden **solo en el alta**. En la
  edición no aparecen, porque el back no los cambia con ese endpoint.
- El campo contraseña es `type="password"` con `autoComplete="new-password"`.
- **Línea 180:** "Baja" solo para empleados activos. El back no tiene un endpoint para reactivar empleados.

## `Clases.jsx` (251 líneas)

**Líneas 17–79, `CamposClase`:**

```jsx
const esAlta = clase.id === undefined;
const inscriptos = esAlta ? 0 : clase.capacidad - clase.cuposDisponibles;
...
min={esAlta ? ahoraParaInput() : undefined}
max={enAniosParaInput(2)}
...
min={Math.max(1, inscriptos)}
```

- En el alta, la fecha tiene que ser **futura**. En los dos casos, dentro de los próximos **2 años**: no entra el año 9999.
- Al editar, la capacidad no puede ser menor a los inscriptos actuales.

**Línea 94, `datosClase`:**

```jsx
const datosClase = (form) => ({ ...datosDe(form), horario: paraBackend(form.elements["horario"].value) });
```

Toma los datos del formulario y **reemplaza** `horario` por la versión con segundos que espera Java. El `...` (spread)
copia todo el objeto, y después se pisa una sola propiedad.

**Línea 85:** usa `useDatos` dos veces: las clases y los instructores (para el desplegable).

**Líneas 193–197, los cupos en la tabla:** "X de Y libres" en verde, o "Sin cupo" en rojo.

**Línea 241:** el modal de inscriptos muestra el componente `InscriptosClase`, y le pasa `alCambiar={recargar}` para
que la tabla se actualice cuando se inscribe o cancela.

## `Compra.jsx` (210 líneas): el flujo de compra

**Líneas 31–42: el estado y los valores calculados**

```jsx
const [productoId, setProductoId] = useState(null);
const [cantidad, setCantidad] = useState("1");
const [socioId, setSocioId] = useState("");
const [pago, setPago] = useState("EFECTIVO");
const [venta, setVenta] = useState(null);
const [procesando, setProcesando] = useState(false);

const productos = datos.filter(hayStock);
const producto = productos.find((p) => p.id === productoId);
const total = producto ? producto.precio * (Number(cantidad) || 0) : 0;
const paso = venta ? 3 : producto ? 2 : 1;
```

- Acá los campos son **controlados** (`value` + `onChange`): el valor vive en el estado. Hace falta porque el **total**
  se recalcula mientras escribís. En las altas de otras páginas se usa `defaultValue` (**no controlados**) porque los
  datos se leen recién al enviar.
- Se guarda el **id** del producto, no el producto entero: después de recargar, `producto` se busca en la lista nueva y
  así el stock y el precio quedan actualizados.
- **`paso` se calcula, no se guarda:** sin producto, paso 1; con producto, paso 2; con venta registrada, paso 3. Así es
  imposible que el indicador de pasos y la pantalla queden desincronizados.

**Líneas 59–79: confirmar la compra**

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
      productoId,
      cantidad: Number(cantidad),
      pagada: estaPagada(pago),
    };
    setVenta({ ...(await enviar(form, datosVenta)), formaDePago: pago });
  } catch (err) {
    avisarError(err.message);
  } finally {
    setProcesando(false);
    recargar(); // el stock cambio (por esta compra o por otra)
  }
}
```

- Un solo `POST /api/ventas` con el JSON que espera Java (`VentaRequest`).
- `setVenta({ ...respuesta, formaDePago: pago })`: guarda la venta que devolvió el back **y le agrega** la forma de pago
  para mostrarla en el comprobante (el back no la guarda).
- `procesando`: deshabilita los botones y muestra "Procesando..." mientras espera. Así no hay doble venta.
- `finally` → `recargar()`: el stock cambió, haya salido bien o mal.

**El JSX:** `<ol className="pasos">` (el indicador, con `aria-current="step"` en el actual) y tres bloques
`{paso === 1 && ...}`, `{paso === 2 && ...}`, `{paso === 3 && ...}`. En el 3, `<Ticket venta={venta} />` y el botón
"Imprimir comprobante" (`window.print()`; el CSS de `@media print` oculta el menú y los botones).

## `Inicio.jsx` (101 líneas)

- `SERVICIOS` (líneas 9–13): los textos de las tarjetas, en una lista que se recorre con `.map()`.
- `textoCupos` (líneas 15–18): "1 lugar libre" en singular, "N lugares libres" en plural, o "Sin cupo".
- **Próximas clases (líneas 25–28):**
  ```jsx
  const proximas = clases
    .filter((c) => c.activa && aFecha(c.horario) >= new Date())
    .sort((a, b) => aFecha(a.horario) - aFecha(b.horario))
    .slice(0, 3);
  ```
  Toma las clases del back, deja las activas y futuras, las ordena por fecha y se queda con las 3 primeras. Es una
  **cadena** de métodos de listas: cada uno trabaja sobre el resultado del anterior.
- La única página donde el `h1` está dentro de la portada.

## `Acerca.jsx` (54 líneas)

La compañía, los integrantes y las tecnologías. Los integrantes se dibujan con `.map()` sobre `INTEGRANTES`, y la
función `iniciales` arma las letras del círculo ("Lucas Bollini" → "LB").

## `Politicas.jsx` (70 líneas)

Las políticas de seguridad y privacidad, con secciones `<section>` y sus `<h2>`. El enlace externo (línea 55):

```jsx
<a href={ENLACE_AAIP} target="_blank" rel="noopener noreferrer">
  Agencia de Acceso a la Información Pública (se abre en otra pestaña)
</a>
```

- Para un sitio **externo** se usa `<a>`, no `Link` (que es solo para rutas internas).
- `target="_blank"`: se abre en otra pestaña. El texto lo avisa, porque es una buena práctica de accesibilidad.
- `rel="noopener noreferrer"`: seguridad. La página abierta no puede manejar la nuestra (ataque "tabnabbing") ni
  saber de dónde viene.

## `NoEncontrada.jsx` (12 líneas)

La página 404, para cualquier URL que no exista (`<Route path="*">` en `App.jsx`). Tiene un enlace para volver al
inicio.

---

# Parte 7. Estilos (`src/estilo.css`, 287 líneas)

Una sola hoja para todo el sitio, ordenada por secciones con comentarios `/* ---------- ... ---------- */`.

**Líneas 7–37, variables (`:root`):**

```css
:root {
    --fondo: #f4f6f8;
    --superficie: #ffffff;
    --texto: #1e293b;
    --principal: #1b5e20;
    ...
}
```

Los colores se definen **una vez** y se usan en todo el CSS con `var(--principal)`. Para cambiar el verde de todo el
sitio, se toca una línea.

**Línea 39, modo oscuro:**

```css
@media (prefers-color-scheme: dark) {
    :root {
        --fondo: #111811;
        --texto: #e9f0e9;
        ...
    }
}
```

Si la compu del usuario está en modo oscuro, se redefinen **solo las variables**. Como texto y fondo cambian juntos,
nunca queda texto blanco sobre fondo blanco.

**Línea 222, las tablas en celular:**

```css
@media (max-width: 760px) {
    .tabla-datos thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .tabla-datos, .tabla-datos caption, .tabla-datos tbody, .tabla-datos tr, .tabla-datos td { display: block; width: 100%; }
    ...
    .tabla-datos td[data-label]::before { content: attr(data-label); ... }
}
```

En pantallas chicas, cada fila pasa a ser una **tarjeta**: las celdas se apilan y, antes de cada una, `::before`
muestra el nombre de la columna sacado de `data-label`. El encabezado se oculta visualmente, pero el lector de
pantalla lo sigue leyendo.

**Línea 271, pantallas grandes (mobile first):**

```css
@media (min-width: 761px) {
    .boton-menu { display: none; }
    .menu, .menu[hidden] { display: block; width: auto; }
    .menu ul { flex-direction: row; flex-wrap: wrap; }
    .campos { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .rejilla.tres { grid-template-columns: repeat(3, 1fr); }
    .rejilla.auto { grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); }
}
```

**Mobile first:** el diseño base es para celular, y esta media query lo amplía en pantallas grandes. Se esconde el
botón "Menú" y el menú queda siempre visible y en fila, los formularios pasan a 2 columnas y las tarjetas a 3.
`repeat(auto-fill, minmax(15rem, 1fr))` es una grilla que decide sola cuántas columnas entran según el ancho.

Otros detalles:

| Regla | Para qué |
|---|---|
| `:focus-visible { outline: 3px solid var(--foco); }` | Contorno bien visible al navegar con teclado |
| `.solo-lectores` | Oculta un texto a la vista, pero el lector de pantalla lo lee ("Editar *Juan Perez*") |
| `.zona-mensaje { position: sticky; top: 0.5rem; }` | El mensaje queda fijo arriba al bajar por la página |
| `@media print` (línea 280) | Al imprimir el comprobante, oculta el encabezado, el pie y los botones |
| `@media (prefers-reduced-motion: reduce)` (línea 285) | Desactiva animaciones a quien lo pidió en su sistema |

---

# Glosario de JavaScript que aparece en el código

| Símbolo o palabra | Qué significa | Ejemplo del proyecto |
|---|---|---|
| `const` / `let` | Variable que no se reasigna / que sí | `const form = e.currentTarget;` |
| `() => ...` | Función flecha (forma corta de escribir una función) | `(s) => s.activo` |
| `{ a, b } = objeto` | **Destructuring**: saca propiedades de un objeto | `const { mensaje, ejecutar } = useMensaje();` |
| `{ datos: socios }` | Destructuring con renombre | `const { datos: socios } = useDatos(...)` |
| `[a, b] = lista` | Destructuring de una lista | `const [cantidad, setCantidad] = useState("1");` |
| `...objeto` | **Spread**: copia todo y después se puede pisar algo | `{ ...filtro, texto: "x" }` |
| `...props` en los parámetros | **Rest**: junta "todo lo demás" | `function Campo({ id, ...props })` |
| `a?.b` | **Optional chaining**: si `a` es null, no falla y da `undefined` | `contenido.current?.focus()` |
| `a ?? b` | Si `a` es `null` o `undefined`, usa `b` | `valor ?? "-"` |
| `a \|\| b` | Si `a` es "falsy" (vacío, 0, null...), usa `b` | `form.dataset.metodo \|\| ...` |
| `cond ? a : b` | Operador ternario: un if/else en una línea | `s.activo ? "Activo" : "Baja"` |
| `cond && <X/>` | Renderizado condicional: muestra X solo si cond es verdadera | `{s.deuda > 0 && <button>...}` |
| `async` / `await` | Esperar una operación lenta (como `fetch`) sin trabar la página | `await obtener(url)` |
| `try / catch / finally` | Intentar algo; si falla, atraparlo; y al final, siempre | `useDatos`, `pedir` |
| `.map()` | Transforma cada elemento de una lista | lista de socios → filas `<tr>` |
| `.filter()` | Se queda con los elementos que cumplen algo | `socios.filter((s) => s.activo)` |
| `.find()` | Devuelve el primer elemento que cumple algo | `productos.find((p) => p.id === productoId)` |
| `.sort()` | Ordena (modifica la lista; por eso se copia antes) | `[...filtrados].sort(...)` |
| `export` / `import` | Compartir funciones entre archivos | `export const listarSocios = ...` |
| `export default` | Lo principal del archivo (se importa sin llaves) | `import Campo from "./Campo.jsx"` |
| `e.preventDefault()` | Cancela lo que el navegador haría por defecto | que el form recargue la página |
| `e.currentTarget` | El elemento que tiene el evento (el form) | `const form = e.currentTarget;` |
| `dataset` | Lee los atributos `data-*` desde JS | `form.dataset.metodo` lee `data-metodo` |
