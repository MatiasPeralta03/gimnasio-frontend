# Preparación para la defensa

Complementa [FRONTEND.md](FRONTEND.md), que explica cómo está hecho el front. Acá está lo que hace falta para
defenderlo: qué hace cada archivo, un guion para la demo y las preguntas probables con su respuesta.
La evaluación es individual: cada uno tiene que poder explicar cualquier parte.

## 1. Qué hace cada archivo

| Archivo | Qué hace |
|---|---|
| `index.html` | La única página HTML. Tiene el `<div id="root">` donde React dibuja todo |
| `src/main.jsx` | Arranque: monta `<App>` dentro de `StrictMode` y del `BrowserRouter` |
| `src/App.jsx` | Estructura común (enlace "Saltar al contenido", encabezado, rutas, pie). Mueve el foco al contenido al cambiar de pantalla |
| `src/estilo.css` | Todos los estilos: variables de color, modo oscuro, responsive, impresión |
| **paginas/** | Una por ruta |
| `Inicio.jsx` | Landing: servicios, planes y próximas clases (las trae del back) |
| `Socios.jsx` | Alta, búsqueda y filtro, detalle, edición, baja y reactivación, pago de deuda |
| `Empleados.jsx` | Alta, detalle, edición y baja |
| `Clases.jsx` | Alta, agenda con cupos y filtros, edición, cancelación, abre el modal de inscriptos |
| `Productos.jsx` | Alta, catálogo con búsqueda, filtro de stock y orden, detalle, edición y borrado |
| `Compra.jsx` | Flujo de compra en 3 pasos |
| `Acerca.jsx`, `Politicas.jsx`, `NoEncontrada.jsx` | La compañía e integrantes, políticas, página 404 |
| **componentes/** | Piezas reutilizables |
| `Encabezado.jsx`, `Pie.jsx` | Menú (se pliega en celular) y pie con Políticas y Acerca de |
| `Campo.jsx` | Etiqueta + campo + ayuda + mensaje de error. Lo usan todos los formularios |
| `Casilla.jsx` | Checkbox con su error (aceptar políticas) |
| `CamposSocio.jsx` | Campos del socio; sirven para el alta y para la edición |
| `FormPago.jsx` | Formulario de pago de deuda |
| `InscriptosClase.jsx` | Contenido del modal de inscriptos: inscribir y cancelar |
| `Dialogo.jsx` | Ventana modal con `<dialog>` nativo |
| `Tabla.jsx`, `Detalle.jsx` | Tabla accesible y lista de datos de un detalle |
| `Mensaje.jsx`, `Estado.jsx` | Mensaje de éxito o error, y estados cargando / error / vacío |
| `Ticket.jsx` | Comprobante de la compra |
| **hooks/** | Lógica de estado reutilizable |
| `useDatos.js` | Carga datos del back y da `datos`, `cargando`, `error` y `recargar` |
| `useMensaje.js` | Mensaje de la página y `ejecutar()`: corre una acción, muestra el resultado y evita el doble envío |
| `useTitulo.js` | Cambia el título de la pestaña |
| **js/** | Lógica sin HTML |
| `api.js` | El único lugar que hace `fetch`. Lee método y URL del formulario, manda JSON, traduce errores |
| `socios.js`, `clases.js`, `productos.js`, `empleados.js` | Consultas, filtros y datos para mostrar de cada entidad |
| `compra.js` | Formas de pago y si la venta queda pagada |
| `validaciones.js` | Patrones (DNI, teléfono, nombre...), topes y `validarFormulario()` |
| `formatos.js` | Dinero y fechas en formato argentino, y conversión de fechas para el back |
| `membresias.js` | Planes y medios de pago (datos fijos del negocio) |
| `vite.config.js` | Servidor de desarrollo y proxy de `/api` al back |
| `package.json` | Dependencias y comandos (`dev`, `build`, `preview`) |

## 2. Guion para la demo (unos 5 minutos)

Antes: MySQL y el back corriendo, `npm run dev`, y al menos un producto con stock, un socio activo y un empleado.

1. **Inicio:** el negocio, los planes y las próximas clases (vienen del back).
2. **Socios:** intentar dar de alta un socio vacío → errores junto a cada campo. Cargarlo bien → mensaje de éxito.
3. **Clases:** crear una clase con capacidad 1, inscribir al socio → "Sin cupo" y el botón Inscribir se deshabilita.
4. **Comprar:** elegir un producto, poner más cantidad que el stock → error. Comprar 1 "a la cuenta del socio" →
   comprobante. Ir a **Socios**: aparece la deuda. **Pagar deuda** → desaparece.
5. **Pie de página → Políticas:** el enlace externo se abre en otra pestaña.
6. **Responsive:** achicar la ventana: el menú se pliega y las tablas pasan a tarjetas.
7. **Errores:** frenar el back y recargar → "No se pudo conectar" y **Reintentar**.

## 3. Preguntas probables

### React (lo visto en clase)

| Pregunta | Respuesta | Dónde mostrarlo |
|---|---|---|
| ¿Qué es React? ¿Librería o framework? | Una **librería** de JavaScript para armar interfaces con componentes. Nosotros la llamamos y decidimos la estructura; un framework (como Angular) impone la suya | `main.jsx` |
| ¿Cómo arranca la app? | `index.html` → `main.jsx` → `App.jsx` → la página de la ruta | `index.html`, `main.jsx` |
| ¿Qué es JSX? | Sintaxis parecida a HTML dentro de JavaScript. Vite la transforma a JS común. Entre `{ }` va JavaScript | cualquier página |
| ¿Qué es el Virtual DOM? | Una copia en memoria del DOM. Cuando cambia el estado, React compara y modifica en el DOM real solo lo que cambió | — |
| ¿Declarativo o imperativo? | Declarativo: describimos cómo se ve la pantalla según el estado (`{paso === 2 && ...}`), no paso a paso cómo tocar el DOM | `Compra.jsx` |
| ¿Qué es un componente? ¿Por qué con mayúscula? | Una función que devuelve JSX. Va en PascalCase para que React no lo confunda con una etiqueta HTML | `Campo.jsx` |
| ¿Qué son las props? | Datos que el padre le pasa al hijo; el hijo no los puede modificar. `children` es lo que va entre las etiquetas | `Dialogo.jsx` recibe `titulo` y `children` |
| ¿Qué es `useState`? | Guarda un dato que cambia; al cambiarlo con su `set...`, React vuelve a dibujar el componente | `Compra.jsx`: `cantidad`, `socioId`, `pago` |
| ¿Qué es `useEffect`? | Ejecuta código después de dibujar, por ejemplo pedir datos al back al abrir la página | `useDatos.js` |
| ¿Qué es `useRef`? | Guarda un valor o un elemento sin volver a dibujar al cambiarlo | `Dialogo.jsx` (el `<dialog>`), `useMensaje.js` (evitar doble envío) |
| ¿Para qué `useCallback`? | Mantiene la misma función entre renders. Sin eso, el `useEffect` que depende de ella se repetiría sin fin | `useDatos.js` |
| ¿Para qué `useId`? | Genera un id único para conectar el título del modal con `aria-labelledby` | `Dialogo.jsx` |
| ¿Qué es un hook propio? | Una función `use...` que junta otros hooks para reutilizarlos. Evita repetir la carga de datos en cada página | `hooks/` |
| ¿Renderizado condicional? | Mostrar una cosa u otra según una condición, con `&&` o `? :` | `Estado.jsx`, `Compra.jsx` |
| ¿Para qué es `key` en las listas? | Para que React identifique cada elemento y actualice solo el que cambió. Usamos el id del back | cualquier `.map()` |
| ¿Campo controlado o no controlado? | Controlado: el valor vive en el estado (`value` + `onChange`), para la compra, donde el total se recalcula al escribir. No controlado (`defaultValue`): en las altas, los datos se leen recién al enviar | `Compra.jsx` y `Socios.jsx` |
| ¿Por qué `key={editando.id}` en el form de edición? | Para que al editar otro registro React cree un formulario nuevo con los valores correctos | `Socios.jsx` |
| ¿Qué es una SPA? ¿Cómo navega? | Una sola página HTML cuyo contenido cambia sin recargar. React Router muestra el componente de cada URL; `NavLink` marca la página actual | `App.jsx`, `Encabezado.jsx` |
| ¿Qué hace `StrictMode`? | Solo en desarrollo, ejecuta algunas cosas dos veces para detectar errores. No afecta a la versión final | `main.jsx` |
| ¿`package.json` y `package-lock.json`? | El primero lista las dependencias (`dependencies` para la app, `devDependencies` solo para desarrollar) y los comandos. El lock fija versiones exactas para que todo el equipo instale lo mismo | `package.json` |
| ¿Por qué no se sube `node_modules`? | Es pesado y se regenera con `npm install`. Está en `.gitignore` | `.gitignore` |
| ¿Qué es Vite? ¿Y HMR? | Herramienta que levanta el servidor de desarrollo y arma la versión final (`npm run build` → `dist/`). HMR actualiza la página al guardar sin recargarla | `vite.config.js` |
| ¿Por qué no Bootstrap? | CSS propio: más liviano, control total del diseño del Figma, del contraste y del modo oscuro | `estilo.css` |
| ¿Por qué React y no HTMX o Thymeleaf? | Nuestro back es una API REST que devuelve JSON. HTMX y Thymeleaf trabajan con HTML armado en el servidor; React consume el JSON y maneja el estado en el navegador. Además front y back quedan en repos separados | — |

### Conexión con el back

| Pregunta | Respuesta |
|---|---|
| ¿Dónde se llama al back? | Solo en `js/api.js`. Las páginas llaman a sus funciones (`obtener`, `enviar`) |
| ¿Cómo sabe qué método y URL usar? | Los declara el formulario: `method`, `action` y `data-metodo` para PUT y DELETE, porque HTML solo admite GET y POST |
| ¿Qué es `async/await`? | `fetch` devuelve una promesa; `await` espera la respuesta sin bloquear la página |
| ¿Qué es CORS y cómo lo resolvieron? | El navegador bloquea pedidos entre orígenes distintos (`:5173` y `:8080`). Usamos el proxy de Vite: para el navegador todo es el mismo origen. En producción se usaría una `CorsConfig` en Spring (como en TodoList) o se servirían los archivos de `dist/` desde Spring |
| ¿Y si el back está en otra máquina? | Se cambia `BACKEND_URL` en el `.env`, sin tocar código |
| ¿Qué formato usan? | JSON. Fechas `2026-11-20T18:00:00`, montos como número, enums en mayúsculas (ver FRONTEND.md, sección 4) |
| ¿Cómo manejan los errores? | El back responde con un `ProblemDetail`; `api.js` muestra su `detail` (404 si no existe, 409 si se rompe una regla). Si no hay conexión: "No se pudo conectar" con Reintentar. Si es un 500: un mensaje entendible |
| ¿El front funciona sin el back? | Navega y muestra las páginas, pero sin datos. La rúbrica permite datos simulados; elegimos conectarlo de verdad |

### Negocio y flujos

| Pregunta | Respuesta |
|---|---|
| ¿Cómo es el flujo de compra? | Producto → cantidad, socio y forma de pago → un `POST /api/ventas` → comprobante con la venta que devolvió el back (FRONTEND.md, sección 3) |
| ¿Por qué un producto por compra? | En el back cada `Venta` es de un producto. Con un carrito serían varios POST: si fallaba uno, los anteriores ya quedaban vendidos. Así la compra es atómica |
| ¿Cómo se genera y se paga una deuda? | Comprando "a la cuenta del socio" (`pagada: false`): el back suma el monto a la deuda. Se paga con "Pagar deuda" (`POST /api/pagos`, concepto `DEUDA`) |
| ¿Quién calcula los cupos? | El back, contando las inscripciones activas. El front solo los muestra y deshabilita "Inscribir" si no hay lugar; la regla la vuelve a controlar el back |
| ¿Por qué no se borran los socios? | Baja lógica: quedan con `activo = false` porque sus compras y pagos son registros contables. Se pueden reactivar |
| ¿Hay usuario cliente y usuario admin? | Hoy no hay login: un único usuario, el empleado del gimnasio, opera todo. Ver abajo cómo se agregaría |
| ¿De dónde salen los precios de los planes? | Son contenido fijo de la landing (`js/membresias.js`). El back no guarda precios de membresía |

### Login (no está hecho: respuesta preparada)

> "No lo implementamos en esta entrega, pero el modelo ya lo contempla. `Empleado` tiene usuario, contraseña y rol
> (`ADMIN` o `EMPLEADO`). Para agregarlo haría falta:
> 1. **En el back:** un endpoint `POST /api/auth/login` que valide usuario y contraseña, y que proteja los demás endpoints.
> 2. **En el front:** una pantalla de login que guarde quién inició sesión y muestre u oculte pantallas según el rol.
>    Por ejemplo, Empleados solo para `ADMIN`.
> 3. **Si alguien se olvida la contraseña:** el administrador se la restablece. El endpoint
>    `PUT /api/empleados/{id}/password` ya existe.
> 4. **Otro tipo de usuario, como el socio:** se agrega como un rol nuevo, con sus propias pantallas, por ejemplo para
>    anotarse a clases.
>
> Además habría que guardar las contraseñas cifradas (con BCrypt): hoy el back las guarda en texto plano."

### Validaciones y "romperlo"

| Pregunta | Respuesta |
|---|---|
| ¿Dónde se valida? | Con atributos HTML (`required`, `pattern`, `min`, `max`, `maxLength`) en cada `<Campo>`. `validarFormulario()` los revisa antes de enviar |
| ¿Por qué `noValidate`? | Para no mostrar el globo del navegador y poner el mensaje debajo del campo, donde el lector de pantalla lo anuncia |
| ¿Qué pasa si pongo el año 9999 o un precio enorme? | Hay topes: clases dentro de los próximos 2 años, precio hasta $10.000.000, stock hasta 100.000 (FRONTEND.md, sección 5) |
| ¿Y si hago doble clic en Guardar? | `useMensaje` marca la acción como en curso (con `useRef`) y descarta el segundo clic. En la compra, el botón se deshabilita |
| ¿Y si pongo `<script>` en un nombre? | Se muestra como texto: React escapa todo lo que dibuja y no usamos `innerHTML` |
| ¿Alcanza con validar en el front? | No. Se saltea llamando a la API con Postman. El back tiene que validar todo de nuevo |

### Accesibilidad, diseño y responsive

| Pregunta | Respuesta |
|---|---|
| ¿Qué hicieron de accesibilidad? | HTML semántico (`header`, `nav`, `main`, `footer`), un `h1` por página, `label` en cada campo, errores con `aria-describedby` y `aria-invalid`, mensajes con `aria-live`, "Saltar al contenido", foco visible, `<dialog>` nativo y contraste verificado (WCAG AA) |
| ¿Para qué el texto oculto en los botones? | "Editar" se repite en cada fila; con la clase `solo-lectores` el lector anuncia "Editar Juan Perez" |
| ¿Cómo hicieron el modo oscuro? | Con variables CSS: en `@media (prefers-color-scheme: dark)` se redefinen los colores, así nunca queda texto blanco sobre fondo blanco |
| ¿Cómo es el responsive? | Mobile first. A partir de 761 px se amplía. En celular el menú se pliega (`aria-expanded`) y las tablas pasan a tarjetas: cada celda muestra el nombre de su columna con `data-label` |
| ¿Qué es `auto-fill` con `minmax`? | Una grilla que acomoda solas las columnas según el ancho, sin escribir una media query por tamaño |
| ¿Por qué los enlaces externos llevan `rel="noopener noreferrer"`? | Para que la página abierta en la otra pestaña no pueda controlar la nuestra (tabnabbing) |

## 4. Limitaciones (si las preguntan, decirlas con la solución)

| Limitación | Cómo se resolvería |
|---|---|
| No hay login ni roles | Ver la respuesta preparada de arriba |
| El back acepta productos con nombre vacío o precio negativo | Validaciones con `@Valid` y anotaciones (`@NotBlank`, `@Positive`) en el back |
| Editar con un email repetido da error 500 | Controlar el email repetido en el service y responder 409 |
| Las contraseñas se guardan sin cifrar | BCrypt |
| La forma de pago se muestra en el comprobante, pero el back solo guarda si quedó pagada | Agregar el campo a `Venta` |
| Una compra es de un solo producto | Una entidad de detalle de venta, para que un POST registre varios productos en una transacción |
| No hay paginación en las listas | Agregarla en el back (`Pageable`) y en las tablas |
| El Figma muestra pantallas que sacamos (ingresos, historial, carrito) | Se simplificó el alcance después de la revisión del profe |

## 5. Si piden un cambio en vivo

| Cambio | Qué tocar |
|---|---|
| Cambiar el color principal | `--principal` en `estilo.css` |
| Agregar una página | Crear el componente en `paginas/`, agregar la `<Route>` en `App.jsx` y el enlace en `Encabezado.jsx` |
| Agregar un campo al socio | Un `<Campo name="...">` en `CamposSocio.jsx` (el back tiene que tener ese atributo) y la columna en `Socios.jsx` |
| Cambiar un mensaje de error | El `data-mensaje-error` del campo |
| Cambiar un tope (por ejemplo el precio máximo) | `PRECIO_MAXIMO` en `js/validaciones.js` |
| Apuntar a otro back | `BACKEND_URL` en `.env` |
