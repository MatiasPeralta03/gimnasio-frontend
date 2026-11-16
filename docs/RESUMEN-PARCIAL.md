# Resumen para el 2° Parcial — Aplicaciones Interactivas (Frontend)

> **Parcial: clase 16 — jueves 19/11.** Solo frontend.
> Armado a partir de: *Cronograma Actualizado*, *Diseño web repaso integral* (HTML/CSS/JS),
> *React HTML y HTMX* (Thymeleaf, HTMX, React), *Frontend con React* (TodoList), *Preparación React*
> y la *Rúbrica de evaluación del Frontend*. Los ejemplos "en nuestro proyecto" apuntan a este repo.
>
> Complementa [DEFENSA.md](DEFENSA.md) (preguntas de la defensa del TPO) y [FRONTEND.md](FRONTEND.md).

---

## ÍNDICE

1. [Chuleta — lo mínimo que hay que saber](#1-chuleta--lo-mínimo-que-hay-que-saber)
2. [Qué entra (según el cronograma)](#2-qué-entra-según-el-cronograma)
3. [Clientes web y su evolución](#3-clientes-web-y-su-evolución)
4. [HTML5](#4-html5)
5. [CSS3](#5-css3)
6. [JavaScript en el navegador](#6-javascript-en-el-navegador)
7. [Accesibilidad y semántica](#7-accesibilidad-y-semántica)
8. [Thymeleaf (SSR)](#8-thymeleaf-ssr)
9. [HTMX](#9-htmx)
10. [React: conceptos](#10-react-conceptos)
11. [React: hooks](#11-react-hooks)
12. [React: props, eventos y formularios](#12-react-props-eventos-y-formularios)
13. [React Router y SPA](#13-react-router-y-spa)
14. [Conexión con el back: fetch, async/await y CORS](#14-conexión-con-el-back-fetch-asyncawait-y-cors)
15. [Modularizar componentes](#15-modularizar-componentes)
16. [Comparativa Thymeleaf vs HTMX vs React](#16-comparativa-thymeleaf-vs-htmx-vs-react)
17. [Rúbrica del frontend](#17-rúbrica-del-frontend)
18. [Banco de preguntas](#18-banco-de-preguntas)
19. [Ejercicios con código](#19-ejercicios-con-código)
20. [Errores típicos y trampas](#20-errores-típicos-y-trampas)
21. [Glosario relámpago](#21-glosario-relámpago)

---

## 1. Chuleta — lo mínimo que hay que saber

### Las siglas

| Sigla | Significado | Qué es |
|---|---|---|
| **HTML** | HyperText Markup Language | Estructura y contenido de la página (no su apariencia) |
| **CSS** | Cascading Style Sheets | Presentación visual, separada del HTML |
| **DOM** | Document Object Model | Árbol de nodos que arma el navegador con el HTML |
| **JSX** | JavaScript XML | HTML dentro de JS (`js + xml`). Vite/Babel lo transforma a JS |
| **SPA** | Single Page Application | Una sola página HTML cuyo contenido cambia sin recargar |
| **SSR** | Server-Side Rendering | El servidor arma el HTML (Thymeleaf) |
| **CSR** | Client-Side Rendering | El navegador arma el HTML con JS (React) |
| **HMR** | Hot Module Replacement | Vite actualiza el módulo sin recargar ni perder el estado |
| **VDOM** | Virtual DOM | Copia del DOM en memoria; React compara y toca solo lo que cambió |
| **HATEOAS** | Hypermedia As The Engine Of Application State | El estado y las acciones posibles viajan en el HTML (idea de HTMX) |
| **CORS** | Cross-Origin Resource Sharing | Seguridad del navegador entre orígenes distintos |
| **XSS** | Cross-Site Scripting | Inyectar un `<script>` en la página; se evita escapando el texto |
| **ARIA** | Accessible Rich Internet Applications | Atributos `aria-*` que refuerzan la accesibilidad |
| **npm** | Node Package Manager | Gestor de paquetes de JavaScript |

### La arquitectura de nuestro front

```
index.html  →  main.jsx  →  App.jsx  →  páginas (Router)  →  componentes
(<div id="root">)  (createRoot + BrowserRouter)  (rutas)     (Campo, Tabla...)
                                                    │
                                          hooks (useDatos) → js/api.js → fetch → Spring :8080
```

### Cuatro cadenas para recordar

```
Tecnología:   HTML (estructura)   CSS (presentación)   JS (comportamiento)
React:        Componente (función → JSX)   Props (padre→hijo, solo lectura)   Estado (useState, privado)
Datos:        Props bajan  ↓                Callbacks suben  ↑   (flujo unidireccional)
Hooks:        useState (estado)  useEffect (efectos)  useRef (referencia)  useContext (global)
```

### Valores por defecto de HTMX (clásico de parcial)

| Elemento | Dispara por defecto con |
|---|---|
| `<input>`, `<textarea>`, `<select>` | `change` |
| `<form>` | `submit` |
| cualquier otro (`button`, `div`, `tr`) | `click` |

---

## 2. Qué entra (según el cronograma)

El parcial es la **clase 16**. Entra lo dado desde la clase 9 (y el repaso previo de HTML/CSS/JS):

| Clase | Fecha | Tema |
|---|---|---|
| 9 | 1/10 | **Guía sobre diseño al crear interfaces web**, tecnologías asociadas. **Estructura de software en relación al front end** |
| 10 | 8/10 | **Clientes web. Evolución. Distintos tipos. Herramientas** |
| 11 | 15/10 | **Introducción a React.** Componentes funcionales y no funcionales. **Estado y ciclo de vida** |
| 12 | 22/10 | **Renderizando.** Manejo de estado en componentes funcionales. **Hooks. Formularios. Renderizados condicionales** |
| 13 | 29/10 | **React Navigation** (Router) |
| 14 | 5/11 | **Modularizar componentes. Ventajas** |
| 15 | 12/11 | Entrega completa del proyecto |

> Después: 26/11 devoluciones y defensa, 3/12 recuperatorio, 17/12 final.
> "Componentes funcionales y no funcionales" = **funcionales** (funciones con hooks, lo moderno) vs
> **de clase** (`extends React.Component`, lo legado). Ver [§10](#10-react-conceptos).

---

## 3. Clientes web y su evolución

**Cliente web** = el software del lado del usuario que pide recursos por HTTP y los muestra. Hoy es el **navegador**.

### Evolución

| Época | Etapa | Cómo funcionaba |
|---|---|---|
| Años 90 – 2005 | **Web clásica (SSR puro)** | CGI, JSP, PHP. Cada acción recargaba la página completa |
| 2005 – 2012 | **AJAX** | `XMLHttpRequest` + jQuery. Se actualizan partes de la página, pero con JS disperso |
| 2013 – 2020 | **Era de las SPAs** | React, Angular, Vue. El navegador arma todo el HTML y maneja el estado |
| Actualidad | **Renacimiento hipermedia** | HTMX + SSR moderno (Thymeleaf): el servidor vuelve a mandar HTML parcial |

### Dos modelos mentales

| | **Server-driven** (Thymeleaf + HTMX) | **Client-side** (React SPA) |
|---|---|---|
| Quién arma el HTML | El servidor | El navegador (JS) |
| Dónde vive el estado | BD / sesión del servidor | Memoria del navegador (`useState`, Context, Redux) |
| Qué viaja | Fragmentos HTML | JSON |
| Ideal para | Sistemas de gestión, intranets, CRUDs | Apps muy interactivas (Figma, Canva, dashboards) |

### Herramientas del cliente web

| Herramienta | Para qué |
|---|---|
| **DevTools (F12)** | *Elements* (DOM y CSS en vivo), *Console* (errores JS), *Network* (pedidos, 404 y CORS) |
| **Validador W3C** (validator.w3.org) | Verifica que el HTML cumpla el estándar |
| **Node.js** | Ejecuta JS fuera del navegador; lo usamos para correr Vite e instalar paquetes |
| **npm** | Instala dependencias (`npm install`) |
| **Vite** | Servidor de desarrollo + empaquetado. Reemplaza a Create React App |
| **Postman / curl** | Probar el back **sin** navegador (no aplican CORS) |

---

## 4. HTML5

HTML define la **estructura y el contenido**, no la apariencia. El navegador lo convierte en el **DOM**.

### Estructura base

```html
<!DOCTYPE html>                       <!-- avisa que es HTML5 -->
<html lang="es">                      <!-- raíz + idioma -->
<head>
  <meta charset="UTF-8">              <!-- acentos y ñ -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- responsive en celular -->
  <meta name="description" content="Gimnasio de barrio">                <!-- SEO -->
  <title>Gimnasio — Inicio</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/app.js" defer></script>
</head>
<body> ... </body>
</html>
```

### `defer` vs `async`

| Atributo | Descarga | Ejecuta |
|---|---|---|
| (ninguno) | Bloquea el render | Inmediatamente |
| `async` | En paralelo | Apenas termina de bajar (orden impredecible) |
| **`defer`** | En paralelo | **Después de parsear el DOM** (recomendado) |

> `defer` evita el clásico `TypeError: cannot read property of null` al buscar elementos que todavía no existen.

### Semántica: las etiquetas del layout

| Etiqueta | Rol |
|---|---|
| `<header>` | Encabezado del sitio o de una sección |
| `<nav>` | Navegación principal (con `<ul><li><a>`) |
| `<main>` | Contenido central, **uno por página** |
| `<section>` | Agrupación temática |
| `<article>` | Unidad independiente (una card, un post) |
| `<aside>` | Contenido secundario / lateral |
| `<footer>` | Pie de página |

Por qué usarla: **accesibilidad** (los lectores de pantalla navegan por *landmarks*), **SEO**, **mantenibilidad** y **menos CSS** (no hace falta `.header`, `.footer`).

### Texto y jerarquía

- **Un solo `<h1>`** por página; `<h2>`–`<h6>` en orden, **sin saltar niveles**.
- `<strong>` = importancia (no solo negrita). `<em>` = énfasis (no solo cursiva).
- Listas: `<ul>` (sin orden, base de los menús), `<ol>` (ordenada), `<dl>` (definiciones).

### Enlaces

```html
<a href="productos.html">Interno</a>
<a href="https://spring.io" target="_blank" rel="noopener noreferrer">Externo</a>
<a href="#contacto">Ancla en la misma página</a>
<a href="contacto.html#formulario">Ancla en otra página</a>
<a href="mailto:info@gym.com">Mail</a>
<a href="manual.pdf" download>Descarga</a>
```

> `rel="noopener"` es **obligatorio** con `_blank`: evita *tabnabbing* (la pestaña abierta controlando la tuya).

### Rutas relativas

| Símbolo | Significa |
|---|---|
| `./` | Carpeta actual |
| `../` | Subir un nivel |
| `/` | Raíz del sitio |

Desde `producto/detalle.html`: a `index.html` → `../index.html`; a `css/styles.css` → `../css/styles.css`.
Usar **minúsculas y sin espacios**: Linux distingue mayúsculas y rompe en el deploy.

### Multimedia

```html
<img src="img/remera.jpg" alt="Remera azul talle M" width="300">   <!-- alt OBLIGATORIO -->
<figure>
  <img src="img/zapatillas.jpg" alt="Zapatillas running">
  <figcaption>Zapatillas running — $25.000</figcaption>
</figure>
<video controls width="480"><source src="v.mp4" type="video/mp4"></video>
```

`alt`: lo leen los lectores de pantalla y aparece si la imagen no carga. Si la imagen es decorativa, `alt=""`.

### Tablas (solo para datos, **nunca para maquetar**)

```html
<table>
  <caption>Catálogo de productos</caption>
  <thead><tr><th scope="col">Producto</th><th scope="col">Precio</th></tr></thead>
  <tbody><tr><td>Remera</td><td>$5.000</td></tr></tbody>
</table>
```

`<caption>` = título; `scope="col"` = a qué columna pertenece el encabezado (lector de pantalla).

### Formularios

```html
<form action="/api/contacto" method="post">
  <fieldset>
    <legend>Datos de contacto</legend>
    <label for="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" required minlength="3" maxlength="20">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <button type="submit">Enviar</button>
  </fieldset>
</form>
```

| Atributo | Para qué |
|---|---|
| `action` | URL a donde se envía |
| `method` | `get` o `post` (HTML **solo** admite estos dos) |
| `name` | Clave con la que el back recibe el valor |
| `id` | Único; lo usa `<label for>` y el JS |
| `fieldset` / `legend` | Agrupan campos relacionados |

**Tipos de `<input>`:** `text`, `search`, `email`, `password`, `number`, `date`, `checkbox` (múltiple), `radio` (única), `file`, `hidden`.

### Validación nativa HTML5

| Atributo | Efecto |
|---|---|
| `required` | Obligatorio |
| `minlength` / `maxlength` | Largo del texto |
| `min` / `max` / `step` | Rango y paso de números |
| `pattern="[0-9]{4}"` | Expresión regular |
| `placeholder` | Ayuda (**no reemplaza** al `<label>`) |

> ⚠️ **La validación del cliente se saltea** (editando el DOM o llamando a la API con Postman). **Siempre se revalida en el back.**

### Atributos globales

`id` (único por página), `class` (reutilizable), `data-*` (datos para JS, ej. `data-id="42"`), `title` (tooltip), `hidden`, `aria-*`.

### Tres formas de conectar CSS

| Forma | Ejemplo | Uso |
|---|---|---|
| Inline | `<p style="color:red">` | ❌ Evitar |
| Interna | `<style>` en el `<head>` | Solo una página |
| **Externa** | `<link rel="stylesheet" href="css/styles.css">` | ✅ Recomendada, compartida entre páginas |

---

## 5. CSS3

### Cascada y especificidad

Ante reglas en conflicto, gana la de **mayor especificidad**; si empatan, la **última** leída.

| Selector | Peso |
|---|---|
| Inline `style="..."` | 1000 |
| `#id` | 100 |
| `.clase`, `:hover`, `[atributo]` | 10 |
| `etiqueta` (`p`, `h1`) | 1 |

### Selectores

```css
p { color: #333; }                 /* etiqueta */
.card { border: 1px solid #ddd; }  /* clase */
#carrito { background: #f9f9f9; }  /* id */
.card h2 { font-size: 1.2rem; }    /* descendiente (cualquier nivel) */
nav > ul { display: flex; }        /* hijo directo */
a:hover { text-decoration: underline; }  /* pseudo-clase */
```

### Box model

```
margin  →  border  →  padding  →  content
(afuera)                          (adentro)
```

```css
* { box-sizing: border-box; }  /* el width incluye padding y border */
```

### Flexbox (1 dimensión)

```css
nav ul {
  display: flex;
  gap: 1rem;                       /* separación sin márgenes */
  justify-content: space-between;  /* eje PRINCIPAL (horizontal) */
  align-items: center;             /* eje CRUZADO (vertical) */
  flex-wrap: wrap;                 /* baja de línea si no entra */
  list-style: none;
}
```

### Grid (2 dimensiones)

```css
.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
```

`auto-fill` calcula **solo** cuántas columnas entran; `minmax(220px, 1fr)` = mínimo 220 px y se estira. Evita escribir decenas de media queries.

| Flexbox | Grid |
|---|---|
| 1 dimensión (fila **o** columna) | 2 dimensiones (filas **y** columnas) |
| Menús, alineaciones | Catálogos, layouts de página |

### Variables CSS y responsive

```css
:root {
  --colorPrimario: #003366;
  --espacio: 1rem;
}
.btn { background: var(--colorPrimario); padding: var(--espacio); }

@media (max-width: 768px) {
  nav ul { flex-direction: column; }
  .catalogo { grid-template-columns: 1fr; }
}
```

- **Mobile first**: se diseña para celular y se amplía con `min-width`.
- **Modo oscuro** con variables: `@media (prefers-color-scheme: dark)` redefine los colores y nunca queda texto blanco sobre fondo blanco.
- Unidades: `rem` (relativa a la fuente raíz), `%`, `fr` (fracción en Grid), `px` (fija).

> **En nuestro proyecto:** variables, modo oscuro, responsive y tablas que pasan a tarjetas en celular → `src/estilo.css`.

---

## 6. JavaScript en el navegador

Lenguaje interpretado del lado del cliente. Tres pilares: **manipular el DOM**, **manejar eventos**, **consumir servicios asincrónicos (fetch)**.

### Variables y funciones (ES6+)

```js
const IVA = 0.21;   // no se reasigna
let total = 0;      // se reasigna

function calcularTotal(precio, cantidad) {          // función tradicional
  return precio * cantidad * (1 + IVA);
}
const calcularTotalFlecha = (precio, cantidad) => precio * cantidad * (1 + IVA);  // arrow function
```

### DOM

```js
const titulo = document.querySelector("h1");           // el primero
titulo.textContent = "Catálogo actualizado";

document.querySelectorAll(".btnAgregar")               // todos
  .forEach(btn => btn.classList.add("activo"));
```

### Eventos

```js
const form = document.querySelector("#formContacto");
form.addEventListener("submit", (e) => {
  e.preventDefault();          // evita que el form recargue la página
  console.log("Enviando por fetch...");
});
```

### Renderizado dinámico (JS puro)

```js
const productos = [{ id: 1, nombre: "Remera", precio: 5000 }];

document.querySelector("#listaProductos").innerHTML = productos
  .map(p => `<article class="card" data-id="${p.id}"><h3>${p.nombre}</h3><p>$${p.precio}</p></article>`)
  .join("");
```

> ⚠️ `innerHTML` con datos del usuario abre la puerta al **XSS**. React escapa todo por defecto; por eso no usamos `innerHTML`.

### Fetch + async/await

```js
async function cargarProductos() {
  try {
    const res = await fetch("/api/productos");
    if (!res.ok) throw new Error("Error HTTP " + res.status);   // fetch NO tira error en un 404/500
    const datos = await res.json();
    renderProductos(datos);
  } catch (err) {
    console.error("Fallo al conectar:", err);
  }
}
```

### Estructura de proyecto estático recomendada

```
miTienda/
├── index.html · productos.html · contacto.html
├── css/styles.css      ← hoja compartida
├── js/app.js           ← lógica + fetch (con defer)
└── img/logo.png
```

---

## 7. Accesibilidad y semántica

Vale **15 puntos** en la rúbrica (criterio 3). Checklist:

| Qué | Cómo |
|---|---|
| Landmarks | `header`, `nav`, `main`, `footer` |
| Encabezados | Un `h1`, sin saltar niveles |
| Imágenes | `alt` descriptivo (o `alt=""` si es decorativa) |
| Formularios | `<label for>` en cada campo; errores asociados con `aria-describedby` y `aria-invalid` |
| Mensajes dinámicos | `role="alert"` / `aria-live` para que el lector los anuncie |
| Teclado | Todo se alcanza con Tab; **foco visible**; enlace "Saltar al contenido" |
| Contraste | WCAG AA (4.5:1 en texto normal) |
| Botones repetidos | Texto oculto (`solo-lectores`): "Editar *Juan Pérez*" en vez de solo "Editar" |
| Modales | `<dialog>` nativo |
| Menú plegable | `aria-expanded` |
| Enlaces externos | `rel="noopener noreferrer"` |

> **En nuestro proyecto:** `Campo.jsx` (label + error + aria), `Dialogo.jsx` (`<dialog>`), `App.jsx` ("Saltar al contenido" y foco al cambiar de ruta).

---

## 8. Thymeleaf (SSR)

**Motor de plantillas del lado del servidor** (corre en la JVM, no en el navegador). Combina una plantilla HTML con datos del backend y entrega HTML ya armado. Es el recomendado por Spring Boot; reemplaza a JSP.

**No es** un framework cliente: no maneja el DOM ni eventos, y no necesita Node ni Vite.

### Plantillas naturales

Los `.html` son HTML5 válido: abiertos con doble clic en el navegador se ven con el texto de prototipo (los `th:*` se ignoran); con Spring, Thymeleaf reemplaza ese texto con los datos reales.

```html
<h2 th:text="${producto.nombre}">Teclado Mecánico (texto prototipo)</h2>
```

### Ciclo en Spring MVC (5 pasos)

1. El cliente hace `GET /productos` → entra al `DispatcherServlet`.
2. El `@Controller` (`@GetMapping`) llama al service.
3. Carga datos en el `Model`: `model.addAttribute("productos", lista)`.
4. Devuelve el **nombre de la vista** (`"productos/lista"`); Thymeleaf busca `templates/productos/lista.html`.
5. Fusiona plantilla + modelo y manda el **HTML** en la respuesta.

### Las 5 expresiones

| Sintaxis | Nombre | Para qué | Ejemplo |
|---|---|---|---|
| `${...}` | Variable | Atributos del `Model` | `${usuario.nombre}` |
| `*{...}` | Selección | Sobre el `th:object` activo | `th:field="*{email}"` |
| `#{...}` | Mensaje (i18n) | `messages.properties` | `#{bienvenida.titulo}` |
| `@{...}` | URL / enlace | Rutas con contexto y parámetros | `@{/productos/{id}(id=${p.id})}` |
| `~{...}` | Fragmento | Incluir bloques de otra plantilla | `~{fragmentos/nav :: navbar}` |

### Directivas

| Directiva | Qué hace |
|---|---|
| `th:text` | Muestra texto **escapado** (seguro contra XSS) |
| `th:utext` | Muestra HTML **sin escapar** ⚠️ nunca con datos del usuario |
| `th:each="p, stat : ${lista}"` | Itera; `stat` trae `index` (desde 0), `count` (desde 1), `size`, `odd`/`even` |
| `th:if` / `th:unless` | Renderiza si / si **no** se cumple la condición (si no, el elemento ni sale en el HTML) |
| `th:switch` / `th:case` | Varias ramas |
| `th:object` + `th:field` | Vincula un form a un objeto Java; `th:field` genera `id`, `name` y `value` y repuebla si hay error de validación |
| `th:action` | URL del form (incluye el token CSRF si hay Spring Security) |
| `th:fragment` | Define un bloque reutilizable |
| `th:replace` / `th:insert` | Reemplaza la etiqueta / inserta **dentro** de ella |

### Estructura de carpetas en Spring Boot

| Carpeta | Contenido | ¿Accesible por URL? |
|---|---|---|
| `src/main/resources/templates/` | Vistas Thymeleaf | ❌ Solo vía controlador |
| `templates/fragmentos/` | Header, footer, tablas parciales | ❌ |
| `src/main/resources/static/` | CSS, JS, imágenes, `htmx.min.js` | ✅ Directo |

Por convención: prefijo `classpath:/templates/`, sufijo `.html`, UTF-8. Dependencia: `spring-boot-starter-thymeleaf`.
`spring.thymeleaf.cache=false` en desarrollo (ves los cambios sin reiniciar); `true` en producción.

### Reglas de buena práctica

Texto de prototipo representativo · `th:text` siempre · validar en el servidor (Bean Validation) · fragmentar tablas/listas/modales · **la lógica va en el Service/Controller**, la plantilla solo presenta.

---

## 9. HTMX

Librería de **~14 kB** que extiende el HTML: cualquier elemento puede disparar una petición AJAX y actualizar **una parte** de la página, **sin escribir JS**. Se lee "hache-te-eme-equis". Lema: *"High power tools for HTML"*.

Idea central: el servidor responde **HTML (fragmentos)**, no JSON (**HATEOAS**: el estado y las acciones posibles viajan en el HTML; si no podés borrar algo, el servidor simplemente no manda el botón).

### Ciclo de vida

1. **Inclusión:** `<script src="htmx.min.js">` en el `<head>`.
2. **Atributos `hx-*`** en los elementos.
3. **Disparo AJAX** cuando ocurre el evento.
4. **Swap:** el fragmento recibido se inserta en el destino.

### Los 5 verbos

| Atributo | Verbo | Uso |
|---|---|---|
| `hx-get` | GET | Traer datos / fragmentos |
| `hx-post` | POST | Crear |
| `hx-put` | PUT | Reemplazar / actualizar |
| `hx-patch` | PATCH | Modificación parcial |
| `hx-delete` | DELETE | Eliminar |

(Resuelve que HTML solo permite GET y POST, y solo desde `<a>` y `<form>`.)

### `hx-trigger` — cuándo

| Valor | Efecto |
|---|---|
| `click`, `submit`, `change`, `mouseenter`, `keyup` | Evento nativo |
| `load` | Al cargarse el elemento (carga diferida) |
| `changed` | Solo si el valor realmente cambió |
| `delay:500ms` | **Debounce**: espera 500 ms sin actividad y recién ahí envía |
| `throttle:1s` | Máximo una petición por segundo |
| `from:#otro` | Escucha eventos de otro nodo |
| `every 2s` | **Polling** cada 2 segundos |

Búsqueda en vivo: `hx-trigger="keyup changed delay:500ms"` → si escribís "Teclado" rápido, en vez de 7 pedidos se hace **1**.

### `hx-target` — dónde

Sin `hx-target`, la respuesta reemplaza al **propio elemento** que disparó.

| Valor | Apunta a |
|---|---|
| `#id`, `.clase` | Selector CSS |
| `this` | El mismo elemento |
| `closest tr` | El ancestro `<tr>` más cercano (borrar una fila) |
| `find <sel>` | Primer descendiente que coincida |
| `next <sel>` / `previous <sel>` | Hermano siguiente / anterior |

### `hx-swap` — cómo se inserta

| Modo | Efecto | Caso típico |
|---|---|---|
| `innerHTML` (default) | Reemplaza el **contenido** del target | Refrescar una tabla |
| `outerHTML` | Reemplaza el target **completo** | Borrar / reemplazar una fila |
| `beforeend` | Agrega **al final** de los hijos | Sumar una fila nueva |
| `afterbegin` | Agrega **al principio** | Feed de novedades |
| `beforebegin` | Justo **antes** del target | Separadores |
| `delete` | Elimina el target | Borrado sin devolver HTML |

### Otros atributos

| Atributo | Qué hace |
|---|---|
| `hx-select="#tabla"` | Extrae solo ese fragmento de una respuesta que es una página completa |
| `hx-include` | Suma los valores de otros inputs al pedido |
| `hx-vals` | Agrega valores JSON (`js:{...}` para evaluar JS) |
| `hx-headers` | Cabeceras HTTP (ej. token CSRF) |
| `hx-confirm="¿Seguro?"` | `confirm` nativo; si cancelás **no viaja nada** |
| `hx-indicator="#spinner"` | Agrega la clase `htmx-request` mientras carga (spinner solo con CSS) |
| `hx-push-url="true"` | Actualiza la URL con la History API → funciona el botón Atrás y se pueden compartir links |
| `hx-swap-oob="true"` | *Out-of-band swap*: actualiza **otro** elemento de la página (ej. un contador) con la misma respuesta |
| `hx-on::after-request="this.reset()"` | Ejecuta JS tras el pedido (limpia el form) |

### Los 4 patrones del laboratorio

```html
<!-- 1. Carga por botón -->
<button hx-get="/api/productos" hx-target="#listaProductos" hx-swap="innerHTML">Cargar</button>

<!-- 2. Alta con formulario -->
<form hx-post="/api/productos" hx-target="#cuerpoTabla" hx-swap="beforeend"
      hx-on::after-request="this.reset()">
  <input name="nombre" required> <input name="precio" type="number" step="0.01" required>
  <button type="submit">Agregar</button>
</form>

<!-- 3. Borrado con confirmación -->
<button hx-delete="/api/productos/101" hx-target="closest tr" hx-swap="outerHTML"
        hx-confirm="¿Eliminar?">Eliminar</button>

<!-- 4. Búsqueda en vivo (debounce) -->
<input name="q" hx-get="/api/productos/buscar" hx-trigger="keyup changed delay:500ms"
       hx-target="#resultados" hx-indicator="#spinner">
```

### Cómo responde Spring (controlador híbrido)

```java
@Controller
@RequestMapping("/api/productos")
public class ProductoController {
    @GetMapping
    public String listar(Model model) {
        model.addAttribute("productos", service.listarTodos());
        return "fragmentos/listaProductos :: lista";   // 'plantilla :: fragmento' = renderiza SOLO ese bloque
    }
}
```

`"plantilla :: fragmento"` es el puente Thymeleaf ↔ HTMX: el backend devuelve **solo el fragmento**, no la página entera.

---

## 10. React: conceptos

**React** = biblioteca de JavaScript (Meta, open source desde 2013) para construir **interfaces** con componentes. Se enfoca **solo en la vista**. Es **librería** (nosotros la llamamos y decidimos la estructura); **Angular** (Google) es **framework** (impone una metodología).

### Por qué React (problemas del desarrollo tradicional)

| Problema con HTML/CSS/JS puro | Cómo lo resuelve React |
|---|---|
| Mantenimiento complejo al crecer | **Componentización** |
| Estado manual: hay que sincronizar los datos con el DOM a mano | **Estado reactivo**: cambia el dato y la UI se actualiza sola |
| Actualizar el DOM es costoso | **Virtual DOM** |
| Código no reutilizable | Componentes reutilizables |

### Los 4 pilares

| Pilar | Qué es |
|---|---|
| **Componente** | Función que devuelve un pedazo de interfaz (JSX). Unidad reutilizable |
| **JSX** | HTML dentro de JS; entre `{ }` va JavaScript. Se transpila a `React.createElement` |
| **Props** | Datos que el **padre** le pasa al **hijo**. **Solo lectura** |
| **Estado** | Datos **privados** del componente que cambian; al cambiar, se vuelve a dibujar |

> Filosofía: **Vista = f(Estado)**. React es **declarativo** (describís *qué* se ve) vs imperativo (*cómo* tocar el DOM paso a paso).

### Virtual DOM y reconciliación

1. Cambia el estado (`setX`).
2. React vuelve a ejecutar el componente → nuevo árbol de VDOM en memoria.
3. **Diffing**: compara el VDOM nuevo con el anterior.
4. Aplica en el DOM real **solo el cambio mínimo**.

### Componentes funcionales vs de clase

| | **De clase** (legado, < 16.8) | **Funcional** (moderno, desde 16.8) |
|---|---|---|
| Sintaxis | `class X extends React.Component` + `render()` | Función que recibe props y devuelve JSX |
| Estado | `this.state` + `this.setState()` (constructor) | `useState` |
| Ciclo de vida | `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` | `useEffect` |
| `this` / `bind` | Sí, un dolor | No existe |
| Hoy | Obsoleto | **Estándar** |

```jsx
// De clase (legado)
class Contador extends Component {
  constructor(props) { super(props); this.state = { count: 0 }; this.incrementar = this.incrementar.bind(this); }
  incrementar() { this.setState({ count: this.state.count + 1 }); }
  render() { return <button onClick={this.incrementar}>{this.state.count}</button>; }
}

// Funcional (moderno)
function Contador() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Ciclo de vida: clase → hooks

| Clase | Funcional |
|---|---|
| `constructor` | `useState(valorInicial)` |
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [dep])` |
| `componentWillUnmount` | `return () => {...}` dentro del `useEffect` (limpieza) |

### Arranque de un proyecto

```bash
npm create vite@latest nombreProyecto -- --template react
npm install        # lee package.json → descarga de npm → crea node_modules → fija versiones en package-lock.json
npm run dev        # http://localhost:5173
```

Ruta de ejecución: **`index.html` → `main.jsx` → `App.jsx`**.

```jsx
// main.jsx
createRoot(document.getElementById("root")).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
);
```

| Archivo / carpeta | Qué es |
|---|---|
| `index.html` | Única página; tiene `<div id="root">` |
| `src/` | Código fuente |
| `package.json` | Dependencias (`dependencies`: producción; `devDependencies`: solo desarrollo, ej. vite, eslint) y scripts |
| `package-lock.json` | Versiones exactas para que todo el equipo instale lo mismo |
| `node_modules/` | Paquetes instalados; **no se sube a git** (se regenera con `npm install`) |
| **ESLint** | "Corrector ortográfico" del código: detecta errores y malas prácticas |
| **HMR** | Cambios al instante sin recargar y **sin perder el estado** |

### Nomenclatura

| Estilo | Se usa en | Ejemplo |
|---|---|---|
| **PascalCase** | Componentes React (para que no se confundan con etiquetas HTML) | `UserDetail`, `TareaItem` |
| **camelCase** | Funciones y variables JS/Java | `getUserByName()` |
| **snake_case** | Bases de datos | `user_id` |
| **kebab-case** | Clases CSS y URLs | `main-container` |

---

## 11. React: hooks

Funciones especiales (desde React 16.8, 2018) que dejan a un componente funcional "engancharse" al estado y al ciclo de vida. Empiezan con `use`.

### Las 2 reglas de oro

| Regla | Detalle | Por qué |
|---|---|---|
| **1. Solo en el nivel superior** | Nunca dentro de `if`, bucles, funciones anidadas ni `try/catch` | React identifica cada hook por el **orden** de las llamadas; si el orden cambia entre renders, se rompe |
| **2. Solo desde funciones de React** | Componentes funcionales o *custom hooks* (`useXxx`). No en handlers (`onClick`), callbacks ni funciones JS comunes | Los hooks necesitan el contexto del render |

El plugin `eslint-plugin-react-hooks` las verifica.

### Catálogo

| Hook | Para qué | En nuestro proyecto |
|---|---|---|
| **`useState`** | Estado local | `Compra.jsx`: `cantidad`, `socioId`, `pago` |
| **`useEffect`** | Efectos: pedir datos, timers, suscripciones | `useDatos.js` |
| **`useRef`** | Guardar un valor/elemento **sin re-renderizar** al cambiarlo | `Dialogo.jsx`, `useMensaje.js` |
| **`useCallback`** | Mantener la misma función entre renders (evita loops en `useEffect`) | `useDatos.js` |
| **`useContext`** | Datos globales sin pasar props por todos los niveles (*prop drilling*) | — |
| **`useId`** | Id único (ej. `aria-labelledby`) | `Dialogo.jsx` |

### `useState` en profundidad

```jsx
const [count, setCount] = useState(0);
//     ↑valor    ↑setter        ↑valor inicial
```

- Devuelve **un array de 2**: `[valorActual, función setter]` (por eso la desestructuración).
- Llamar al setter **agenda un re-render**; el estado **persiste** entre renders.
- **Nunca** mutar el estado directamente (`tareas.push(x)` ❌). Siempre crear uno nuevo:

```jsx
setTareas([...tareas, nueva]);                              // agregar
setTareas(tareas.filter(t => t.id !== id));                 // quitar
setTareas(tareas.map(t => t.id === id ? actualizada : t));  // modificar
```

**Ciclo reactivo** al hacer clic: `onClick` → `setCount(count+1)` → React re-ejecuta el componente → nuevo JSX → diffing → solo cambia ese nodo de texto en el DOM real.

### `useEffect` en profundidad

```jsx
useEffect(() => {
  fetch(API_URL).then(r => r.json()).then(setTareas);
}, []);   // ← array de dependencias
```

| Array de dependencias | Cuándo se ejecuta |
|---|---|
| `[]` | **Una sola vez**, al montar (carga inicial de datos) |
| `[q]` | Al montar y **cada vez que cambia `q`** |
| (sin array) | Después de **cada** render ⚠️ |

La función de retorno es la **limpieza** (cancelar timers/suscripciones). Ejemplo con debounce:

```jsx
useEffect(() => {
  const timer = setTimeout(() => buscar(q), 500);
  return () => clearTimeout(timer);   // limpia el timer anterior
}, [q]);
```

### Hook propio (custom hook)

Función `useXxx` que junta otros hooks para reutilizar lógica. **En nuestro proyecto:**

```jsx
// hooks/useDatos.js — carga datos y expone los 3 estados que la UI debe comunicar
export default function useDatos(cargador, inicial = []) {
  const [datos, setDatos] = useState(inicial);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true); setError("");
    try { setDatos(await cargador()); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, [cargador]);

  useEffect(() => { recargar(); }, [recargar]);
  return { datos, cargando, error, recargar };
}
```

### Renderizado condicional

Mostrar una cosa u otra según una condición. Tres formas:

```jsx
if (cargando) return <p>Cargando...</p>;                         // 1. if (early return)
{tareas.length === 0 ? <p>No hay tareas</p> : <Lista />}         // 2. ternario ? :
{tareas.length === 0 && <p>No hay tareas</p>}                    // 3. && (se muestra si es true)
```

---

## 12. React: props, eventos y formularios

### Props y flujo de datos

```
        PADRE (tiene el estado)
         │  ↓ props (datos)        ↑ callbacks (eventos)
        HIJO (muestra y avisa)
```

- **Flujo unidireccional**: los datos bajan por props; el hijo **no puede modificarlas**.
- Para "modificar", el padre le pasa una **función callback** por props; el hijo la invoca y el cambio ocurre en el padre → **elevación de estado** (*lifting state up*).
- `props.children` = lo que va **entre las etiquetas** del componente (lo hace muy reutilizable).
- Las props pueden ser texto, números, objetos o **funciones**.

```jsx
// Padre (Tareas.jsx): tiene el estado y las funciones
<ListaTareas tareas={tareas} onCambiarEstado={cambiarEstado} onEliminar={eliminarTarea} />

// Hijo (ListaTareas.jsx): recibe y reparte
function ListaTareas({ tareas, onCambiarEstado, onEliminar }) {
  return (
    <section>
      <h2>Tareas ({tareas.length})</h2>
      {tareas.length === 0 && <p>No hay tareas.</p>}
      {tareas.map(tarea => (
        <TareaItem key={tarea.id} tarea={tarea} onCambiarEstado={onCambiarEstado} onEliminar={onEliminar} />
      ))}
    </section>
  );
}
```

### Listas: `map` y `key`

`array.map(x => <Item key={x.id} />)` genera un componente por elemento. **`key`** (único y estable, el id del back) le permite a React saber cuál cambió; **no usar el índice** si la lista cambia de orden.

### Eventos

- React envuelve los eventos nativos en **`SyntheticEvent`** (mismo comportamiento en todos los navegadores).
- Se escriben en **camelCase**: `onClick`, `onChange`, `onSubmit`.
- Se pasa una **referencia** a la función, **no** una llamada:

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `onClick={handleClick}` | `onClick={handleClick()}` (se ejecuta al renderizar) |
| `onClick={() => borrar(id)}` | `onClick={borrar(id)}` |

- `e.preventDefault()` evita que el `<form>` recargue la página.

### Formularios

**Controlado**: el valor vive en el estado (`value` + `onChange`). React manda sobre el campo.

```jsx
function FormularioProducto({ onAgregar }) {
  const [nombre, setNombre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();                       // 1. no recargar
    if (!nombre.trim()) return;               // 2. validar
    onAgregar({ nombre, id: Date.now() });    // 3. avisar al padre (callback)
    setNombre("");                            // 4. limpiar
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <button type="submit">Agregar</button>
    </form>
  );
}
```

| Controlado | No controlado |
|---|---|
| `value` + `onChange`, el valor está en el estado | `defaultValue`, se lee al enviar |
| Cuando la UI depende del valor mientras se escribe (total de la compra) | Altas simples |

**En JSX** se escribe `className` (no `class`) y `htmlFor` (no `for`).

---

## 13. React Router y SPA

**SPA**: una única página HTML; al navegar, JS cambia el contenido **sin recargar**. **React Router** muestra un componente distinto según la URL.

```bash
npm install react-router-dom
```

```jsx
// main.jsx: BrowserRouter envuelve la app
<BrowserRouter><App /></BrowserRouter>

// App.jsx: tabla de rutas
<Routes>
  <Route path="/" element={<Inicio />} />
  <Route path="/socios" element={<Socios />} />
  <Route path="*" element={<NoEncontrada />} />   {/* 404: cualquier otra ruta */}
</Routes>
```

| Pieza | Para qué |
|---|---|
| `BrowserRouter` | Habilita el router (usa la History API) |
| `Routes` / `Route` | Define `path` → `element` |
| `Link` / `NavLink` | Enlaces **sin recargar**; `NavLink` marca la página activa. Se usa en lugar de `<a href>` |
| `useNavigate` | Navegar desde código |
| `useLocation` | Leer la ruta actual (lo usamos en `App.jsx` para mover el foco) |
| `path="*"` | Página 404 |

> Un `<a href>` común **recarga la página** y pierde el estado; `Link` no.

**En nuestro proyecto:** `App.jsx` (rutas), `Encabezado.jsx` (`NavLink`), `NoEncontrada.jsx` (404).

---

## 14. Conexión con el back: fetch, async/await y CORS

### Los 4 pedidos del CRUD (TodoList de la cátedra)

```jsx
const API_URL = "http://localhost:8080/api/tareas";

// READ — al abrir la página
useEffect(() => {
  fetch(API_URL)
    .then(r => { if (!r.ok) throw new Error("Error al obtener"); return r.json(); })
    .then(data => setTareas(data))
    .catch(err => console.error(err));
}, []);

// CREATE
async function agregarTarea(event) {
  event.preventDefault();                                   // 1. evita recargar
  if (titulo.trim() === "") return;                         // 2. valida
  const nueva = { titulo, descripcion, tipo, completada: false };   // 3. prepara datos
  const response = await fetch(API_URL, {                   // 4. envía (await espera la respuesta)
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nueva)
  });
  if (!response.ok) return;                                 // 5. comprueba
  const guardada = await response.json();                   // trae el id generado por la BD
  setTareas([...tareas, guardada]);                         // 6. actualiza la UI
  setTitulo("");                                            // 7. limpia el form
}

// UPDATE
await fetch(`${API_URL}/${tarea.id}`, { method: "PUT", headers: {...}, body: JSON.stringify(actualizada) });
setTareas(tareas.map(t => t.id === actualizada.id ? actualizada : t));

// DELETE
await fetch(`${API_URL}/${id}`, { method: "DELETE" });
setTareas(tareas.filter(t => t.id !== id));
```

| CRUD | HTTP | `fetch` | Cómo se actualiza el estado |
|---|---|---|---|
| Create | POST | `method:"POST"` + `body` | `[...tareas, nueva]` |
| Read | GET | (default) | `setTareas(data)` |
| Update | PUT | `method:"PUT"` + `body` | `tareas.map(...)` |
| Delete | DELETE | `method:"DELETE"` | `tareas.filter(...)` |

### Puntos clave

- `fetch` devuelve una **promesa**; **`await`** espera la respuesta sin bloquear la página (solo dentro de `async`).
- **`fetch` NO falla con un 404/500** (solo si no hay red): hay que revisar `response.ok`.
- `Content-Type: application/json` + `JSON.stringify(obj)` para enviar; `response.json()` para leer.
- El POST devuelve el objeto con el **id que generó la BD** → eso es lo que se agrega al estado.

### CORS

El navegador bloquea pedidos entre **orígenes distintos** (protocolo + dominio + **puerto**). Vite corre en `:5173` y Spring en `:8080` → orígenes distintos → bloqueo.

- **Postman, curl y server-to-server NO aplican CORS** (es una protección del navegador).
- **Solución 1 (back):** registrar en Spring los orígenes permitidos (`CorsConfig` / `@CrossOrigin`).
- **Solución 2 (la nuestra):** **proxy de Vite** → para el navegador todo es el mismo origen. Va en `vite.config.js`; la URL del back se cambia en `.env` (`BACKEND_URL`).

> **En nuestro proyecto:** el único `fetch` está en `js/api.js`; las páginas llaman a `obtener()` y `enviar()`. Los errores del back (`ProblemDetail`) se muestran con su `detail`.

---

## 15. Modularizar componentes

Es el tema de la clase 14. **Modularizar** = partir la pantalla en componentes chicos, cada uno con **una responsabilidad**.

### Ventajas

| Ventaja | Qué significa |
|---|---|
| **Reutilización** | El mismo componente se usa en muchas pantallas (`Campo.jsx` en todos los formularios) |
| **Mantenibilidad** | Un cambio se hace en un solo lugar |
| **Legibilidad** | Archivos cortos, nombres que explican |
| **Encapsulamiento** | Cada componente maneja su lógica y presentación |
| **Menor acoplamiento** | Se comunican solo por props y callbacks |
| **Testeo y trabajo en equipo** | Cada uno toma una pieza |

### Estructura de carpetas

```
src/
├── paginas/        ← una por ruta (Tareas, Socios...)          "Pages"
├── componentes/    ← piezas reutilizables (TareaItem, Campo)   "Components"
├── hooks/          ← lógica de estado reutilizable (useDatos)
└── js/             ← lógica sin HTML (api.js, validaciones.js)
```

**Pages vs Components:** una **página** es lo que muestra una **ruta** y suele tener el **estado** y la conexión con el back; un **componente** es una pieza que **recibe props** y se puede usar en cualquier página.

### Ejemplo de la cátedra (TodoList)

| Archivo | Responsabilidad |
|---|---|
| `App.jsx` | Rutas y menú (React Router) |
| `pages/Tareas.jsx` | Estado de las tareas, crear/completar/eliminar, `fetch` |
| `pages/AcercaDe.jsx` | Descripción del TP y conceptos aplicados |
| `components/ListaTareas.jsx` | Recibe la lista por props, `map()`, total y mensaje "No hay tareas" |
| `components/TareaItem.jsx` | Una tarjeta; botones que llaman a callbacks recibidos por props |

---

## 16. Comparativa Thymeleaf vs HTMX vs React

| Criterio | **Thymeleaf** (SSR puro) | **Thymeleaf + HTMX** | **React** (SPA) |
|---|---|---|---|
| Paradigma | Multi-página, render en servidor | Server-driven UI + hipermedia | Component-driven SPA |
| Estado | 100% servidor | 100% servidor | Distribuido en el cliente |
| Qué viaja por red | Páginas HTML completas | Fragmentos HTML (~1–3 kB) | JSON (tras un bundle inicial pesado) |
| JS en el cliente | 0 kB | ~14 kB | 100 kB a 1+ MB |
| Tooling | Ninguno (Maven) | Ninguno (script CDN/static) | Node, npm, Vite, Babel |
| Primera carga (FCP) | Rápida | Rápida | Más lenta (baja el bundle, lo parsea y recién arma el DOM) |
| Validaciones | Una sola vez (servidor) | Una sola vez (servidor) | **Duplicadas**: front + back |
| Ideal para | Contenido, SEO, reportes, landings | **Sistemas de gestión, CRUDs, B2B, intranets** | Apps ricas, offline, drag-and-drop, dashboards |

### Cuándo usar cada una

| Pregunta | Elegir |
|---|---|
| ¿Sistema documental / SEO / institucional? | **Thymeleaf puro** |
| ¿Sistema transaccional / backoffice / ERP / CRUD? | **Thymeleaf + HTMX** (la más rentable para ~80% de las apps) |
| ¿Interfaz hiper-interactiva / productividad / offline? | **React** |

### Matices

- **Latencia:** React puede actualizar de forma optimista sin red; HTMX necesita un viaje al servidor (con buena red, imperceptible).
- **Payload:** JSON es más chico que HTML, pero con gzip la diferencia es insignificante en sistemas de gestión.
- **Seguridad de la lógica:** en server-driven la lógica de negocio nunca sale del servidor.
- **Equipo:** perfil backend Java → Thymeleaf/HTMX; equipo frontend dedicado → React.
- **Mismo ejemplo, distinto código:** React necesita `@RestController` con JSON + `useState` + `useEffect` + debounce manual + `map`; HTMX lo resuelve con atributos. React ≈ 4 veces más código de frontend.

### Los 5 principios de la cátedra

1. **Simplicidad primero:** no usar React por inercia.
2. **Soberanía del servidor:** reglas de negocio y validaciones en Spring.
3. **Rendimiento consciente:** vigilar el tamaño del bundle.
4. **Seguridad sin concesiones:** escapar siempre (XSS) y usar tokens CSRF.
5. **La herramienta adecuada:** React para apps ricas; HTMX para gestión.

> **Por qué nosotros usamos React:** nuestro back es una API REST que devuelve **JSON**; HTMX/Thymeleaf trabajan con HTML armado en el servidor. Además front y back están en repos separados.

---

## 17. Rúbrica del frontend

La rúbrica oficial: **100 puntos, se aprueba con 60.** La evaluación es **independiente de la tecnología** (React no da puntos extra) y **no es obligatorio conectar con el back** (se permiten datos simulados).

| N.º | Criterio | Pts | Qué mirar |
|---|---|---|---|
| 1 | **Adecuación al modelo de negocio** | 15 | La interfaz representa el negocio, sus servicios y las necesidades de sus usuarios |
| 2 | **Estructura y arquitectura de la interfaz** | 10 | Páginas, secciones y componentes organizados; fácil de recorrer |
| 3 | **Semántica y accesibilidad** | 15 | Etiquetas semánticas, jerarquía de encabezados, labels, contraste, `alt`, teclado |
| 4 | **Diseño visual y usabilidad** | 15 | Consistente, legible, jerarquía visual, acciones principales fáciles de ubicar |
| 5 | **Adaptabilidad a dispositivos** | 10 | Responsive: sin desbordes, legible y funcional en cualquier tamaño |
| 6 | **Interacción y comportamiento** | 15 | Botones, enlaces, menús y filtros responden y dan feedback |
| 7 | **Formularios, validaciones y estados** | 10 | Labels, validaciones del cliente, mensajes claros, estados de error / éxito / espera |
| 8 | **Calidad técnica** | 10 | Código organizado, separación de responsabilidades, fácil de modificar |

Niveles: **Excelente** (máximo) · **Adecuado** (~80%) · **Básico** (~60%) · **Insuficiente** (~20%).

Condiciones: la conexión con el backend **no se penaliza** si falta · no se exige persistencia · los controles **deben responder según lo que el front declara ofrecer** (un botón que no hace nada resta) · la integración full stack es de una instancia posterior.

> Cada ítem de los **8 criterios** es una posible pregunta: "¿qué hiciste para accesibilidad?", "¿cómo es responsive?", "¿dónde validás?".

---

## 18. Banco de preguntas

### Teoría general

1. **¿Qué es el DOM?** El árbol de nodos que el navegador arma a partir del HTML; JS lo puede leer y modificar.
2. **¿Diferencia entre `defer` y `async`?** Ambos descargan en paralelo. `async` ejecuta apenas termina de bajar; `defer` espera a que el DOM esté parseado y respeta el orden.
3. **¿Por qué un solo `<h1>`?** Es el título principal; una jerarquía correcta ayuda a accesibilidad y SEO.
4. **¿Para qué sirve `alt`?** Describe la imagen a lectores de pantalla y se muestra si la imagen falla.
5. **¿Por qué `rel="noopener"` con `target="_blank"`?** Evita *tabnabbing*.
6. **¿Por qué no usar tablas para maquetar?** Las tablas son para datos tabulares; el layout se hace con Flexbox/Grid.
7. **¿Flexbox o Grid?** Flexbox es de 1 dimensión (menús, alineaciones); Grid de 2 (filas y columnas, catálogos).
8. **¿Qué hace `box-sizing: border-box`?** El `width` incluye padding y border.
9. **¿Qué son las variables CSS?** `--nombre` definidas en `:root` y usadas con `var(--nombre)`; permiten cambiar la paleta (y el modo oscuro) en un solo lugar.
10. **¿Qué es mobile first?** Diseñar primero para celular y ampliar con `min-width`.
11. **¿Por qué la validación del cliente no alcanza?** Se saltea editando el DOM o con Postman; el back siempre debe revalidar.
12. **¿Qué hace `e.preventDefault()`?** Cancela el comportamiento por defecto (en un form, recargar la página).
13. **¿Qué es la especificidad?** El peso con el que se resuelven reglas CSS en conflicto: inline > id > clase > etiqueta.

### Arquitecturas

14. **¿Qué es SSR y qué es CSR?** SSR: el servidor arma el HTML (Thymeleaf). CSR: el navegador lo arma con JS (React).
15. **¿Qué es Thymeleaf?** Motor de plantillas del lado del servidor que mezcla una plantilla HTML con datos del `Model` de Spring MVC.
16. **¿Qué son las plantillas naturales?** HTML5 válido que se ve bien abierto en el navegador sin servidor; los `th:*` se ignoran.
17. **¿`th:text` vs `th:utext`?** `th:text` escapa los caracteres especiales (seguro contra XSS); `th:utext` no, solo para HTML 100% confiable.
18. **¿Qué hace `th:each`?** Repite la etiqueta por cada elemento de una colección.
19. **¿Qué es `th:fragment` y por qué importa para HTMX?** Es un bloque reutilizable; permite que el controlador devuelva **solo un fragmento** (`"plantilla :: fragmento"`).
20. **¿Qué es HTMX?** Librería de ~14 kB que permite hacer peticiones AJAX desde atributos HTML y actualizar partes del DOM, sin escribir JS.
21. **¿Qué es HATEOAS?** El HTML que manda el servidor incluye el estado y las acciones posibles; el cliente no necesita conocer las reglas de negocio.
22. **¿Qué hace `hx-swap="outerHTML"` con `hx-target="closest tr"`?** Reemplaza la fila completa; si el servidor responde vacío, la fila desaparece (borrado en vivo).
23. **¿Qué es el debounce y cómo se hace en HTMX?** Esperar a que el usuario deje de escribir antes de enviar: `hx-trigger="keyup changed delay:500ms"`.
24. **¿Para qué `hx-push-url`?** Sincroniza la URL con la History API: funciona el botón Atrás y se pueden compartir links.
25. **¿Para qué `hx-swap-oob`?** Actualiza **otro** elemento de la página (ej. un contador) con la misma respuesta.
26. **¿Cuándo HTMX y cuándo React?** HTMX para sistemas de gestión/CRUD/intranets; React para apps muy interactivas o con estado complejo en el cliente.

### React

27. **¿Qué es React? ¿Librería o framework?** Librería para la capa de vista basada en componentes. El que impone estructura es Angular.
28. **¿Qué es JSX?** Sintaxis tipo HTML dentro de JS; se transpila a `React.createElement`. Entre `{ }` va JS.
29. **¿Qué es el Virtual DOM?** Copia en memoria del DOM; React compara versiones (diffing) y actualiza el DOM real solo en lo que cambió.
30. **¿Declarativo vs imperativo?** Declarativo: describís qué se ve según el estado. Imperativo: indicás paso a paso cómo tocar el DOM.
31. **¿Qué es un componente? ¿Por qué con mayúscula?** Función que devuelve JSX. PascalCase para que React no lo confunda con una etiqueta HTML.
32. **¿Props vs estado?** Props: vienen del padre, son de **solo lectura**. Estado: es **privado** del componente y puede cambiar.
33. **¿Qué pasa al llamar a `setX`?** React agenda un re-render del componente con el nuevo valor.
34. **¿Por qué no se muta el estado directamente?** React no detecta el cambio; hay que pasar un valor nuevo (`[...arr, x]`, `filter`, `map`).
35. **¿Qué es `useEffect` y para qué sirve el array `[]`?** Ejecuta código después del render; con `[]` solo al montar (cargar datos una vez).
36. **¿Reglas de los hooks?** Solo en el nivel superior (no en `if`/bucles) y solo desde componentes funcionales o custom hooks.
37. **¿Por qué se rompe un hook dentro de un `if`?** React los asocia por orden de llamada; si el orden cambia, pierde cuál estado es cuál.
38. **¿Para qué sirve `key`?** Identifica cada elemento de una lista para actualizar solo el que cambió.
39. **¿Cómo se comunica un hijo con el padre?** Con una función callback pasada por props (`onEliminar`); el estado se actualiza en el padre.
40. **¿Qué es la elevación de estado?** Subir el estado al ancestro común de los componentes que lo necesitan.
41. **¿Renderizado condicional?** Mostrar distinto según una condición: `if`, ternario o `&&`.
42. **¿Formulario controlado vs no controlado?** Controlado: `value` + `onChange`, el valor vive en el estado. No controlado: se lee al enviar.
43. **¿Qué es una SPA? ¿Cómo navega React Router?** Una sola página HTML; `Routes`/`Route` muestran el componente según la URL y `Link`/`NavLink` navegan sin recargar.
44. **¿Qué es `StrictMode`?** Solo en desarrollo, ejecuta cosas dos veces para detectar errores. No afecta producción.
45. **¿Qué hace Vite? ¿Y HMR?** Levanta el servidor de desarrollo y empaqueta la versión final. HMR actualiza el módulo sin recargar ni perder el estado.
46. **¿Diferencia `dependencies` y `devDependencies`?** Las primeras son necesarias en producción (react); las segundas solo para desarrollar (vite, eslint).
47. **¿Por qué no se sube `node_modules`?** Pesa mucho y se regenera con `npm install` a partir de `package.json`/`package-lock.json`.
48. **¿Qué es CORS y por qué pasa con Vite + Spring?** El navegador bloquea pedidos entre orígenes distintos (`:5173` vs `:8080`). Se resuelve con un proxy de Vite o configurando CORS en Spring. Postman no lo aplica.
49. **¿`fetch` falla con un 404?** No: solo falla si no hay red. Hay que chequear `response.ok`.
50. **¿Ventajas de modularizar?** Reutilización, mantenibilidad, legibilidad, encapsulamiento y menor acoplamiento.

---

## 19. Ejercicios con código

### Ej. 1 — ¿Qué está mal?

```jsx
function Contador() {
  if (activo) {
    const [count, setCount] = useState(0);   // ❌ hook dentro de un if
  }
  return <button onClick={setCount(count + 1)}>{count}</button>;   // ❌ se ejecuta al renderizar
}
```
**Respuesta:** (1) rompe la regla 1 de los hooks (nivel superior); (2) `onClick={setCount(count+1)}` **llama** la función al renderizar → loop infinito; debe ser `onClick={() => setCount(count + 1)}`.

### Ej. 2 — Mutar el estado

```jsx
tareas.push(nueva);
setTareas(tareas);   // ❌ misma referencia: React no re-renderiza
```
**Respuesta:** crear un array nuevo: `setTareas([...tareas, nueva])`.

### Ej. 3 — Cargar datos al abrir

Completá para traer los productos una sola vez:
```jsx
const [productos, setProductos] = useState([]);
useEffect(() => {
  fetch("/api/productos").then(r => r.json()).then(setProductos);
}, []);   // ← [] = una sola vez
```

### Ej. 4 — Lista con mensaje vacío

```jsx
function ListaProductos({ productos, onEliminar }) {
  return (
    <section>
      <h2>Productos ({productos.length})</h2>
      {productos.length === 0 && <p>No hay productos.</p>}
      {productos.map(p => (
        <article key={p.id}>
          <h3>{p.nombre}</h3>
          <button onClick={() => onEliminar(p.id)}>Eliminar</button>
        </article>
      ))}
    </section>
  );
}
```

### Ej. 5 — Eliminar con fetch

```jsx
async function eliminar(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) { console.error("Error al eliminar"); return; }
  setProductos(productos.filter(p => p.id !== id));
}
```

### Ej. 6 — Buscador con debounce en React

```jsx
const [q, setQ] = useState("");
useEffect(() => {
  const timer = setTimeout(() => {
    fetch(`/api/productos/buscar?q=${q}`).then(r => r.json()).then(setProductos);
  }, 500);
  return () => clearTimeout(timer);
}, [q]);
return <input value={q} onChange={e => setQ(e.target.value)} />;
```

### Ej. 7 — Agregar una ruta nueva

1. Crear `paginas/Reportes.jsx`.
2. En `App.jsx`: `<Route path="/reportes" element={<Reportes />} />`.
3. En `Encabezado.jsx`: `<NavLink to="/reportes">Reportes</NavLink>`.

### Ej. 8 — Borrar una fila con HTMX

```html
<button hx-delete="/api/productos/42" hx-target="closest tr" hx-swap="outerHTML"
        hx-confirm="¿Eliminar?">Eliminar</button>
```
Si el usuario cancela el `confirm`: **no hay pedido**. Si acepta y el servidor responde `200` con cuerpo vacío: la fila desaparece.

### Ej. 9 — Thymeleaf: tabla con filas alternadas

```html
<tr th:each="p, stat : ${productos}" th:class="${stat.odd} ? 'filaImpar' : 'filaPar'">
  <td th:text="${stat.count}">1</td>
  <td th:text="${p.nombre}">Teclado</td>
  <td th:text="'$' + ${p.precio}">$100</td>
</tr>
```

### Ej. 10 — Maquetar un catálogo responsive

```css
.catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
@media (max-width: 768px) { nav ul { flex-direction: column; } }
```

### Ej. 11 — Formulario accesible

```html
<form action="/api/contacto" method="post">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required aria-describedby="emailError">
  <small id="emailError" role="alert"></small>
  <button type="submit">Enviar</button>
</form>
```

### Ej. 12 — Pasarlo a componentes

Dada una página con todo mezclado (formulario + lista + cada ítem):

| Pieza | Componente | Recibe por props |
|---|---|---|
| Toda la pantalla (estado + fetch) | `Tareas.jsx` (página) | — |
| Lista con total y mensaje vacío | `ListaTareas.jsx` | `tareas`, `onCambiarEstado`, `onEliminar` |
| Una tarjeta | `TareaItem.jsx` | `tarea`, `onCambiarEstado`, `onEliminar` |

---

## 20. Errores típicos y trampas

| ❌ Trampa | ✅ Realidad |
|---|---|
| "React es un framework" | Es una **librería** (Angular es el framework) |
| "Las props se pueden modificar en el hijo" | Son **solo lectura**; el hijo avisa al padre con un callback |
| "`onClick={f()}`" | Ejecuta `f` al renderizar. Es `onClick={f}` o `onClick={() => f(x)}` |
| "`setX` cambia el valor al instante" | Agenda un re-render; en esta línea `x` sigue valiendo lo anterior |
| "Mutar el array y llamar al setter" | Hay que crear uno nuevo (`spread`, `filter`, `map`) |
| "Hook dentro de un `if` o de un handler" | Solo nivel superior y desde funciones de React |
| "`useEffect` sin array" | Se ejecuta en **cada** render; con fetch + `setState` genera un loop infinito |
| "`fetch` rechaza con 404/500" | Solo rechaza si falla la red; revisar `response.ok` |
| "`<a href>` para navegar en React" | Recarga la página; usar `Link` / `NavLink` |
| "`class` y `for` en JSX" | `className` y `htmlFor` |
| "`list.map` sin `key`" | Warning y mala reconciliación; usar un `key` único |
| "El componente se llama `tareaItem`" | Debe ser **PascalCase**: `TareaItem` |
| "HTMX = el servidor manda JSON" | HTMX trabaja con **fragmentos HTML** |
| "`th:utext` es lo mismo que `th:text`" | `utext` no escapa → riesgo de XSS |
| "`async` y `defer` son iguales" | `defer` espera al DOM; `async` ejecuta apenas baja |
| "Con validar en el front alcanza" | Se saltea con Postman; el back revalida siempre |
| "CORS es un error del servidor" | Es una restricción del **navegador**; Postman no la tiene |
| "Más de un `<h1>` / saltar de `h1` a `h4`" | Rompe la jerarquía; un `h1` y niveles en orden |
| "Imagen sin `alt`" | Obligatorio (vacío si es decorativa) |
| "Tablas para el layout" | Flexbox/Grid; las tablas son solo para datos |
| "Rutas con mayúsculas o espacios" | Rompen en Linux; minúsculas y sin espacios |
| "`innerHTML` con datos del usuario" | XSS; React y `th:text` escapan solos |

---

## 21. Glosario relámpago

| Término | Definición corta |
|---|---|
| **Componente** | Función que devuelve JSX; pieza reutilizable de UI |
| **Props** | Datos del padre al hijo, solo lectura |
| **Estado** | Datos privados que, al cambiar, redibujan el componente |
| **Hook** | Función `use...` que engancha un componente funcional al estado/ciclo de vida |
| **Custom hook** | Hook propio que reutiliza lógica (`useDatos`) |
| **JSX** | HTML dentro de JavaScript |
| **Virtual DOM** | Copia en memoria del DOM para actualizar solo lo necesario |
| **Diffing / reconciliación** | Comparar el VDOM nuevo con el viejo para calcular el cambio mínimo |
| **Re-render** | Volver a ejecutar el componente cuando cambia su estado o sus props |
| **Callback** | Función pasada por props para que el hijo avise al padre |
| **Lifting state up** | Subir el estado al ancestro común |
| **Prop drilling** | Pasar props por muchos niveles solo para llegar a un nieto (se evita con `useContext`) |
| **SPA** | Una sola página HTML con contenido dinámico |
| **SSR / CSR** | Render en servidor / render en cliente |
| **Bundle** | Archivo(s) JS final que descarga el navegador |
| **FCP** | First Contentful Paint: cuándo se dibuja el primer contenido |
| **Transpilar** | Convertir JSX a JS estándar |
| **HMR** | Actualizar un módulo sin recargar la página |
| **Fragmento (HTMX/Thymeleaf)** | Bloque de HTML parcial, no una página completa |
| **Swap** | Cómo/dónde HTMX inserta la respuesta |
| **Debounce** | Esperar a que cese la actividad antes de ejecutar |
| **Polling** | Consultar al servidor cada cierto tiempo |
| **Landmark** | Región semántica (`header`, `nav`, `main`...) que usan los lectores de pantalla |
| **Tabnabbing** | Ataque desde una pestaña abierta con `_blank` sin `noopener` |
| **XSS** | Inyección de scripts en la página |
| **Origen** | Protocolo + dominio + puerto; si cambia alguno, es otro origen (CORS) |
| **Proxy (Vite)** | Reenvía `/api` al back para que el navegador vea un solo origen |
| **Mobile first** | Diseñar para celular y ampliar hacia pantallas grandes |
| **Prop `children`** | Lo que se escribe entre las etiquetas de un componente |
| **StrictMode** | Modo de desarrollo de React que detecta problemas |
