# Resumen para el 2° Parcial — Aplicaciones Interactivas (Frontend)

> **Parcial: clase 16 — jueves 19/11.**
> Armado a partir de los PDFs de la cátedra de la carpeta `frontEnd`: *Diseño web repaso integral* (HTML, CSS, JS),
> *Preparación React*, *Frontend con React* (TodoList) y *React, HTML y HTMX* (Thymeleaf, HTMX, React y comparativa).

---

## ÍNDICE

1. [Chuleta — lo mínimo que hay que saber](#1-chuleta--lo-mínimo-que-hay-que-saber)
2. [Qué entra (según el cronograma)](#2-qué-entra-según-el-cronograma)
3. [Evolución de la web y modelos de arquitectura](#3-evolución-de-la-web-y-modelos-de-arquitectura)
4. [HTML5](#4-html5)
5. [CSS3](#5-css3)
6. [JavaScript](#6-javascript)
7. [Thymeleaf](#7-thymeleaf)
8. [HTMX](#8-htmx)
9. [React: qué es y por qué](#9-react-qué-es-y-por-qué)
10. [Proyecto React: Node, npm y Vite](#10-proyecto-react-node-npm-y-vite)
11. [Componentes, JSX, props y estado](#11-componentes-jsx-props-y-estado)
12. [Hooks: useState y useEffect](#12-hooks-usestate-y-useeffect)
13. [Eventos, formularios y renderizado condicional](#13-eventos-formularios-y-renderizado-condicional)
14. [React Router y SPA](#14-react-router-y-spa)
15. [Fetch y CORS](#15-fetch-y-cors)
16. [Comparativa Thymeleaf vs HTMX vs React](#16-comparativa-thymeleaf-vs-htmx-vs-react)
17. [Banco de preguntas](#17-banco-de-preguntas)
18. [Ejercicios con snippets de código](#18-ejercicios-con-snippets-de-código)
19. [Errores típicos y trampas](#19-errores-típicos-y-trampas)
20. [Glosario relámpago](#20-glosario-relámpago)

---

## 1. Chuleta — lo mínimo que hay que saber

### Las siglas

| Sigla | Significado | Qué es |
|---|---|---|
| **HTML** | *HyperText Markup Language* | Lenguaje de marcado: define la **estructura y el contenido** |
| **CSS** | *Cascading Style Sheets* | Hojas de estilo en cascada: define la **presentación** |
| **DOM** | *Document Object Model* | Árbol de nodos que el navegador arma en memoria a partir del HTML |
| **JSX** | *JavaScript XML* | Sintaxis similar a HTML dentro de JS (js + xml = jsx) |
| **SPA** | *Single Page Application* | Una única página HTML que actualiza su contenido sin recargar |
| **SSR** | *Server-Side Rendering* | El HTML se arma en el servidor |
| **VDOM** | *Virtual DOM* | "Foto" del DOM en memoria que usa React para actualizar solo lo necesario |
| **HMR** | *Hot Module Replacement* | Actualiza módulos sin recargar la página y sin perder el estado |
| **HATEOAS** | *Hypermedia As The Engine Of Application State* | El hipermedia (HTML) como motor del estado |
| **CORS** | *Cross-Origin Resource Sharing* | Mecanismo de seguridad del navegador entre orígenes distintos |
| **XSS** | *Cross-Site Scripting* | Ataque que inyecta scripts en la página |
| **npm** | *Node Package Manager* | Gestor de paquetes de JavaScript/Node.js |
| **FCP** | *First Contentful Paint* | Momento en que se dibuja el primer contenido en pantalla |

### Las 3 capas del front

```
HTML  →  ESTRUCTURA       (qué hay)
CSS   →  PRESENTACIÓN     (cómo se ve)
JS    →  COMPORTAMIENTO   (qué hace)
```

### Las 3 tecnologías comparadas

```
THYMELEAF        HTML armado en el SERVIDOR         página completa     0 kB de JS
HTMX             fragmentos HTML desde el SERVIDOR  ~1-3 kB por pedido  ~14 kB de JS
REACT            HTML armado en el NAVEGADOR        JSON                100 kB a 1+ MB de JS
```

### React en 4 líneas

```
Componente = función que devuelve JSX
Props      = datos del padre al hijo (solo lectura)
Estado     = datos propios que cambian (useState) → re-render
useEffect  = código que corre después del render (ej. pedir datos al back)
```

### Ruta de ejecución de una app React

```
index.html  →  main.jsx  →  App.jsx
```

---

## 2. Qué entra (según el cronograma)

| Clase | Fecha | Tema |
|---|---|---|
| 9 | 1/10 | **Guía de diseño de interfaces web.** Tecnologías asociadas. Estructura del software en el front end |
| 10 | 8/10 | **Clientes web. Evolución. Distintos tipos. Herramientas** |
| 11 | 15/10 | **Introducción a React.** Componentes funcionales y no funcionales. Estado y ciclo de vida |
| 12 | 22/10 | **Renderizado.** Estado en componentes funcionales. **Hooks. Formularios. Renderizado condicional** |
| 13 | 29/10 | **React Navigation** (Router) |
| 14 | 5/11 | **Modularizar componentes. Ventajas** |
| 16 | 19/11 | **2° PARCIAL** |

> "Componentes funcionales y no funcionales" = **funcionales** (funciones + hooks) vs **de clase** (`extends React.Component`).

---

## 3. Evolución de la web y modelos de arquitectura

### Las 4 etapas

| Etapa | Años | Cómo funcionaba |
|---|---|---|
| **1. Web clásica (SSR puro)** | 90 – 2005 | Páginas completas armadas en el servidor (CGI, JSP, PHP). **Cada acción recargaba toda la página** |
| **2. Revolución AJAX** | 2005 – 2012 | `XMLHttpRequest` y jQuery. Se inyectan datos en **partes** del DOM, pero con JS disperso e inconsistente |
| **3. Era de las SPAs** | 2013 – 2020 | React, Angular, Vue. **El navegador controla el estado y genera todo el HTML.** Crece la complejidad del tooling |
| **4. Renacimiento hipermedia** | Actualidad | HTMX + SSR moderno (Thymeleaf). **El servidor recupera la lógica** y manda HTML parcial |

### Dos filosofías enfrentadas

| | **Server-Driven UI** (Thymeleaf + HTMX) | **Client-Side Rendering** (React SPA) |
|---|---|---|
| Fuente de la verdad | El **servidor** | El **cliente** |
| Dónde vive el estado | Base de datos y sesión del servidor | Memoria del navegador (`useState`, Context, Redux) |
| Rol del navegador | Renderizador liviano de hipermedia | Ejecuta la aplicación completa |
| HTML inicial | Completo | Prácticamente vacío; JS crea el DOM |
| Comunicación | Fragmentos HTML | API REST / GraphQL con JSON |
| Ideal para | Sistemas de gestión, intranets, transaccionales | Apps muy interactivas (Figma, Canva, dashboards) |

### Los 4 factores de ingeniería que condiciona la elección

| Factor | Qué analiza |
|---|---|
| **Sobrecarga de red** | Peso del bundle inicial, FCP, volumen por petición, HTML vs JSON |
| **Gestión del estado** | ¿Servidor o cliente? Riesgo de desincronización, caché, seguridad de la lógica |
| **Experiencia del desarrollador** | Complejidad del build (Webpack/Vite), curva de aprendizaje, velocidad de entrega |
| **Interactividad de la UI** | Fluidez percibida, estados offline, feedback inmediato, microinteracciones |

### Herramientas del desarrollo front-end

| Herramienta | Para qué |
|---|---|
| **DevTools (F12)** | *Elements*: inspeccionar y modificar DOM/CSS en vivo · *Console*: errores de JS · *Network*: carga de archivos y peticiones a la API (errores 404) |
| **Validador W3C** (validator.w3.org) | Verifica que el HTML cumpla el estándar: etiquetas sin cerrar, atributos obsoletos, `id` duplicados |
| **Node.js** | Ejecuta JS fuera del navegador; se usa para correr Vite e instalar dependencias |
| **npm** | Instala librerías |
| **Vite** | Servidor de desarrollo y empaquetado |
| **ESLint** | "Corrector ortográfico" del código: detecta errores y malas prácticas antes de ejecutar |

---

## 4. HTML5

### Qué es HTML

**HyperText Markup Language: lenguaje de marcado que define la ESTRUCTURA y el CONTENIDO del documento web, no su apariencia visual.** Está basado en etiquetas y el navegador lo convierte en memoria en un árbol de nodos: el **DOM**.

```
Document (raíz)
└── <html>
    ├── <head> → <title>, <link stylesheet>
    └── <body> → <header>, <main>, <footer>
```

### Anatomía de una etiqueta

```html
<p class="destacado" id="intro">Hola Mundo</p>
<!-- apertura    atributos        contenido  cierre -->
```

**Etiquetas vacías (self-closing):** `<img>`, `<input>`, `<meta>`, `<link>`, `<br>`, `<hr>`.

### Estructura base

```html
<!DOCTYPE html>                     <!-- avisa que es HTML5 -->
<html lang="es">                    <!-- raíz e idioma -->
<head>                              <!-- metadatos, título, CSS -->
  <meta charset="UTF-8">            <!-- acentos, ñ y caracteres especiales -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <!-- responsive en celular -->
  <meta name="description" content="Tienda de ejemplo UADE">              <!-- SEO -->
  <title>Mi Tienda — Inicio</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/app.js" defer></script>
</head>
<body>                              <!-- contenido visible -->
  <h1>Bienvenido</h1>
</body>
</html>
```

### 🔑 Carga de scripts: normal vs `async` vs `defer`

| Forma | Descarga | Ejecuta |
|---|---|---|
| `<script src>` | **Bloquea** el render del HTML | Inmediatamente |
| `async` | En paralelo | Apenas termina de bajar |
| **`defer`** | En paralelo | **Cuando terminó de parsear el DOM** |

> **Recomendación del profe:** `<script src="js/app.js" defer>` en el `<head>`. Garantiza que el DOM esté construido y evita el `TypeError: cannot read property of null`.

### Texto y jerarquía

| Etiqueta | Regla |
|---|---|
| `<h1>` | Título principal. **Solo UNO por página** |
| `<h2>`–`<h6>` | Encabezados en orden jerárquico, **sin saltar niveles** |
| `<strong>` | **Importancia semántica** (no solo negrita) |
| `<em>` | **Énfasis** en el tono (no solo cursiva) |
| `<code>` | Términos técnicos o código |
| `<blockquote>` / `<hr>` | Cita / separador temático |

### Listas

| Etiqueta | Tipo |
|---|---|
| `<ul>` | Desordenada — **estructura estándar de los menús** junto con `<nav>` |
| `<ol>` | Ordenada |
| `<dl>` `<dt>` `<dd>` | De definición (término + definición) |

### Enlaces `<a>`

```html
<a href="productos.html">Interno</a>
<a href="https://spring.io" target="_blank" rel="noopener">Externo, pestaña nueva</a>
<a href="#contacto">Ancla en la misma página</a>
<a href="contacto.html#formulario">Ancla en otra página</a>
<a href="mailto:info@tienda.com">Mail</a>
<a href="manual.pdf" download>Descarga</a>
```

| Atributo | Para qué |
|---|---|
| `target="_blank"` | Abre en pestaña nueva |
| `rel="noopener"` | **Imprescindible con `_blank`**: evita el *tabnabbing* (que la otra pestaña controle la nuestra) |
| `download` | Fuerza la descarga en lugar de abrir |
| `href="#"` | Evitarlo: enlace muerto. Mejor un evento JS |

### 🔑 Rutas relativas

| Símbolo | Significado |
|---|---|
| `./` | Carpeta actual |
| `../` | Subir un nivel |
| `/` | Raíz |

```
mi-tienda/
├── index.html
├── productos.html
├── producto/detalle.html
├── css/styles.css
└── img/logo.png
```

| Desde | Hacia | Ruta |
|---|---|---|
| `index.html` | `productos.html` | `productos.html` |
| `producto/detalle.html` | `index.html` | `../index.html` |
| `producto/detalle.html` | `css/styles.css` | `../css/styles.css` |

> Usar **minúsculas y sin espacios**: los servidores Linux distinguen mayúsculas.

### Multimedia

```html
<img src="img/remera.jpg" alt="Remera azul talle M" width="300">
<figure>
  <img src="img/zapatillas.jpg" alt="Zapatillas running">
  <figcaption>Zapatillas running — $25.000</figcaption>
</figure>
<video controls width="480"><source src="v.mp4" type="video/mp4"></video>
<audio controls><source src="a.mp3" type="audio/mpeg"></audio>
```

> **El atributo `alt` es OBLIGATORIO.** Lo leen los lectores de pantalla y aparece si la imagen falla al cargar. `<figure>` + `<figcaption>` vinculan la imagen con su texto.

### Tablas

```html
<table>
  <caption>Catálogo de Productos</caption>
  <thead>
    <tr><th scope="col">Producto</th><th scope="col">Precio</th></tr>
  </thead>
  <tbody>
    <tr><td>Remera</td><td>$5.000</td></tr>
  </tbody>
</table>
```

| Elemento | Para qué |
|---|---|
| `<caption>` | Título semántico de la tabla |
| `<thead>` / `<tbody>` | Separan encabezados y datos |
| `scope="col"` | Indica al lector de pantalla a qué columna pertenece el encabezado |

> ⚠️ Tablas **EXCLUSIVAMENTE para datos tabulares. NUNCA para maquetar** la página.

### 🔑 HTML5 semántico

| Etiqueta | Rol |
|---|---|
| `<header>` | Encabezado del sitio o de una sección |
| `<nav>` | Enlaces de navegación principal |
| `<main>` | Contenido central exclusivo de la página |
| `<section>` | Agrupación temática |
| `<article>` | Unidad de contenido **independiente** (card, post) |
| `<aside>` | Contenido secundario o barra lateral |
| `<footer>` | Pie: derechos, contacto, links |

**¿Por qué usarlo? — las 4 razones:**

| Razón | Explicación |
|---|---|
| **Accesibilidad** | Los lectores de pantalla navegan por *landmarks* |
| **SEO** | Los buscadores entienden jerarquía y relevancia |
| **Mantenibilidad** | Código legible para todo el equipo |
| **Ahorro de CSS** | No hacen falta clases como `.header`, `.footer` o `.nav-container` |

### Formularios

```html
<form action="/api/contacto" method="post">
  <fieldset>
    <legend>Datos de contacto</legend>
    <label for="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" required>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <button type="submit">Enviar</button>
  </fieldset>
</form>
```

| Atributo | Para qué |
|---|---|
| `action` | URL del endpoint en el backend (ej. un Controller de Spring) |
| `method` | Método HTTP de envío (**GET o POST**) |
| `name` | **Clave con la que el backend recibe el valor** |
| `id` | Identificador único para asociar con `<label for="...">` y para JS |
| `fieldset` / `legend` | Agrupan visual y semánticamente campos relacionados |

**Tipos de `<input>`:**

| Tipo | Uso |
|---|---|
| `text` / `search` | Texto libre / búsqueda |
| `email` / `password` | Formato con @ / clave oculta |
| `number` / `date` | Numérico / calendario nativo |
| `checkbox` / `radio` | Selección **múltiple** / **única** |
| `file` / `hidden` | Subir archivos / datos ocultos (id, tokens) |

### 🔑 Validación nativa HTML5

```html
<input type="text" name="usuario" required minlength="3" maxlength="20">
<input type="number" name="precio" min="0" step="0.01">
<input type="text" name="cp" pattern="[0-9]{4}">
<input type="text" name="nombre" placeholder="Tu nombre">
```

| Atributo | Valida |
|---|---|
| `required` | Obligatorio |
| `minlength` / `maxlength` | Largo del texto |
| `min` / `max` / `step` | Rango y paso de números |
| `pattern` | Expresión regular |
| `placeholder` | No valida: es un texto de ayuda |

> ⚠️ **ADVERTENCIA DE SEGURIDAD:** la validación del cliente se evita fácilmente modificando el DOM.
> **Regla de oro: SIEMPRE se vuelve a validar en el backend Spring.**

### Atributos globales

| Atributo | Para qué |
|---|---|
| `id` | Identificador **único** por página (anclas y JS) |
| `class` | Clases **reutilizables** para CSS y selecciones múltiples |
| `data-*` | Datos personalizados legibles por JS (`data-id="42"`) |
| `title` | Tooltip nativo |
| `hidden` | Oculta el elemento |
| `aria-*` | Refuerzan la accesibilidad (`aria-label="Agregar remera al carrito"`) |

### Tres formas de conectar CSS

| Forma | Ejemplo | |
|---|---|---|
| **Inline** | `<p style="color: red">` | Evitar |
| **Interno** | `<style>` dentro del `<head>` | Solo para un archivo |
| **Externo** | `<link rel="stylesheet" href="css/styles.css">` | **RECOMENDADO**: una hoja compartida por todas las páginas da consistencia |

### Buenas prácticas de HTML (resumen del profe)

1. **Un solo `<h1>`** por página.
2. **`alt` obligatorio** en todas las imágenes.
3. **`<label for="id">`** asociado a cada campo.
4. **Rutas relativas y en minúsculas.**

---

## 5. CSS3

### Qué es CSS

**Cascading Style Sheets: hojas de estilo en cascada que separan completamente la presentación visual de la estructura HTML.**

**Principio de cascada:** ante reglas en conflicto, **si tienen igual especificidad, gana la última leída**.

### 🔑 Especificidad (de mayor a menor)

| # | Selector | Peso |
|---|---|---|
| 1 | Estilo **inline** (`style="..."`) | **1000** |
| 2 | **ID** (`#carrito`) | **100** |
| 3 | **Clase / pseudo-clase** (`.card`, `:hover`) | **10** |
| 4 | **Etiqueta** (`p`, `h1`, `div`) | **1** |

### Selectores

```css
p { color: #333; }                      /* etiqueta */
.card { border: 1px solid #ddd; }       /* clase */
#carrito { background: #f9f9f9; }       /* id */
.card h2 { font-size: 1.2rem; }         /* descendiente: h2 dentro de .card, a cualquier nivel */
nav > ul { display: flex; }             /* hijo directo */
a:hover { text-decoration: underline; } /* pseudo-clase */
```

### 🔑 Box Model (modelo de cajas)

```
+-------------- margin ---------------+
|  +----------- border -------------+ |
|  |  +-------- padding ----------+ | |
|  |  |         content           | | |
|  |  +---------------------------+ | |
|  +--------------------------------+ |
+-------------------------------------+
```

| Capa | Qué es |
|---|---|
| **Content** | Ancho y alto real del contenido |
| **Padding** | Espacio **interno** entre contenido y borde |
| **Border** | Línea de contorno |
| **Margin** | Espacio **externo** transparente entre cajas |

```css
* { box-sizing: border-box; }   /* regla universal: el width incluye padding y border */
```

### 🔑 Flexbox — layout de **1 dimensión**

```css
nav ul {
  display: flex;                    /* activa el contexto flexible */
  gap: 1rem;                        /* separación entre ítems */
  justify-content: space-between;   /* alinea en el eje PRINCIPAL (horizontal) */
  align-items: center;              /* alinea en el eje CRUZADO (vertical) */
  flex-wrap: wrap;                  /* los ítems bajan si no entran */
  list-style: none;
}
```

### 🔑 Grid — layout de **2 dimensiones**

```css
.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
```

- **`repeat(auto-fill, ...)`**: calcula **automáticamente** cuántas columnas entran según el ancho.
- **`minmax(220px, 1fr)`**: cada tarjeta mide **mínimo 220px** y se expande hasta **1fr**.
- **Elimina la necesidad de escribir decenas de media queries.**

| Flexbox | Grid |
|---|---|
| **1 dimensión** (fila o columna) | **2 dimensiones** (filas y columnas a la vez) |
| Menús, barras, alinear ítems | Catálogos, grillas, layouts |

### Variables CSS y Media Queries

```css
:root {
  --color-primario: #003366;      /* variable */
  --espacio: 1rem;
}
.btn {
  background: var(--color-primario);
  padding: var(--espacio);
}

@media (max-width: 768px) {       /* responsive: pantallas de hasta 768px */
  nav ul { flex-direction: column; }
  .catalogo { grid-template-columns: 1fr; }
}
```

---

## 6. JavaScript

### Qué es

**Lenguaje interpretado que se ejecuta del lado del cliente y aporta COMPORTAMIENTO DINÁMICO e interactividad a la página.**

**Los 3 pilares:**
1. **Manipulación del DOM**
2. **Gestión de eventos** del usuario
3. **Consumo de servicios asincrónicos** (Fetch API)

### Ciclo de ejecución en el cliente

```
1. Parseo HTML  →  2. Carga del script (defer)  →  3. Se registran los event listeners  →  4. Fetch a la API y render
```

### Variables y funciones (ES6+)

```js
const IVA = 0.21;   // const: NO se reasigna
let total = 0;      // let: se reasigna

function calcularTotal(precio, cantidad) {                 // función tradicional
  return precio * cantidad * (1 + IVA);
}
const calcularTotalArrow = (precio, cantidad) => precio * cantidad * (1 + IVA);   // arrow function
```

### Manipulación del DOM

```js
const titulo = document.querySelector("h1");              // el PRIMER elemento que coincide
titulo.textContent = "Catálogo Actualizado";

const botones = document.querySelectorAll(".btn-agregar"); // TODOS los que coinciden
botones.forEach(btn => btn.classList.add("activo"));
```

### Eventos y `preventDefault()`

```js
const formContacto = document.querySelector("#form-contacto");
formContacto.addEventListener("submit", (e) => {
  e.preventDefault();   // evita que el formulario recargue la página
  console.log("Enviando formulario vía Fetch API...");
});
```

### Renderizado dinámico de listas

```js
const productos = [
  { id: 1, nombre: "Remera", precio: 5000 },
  { id: 2, nombre: "Zapatillas", precio: 25000 }
];

document.querySelector("#lista-productos").innerHTML = productos.map(p => `
  <article class="card" data-id="${p.id}">
    <h3>${p.nombre}</h3>
    <p>$${p.precio}</p>
    <button class="btn-agregar">Agregar</button>
  </article>
`).join("");
```

### Fetch con async/await

```js
async function cargarProductos() {
  try {
    const res = await fetch("/api/productos");
    if (!res.ok) throw new Error("Error HTTP " + res.status);
    const datos = await res.json();
    renderProductos(datos);
  } catch (err) {
    console.error("Fallo al conectar con Spring:", err);
  }
}
```

### Estructura recomendada de un sitio multipágina

```
mi-tienda/
├── index.html          # inicio
├── productos.html      # catálogo dinámico
├── contacto.html       # formulario
├── css/styles.css      # hoja compartida
├── js/app.js           # lógica y Fetch
└── img/logo.png
```

**Criterios:** separación estricta HTML / CSS / JS en carpetas · nombres en minúsculas y sin espacios · rutas relativas consistentes · se puede copiar directo a la carpeta `static` de Spring Boot.

### Flujo de trabajo (6 pasos)

```
1. HTML semántico → 2. CSS externo → 3. JS con defer → 4. Validación W3C → 5. Responsive → 6. Fetch REST
```

### Buenas prácticas globales

| Práctica | Detalle |
|---|---|
| **Separación de capas** | Nunca CSS inline ni eventos JS inline en las etiquetas |
| **Accesibilidad universal** | `alt`, labels asociados, navegación por teclado |
| **Validación doble capa** | HTML5 en el cliente y **siempre** en el backend |
| **Monitoreo con DevTools** | Revisar Console y Network para detectar 404 y fallos de fetch |

---

## 7. Thymeleaf

### Qué es

**Motor de plantillas del lado del servidor (server-side) para Java y Spring: combina una plantilla HTML estática con datos dinámicos del backend y entrega HTML estándar.**

- Corre en la **JVM**, no en el navegador.
- Es el motor **recomendado oficialmente** por Spring Boot; **reemplazo moderno de JSP**.
- **No agrega JavaScript** al cliente.

### ⚠️ Lo que NO es Thymeleaf

- **NO** es un framework cliente como React, Vue o Angular.
- **NO** administra el DOM del navegador en tiempo de ejecución.
- **NO** maneja eventos asíncronos sin librerías complementarias.
- **NO** requiere Node.js ni npm/Vite.

### 🔑 Plantillas naturales (*Natural Templates*)

**Los `.html` son HTML5 100% válido: se pueden abrir con doble clic en el navegador y se ven con texto de prototipo.** Los atributos `th:*` el navegador los ignora; en el servidor, Thymeleaf los procesa y reemplaza los valores de prueba por los reales.

```html
<h2 th:text="${producto.nombre}">Teclado Mecánico RGB (texto prototipo)</h2>
<p th:text="${producto.precio}">$150.00 (precio prototipo)</p>
```

> Facilita la colaboración entre diseñadores UI/UX y desarrolladores backend.

### Ciclo en Spring MVC (5 pasos)

| # | Paso | Qué pasa |
|---|---|---|
| 1 | **Petición HTTP** | `GET /productos` entra al `DispatcherServlet` |
| 2 | **Controlador** | El método con `@GetMapping` consulta al Service |
| 3 | **Modelo** | `model.addAttribute("productos", lista)` |
| 4 | **Motor Thymeleaf** | El controlador retorna `"productos/lista"`; Thymeleaf busca la plantilla |
| 5 | **HTML al navegador** | Fusiona plantilla + modelo y envía HTML puro en la respuesta |

### 🔑 Las 5 expresiones

| Expresión | Nombre | Para qué | Ejemplo |
|---|---|---|---|
| `${...}` | **Variable** | Atributos del Model | `${usuario.nombre}` |
| `*{...}` | **Selección** | Sobre el `th:object` activo | `th:field="*{precio}"` |
| `#{...}` | **Mensaje** (i18n) | Textos de `messages.properties` | `#{app.titulo.bienvenida}` |
| `@{...}` | **URL / enlace** | Rutas con contexto y parámetros | `@{/productos/{id}(id=${p.id})}` |
| `~{...}` | **Fragmento** | Incluir partes de otra plantilla | `~{fragmentos/nav :: navbar}` |

### 🔑 `th:text` vs `th:utext` (seguridad XSS)

| | `th:text` | `th:utext` |
|---|---|---|
| Escapa `<`, `>`, `&`, `"`, `'` | **Sí** | **No** |
| Con `<script>alert('XSS')</script>` | Lo muestra como **texto inofensivo** | **Ejecuta el script** |
| Uso | **Siempre** con datos dinámicos | Solo HTML interno de absoluta confianza |

> **Regla vital:** nunca `th:utext` con datos de usuarios o de la base sin sanitizar.

### Directivas

| Directiva | Qué hace |
|---|---|
| `th:if` | Renderiza si la condición es verdadera; si no, **el elemento no aparece en el HTML** |
| `th:unless` | Negación (*if not*) |
| `th:switch` / `th:case` | Múltiples ramas; `th:case="*"` es el default |
| `th:each="p, stat : ${productos}"` | Repite la etiqueta por cada elemento |
| `th:object` | Vincula el form con un objeto Java (*command object*) |
| `th:field="*{nombre}"` | Genera `id`, `name` y `value`; si hay error de `@Valid` repuebla el valor |
| `th:action="@{/productos}"` | Destino del form; incluye token CSRF si hay Spring Security |
| `th:fragment="nombre"` | Define un bloque reutilizable |
| `th:replace="~{archivo :: frag}"` | **Reemplaza** la etiqueta contenedora por el fragmento |
| `th:insert="~{archivo :: frag}"` | **Inserta** el fragmento **dentro** de la etiqueta |

**`IterationStatus`** (la segunda variable de `th:each`): `index` (desde 0), `count` (desde 1), `size`, `current`, `even` / `odd`.

```html
<tr th:each="p, stat : ${productos}" th:class="${stat.odd} ? 'fila-impar' : 'fila-par'">
  <td th:text="${stat.count}">1</td>
  <td th:text="${p.nombre}">Teclado</td>
</tr>
```

> **Los fragmentos son el eslabón clave para HTMX:** permiten que el backend devuelva solo un fragmento, sin la página completa.

### Configuración y carpetas

- Dependencia: **`spring-boot-starter-thymeleaf`**. Spring Boot configura el `ThymeleafViewResolver` solo.
- Prefijo por defecto `classpath:/templates/`, sufijo `.html`, UTF-8.

| Carpeta | Contenido | ¿Accesible por URL? |
|---|---|---|
| `src/main/resources/templates/` | Vistas procesadas | **No**: solo vía controlador |
| `templates/fragmentos/` | header, footer, nav, sub-vistas para HTMX | No |
| `src/main/resources/static/` | CSS, JS, imágenes, `htmx.min.js` | **Sí** |

**Caché:** `spring.thymeleaf.cache=false` en **desarrollo** (re-parsea en cada petición, ves los cambios al recargar) · `true` en **producción** (default; parsea una vez y deja la plantilla en memoria).

### Las 4 reglas

1. **Prototipado limpio:** texto de prototipo representativo, sin URLs absolutas con host.
2. **Seguridad estricta:** `th:text` siempre; auditar `th:utext`; validar con Bean Validation.
3. **Modularización atómica:** dividir en fragmentos (tablas, listas, modales).
4. **Lógica en el controlador:** la plantilla solo formatea y presenta.

---

## 8. HTMX

### Qué es

**Biblioteca de ~14 kB que extiende el HTML: permite hacer peticiones AJAX desde atributos HTML y actualizar partes del DOM sin recargar la página y sin escribir JavaScript.** Se lee "hache-te-eme-equis" (no "HTMLX"). Lema: ***"High Power Tools for HTML"***.

- Peticiones GET, POST, PUT, PATCH y DELETE desde **cualquier** elemento.
- El servidor sigue entregando **fragmentos HTML**.
- Soporta WebSockets y Server-Sent Events.
- **No hace falta escribir `fetch()`, `XMLHttpRequest` ni event listeners.**

### Las 4 limitaciones del HTML que rompe

| HTML tradicional | Con HTMX |
|---|---|
| Solo `<a>` y `<form>` hacen peticiones | **Cualquier** etiqueta (button, div, tr, input) |
| Solo eventos `click` y `submit` | `mouseover`, `keyup`, `change`, etc. |
| Solo GET y POST | También **PUT, PATCH y DELETE** |
| Se recarga la página entera | Se reemplaza **solo el fragmento** necesario |

### 🔑 HATEOAS

**Hypermedia As The Engine Of Application State: el estado y las transiciones posibles viajan dentro del propio HTML.**

- El cliente **no necesita conocer las reglas de negocio**. Si un usuario no puede borrar, el servidor **no incluye el botón**.
- **Sin serialización JSON:** SPA → `Servidor → JSON → cliente deserializa → JS arma el DOM`. HTMX → `Servidor → fragmento HTML → se inserta directo`.
- **Estado centralizado** en el servidor: menor superficie de ataque, cero duplicación de validaciones.

### Ciclo de vida (4 etapas)

```
1. Inclusión <script src="htmx.min.js">  →  2. Atributos hx-*  →  3. Disparo AJAX al ocurrir el evento  →  4. Swap del fragmento en el DOM
```

### 🔑 Verbos HTTP

| Atributo | Verbo | Uso REST |
|---|---|---|
| `hx-get` | GET | Recuperar sin mutar estado |
| `hx-post` | POST | Crear |
| `hx-put` | PUT | Reemplazo completo / actualización |
| `hx-patch` | PATCH | Modificación parcial |
| `hx-delete` | DELETE | Eliminar |

### 🔑 `hx-trigger` — cuándo se dispara

**Por defecto:**

| Elemento | Evento por defecto |
|---|---|
| `<input>`, `<textarea>`, `<select>` | **`change`** |
| `<form>` | **`submit`** |
| Cualquier otro (button, div, tr) | **`click`** |

**Modificadores:**

| Valor | Efecto |
|---|---|
| `mouseenter` | Al pasar el cursor |
| `load` | Al cargarse el elemento (*lazy loading*) |
| `changed` | Solo si el valor realmente cambió |
| `delay:500ms` | **Debounce**: espera 500ms de inactividad |
| `throttle:1s` | Como máximo una petición por segundo |
| `from:#otro` | Escucha eventos de otro elemento |
| `every 2s` | **Polling** cada 2 segundos |

### 🔑 `hx-target` — dónde va la respuesta

**Sin `hx-target`, la respuesta reemplaza al propio elemento que disparó la petición.**

| Valor | Apunta a |
|---|---|
| `#id` / `.clase` | Selector CSS |
| `this` | El elemento emisor |
| `closest tr` | El ancestro más cercano (borrar una fila) |
| `find <sel>` | El primer descendiente que coincida |
| `next <sel>` / `previous <sel>` | Hermano siguiente / anterior |

### 🔑 `hx-swap` — cómo se inserta

| Modo | Efecto | Caso típico |
|---|---|---|
| **`innerHTML`** (default) | Reemplaza el **contenido interno** del target | Actualizar tablas o listas |
| **`outerHTML`** | Reemplaza el target **completo**, con sus tags | Eliminar o reemplazar una fila |
| **`beforeend`** | Inserta **después del último hijo** | Agregar una fila al final |
| **`afterbegin`** | Inserta **antes del primer hijo** | Notificaciones tipo feed |
| **`beforebegin`** | Inserta **antes del target** | Paginación infinita, separadores |
| **`delete`** | **Elimina** el target sin insertar nada | Borrado limpio |

### Otros atributos

| Atributo | Qué hace |
|---|---|
| `hx-select="#tabla"` | De una respuesta que es página completa, **extrae solo** ese fragmento |
| `hx-include="#filtro"` | Incluye en la petición los valores de otros inputs |
| `hx-vals='{"categoria":"hardware"}'` | Agrega valores fijos (o dinámicos con `js:`) |
| `hx-headers='{"X-Token":"..."}'` | Agrega cabeceras HTTP (ej. CSRF de Spring Security) |
| `hx-confirm="¿Seguro?"` | Diálogo nativo; **si cancela, la petición no sale** |
| `hx-indicator="#spinner"` | Agrega la clase **`htmx-request`** durante la petición (spinners solo con CSS) |
| `hx-push-url="true"` | Actualiza la URL con `history.pushState()`: funciona el **botón Atrás** y se pueden compartir links |
| `hx-swap-oob="true"` | *Out-of-band swap*: actualiza **otro** elemento de la página con la misma respuesta |
| `hx-on::after-request="this.reset()"` | Limpia el formulario después del pedido |

> **El problema histórico de AJAX:** la URL no cambiaba y el botón "Atrás" expulsaba del sitio. Las SPA lo resolvieron con React Router; HTMX con `hx-push-url`.

### Los 4 patrones prácticos

```html
<!-- 1. CARGA CON BOTÓN -->
<button hx-get="/api/productos" hx-target="#lista-productos" hx-swap="innerHTML">Cargar</button>
<div id="lista-productos"></div>

<!-- 2. ALTA CON FORMULARIO: agrega la fila al final de la tabla -->
<form hx-post="/api/productos" hx-target="#cuerpo-tabla" hx-swap="beforeend"
      hx-on::after-request="this.reset()">
  <input type="text" name="nombre" required>
  <input type="number" step="0.01" name="precio" required>
  <button type="submit">+ Agregar</button>
</form>

<!-- 3. BORRADO CON CONFIRMACIÓN -->
<button hx-delete="/api/productos/101" hx-target="closest tr" hx-swap="outerHTML"
        hx-confirm="¿Confirma la eliminación?">Eliminar</button>

<!-- 4. BÚSQUEDA EN VIVO CON DEBOUNCE -->
<input type="text" name="q" hx-get="/api/productos/buscar"
       hx-trigger="keyup changed delay:500ms"
       hx-target="#resultados" hx-indicator="#spinner">
<span id="spinner" class="htmx-indicator">Buscando...</span>
```

> **Patrón 3:** si el servidor devuelve 200 con cuerpo vacío, la fila desaparece.
> **Patrón 4:** escribiendo "Teclado" (7 letras) sin delay se harían 7 peticiones; con `delay:500ms` se hace **una sola**. `changed` evita pedidos si se tocan flechas o Shift.

### El controlador para HTMX

```java
@Controller                                     // @Controller (devuelve vistas), no @RestController
@RequestMapping("/api/productos")
public class ProductoController {
    @GetMapping
    public String listar(Model model) {
        model.addAttribute("productos", service.listarTodos());
        return "fragmentos/lista-productos :: lista";   // 'plantilla :: fragmento' → renderiza SOLO ese bloque
    }
    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Long id, Model model) {
        service.eliminar(id);
        model.addAttribute("productos", service.listarTodos());
        return "fragmentos/lista-productos :: lista";
    }
}
```

---

## 9. React: qué es y por qué

### Qué es React

**Librería de JavaScript, creada por Meta (Facebook), para construir interfaces de usuario web y nativas basadas en componentes.** Se enfoca **exclusivamente en la capa de VISTA**. Código abierto desde 2013.

### ⚠️ Librería vs Framework

| | **Librería** (React, Meta) | **Framework** (Angular, Google) |
|---|---|---|
| Control | **Vos tenés el control** y la llamás | **Él tiene el control** y te impone la estructura |
| Metodología | Libertad en la forma de trabajar | Metodología estricta |

> **React NO es un framework.**

### ¿Por qué React? — los 4 problemas del desarrollo tradicional

| Problema (HTML + CSS + JS + Bootstrap) | Solución de React |
|---|---|
| **Mantenimiento complejo**: difícil escalar | **Componentización** |
| **Gestión manual del estado**: sincronizar datos con el DOM a mano (propenso a errores) | **Manejo automático del estado**: cambia el dato y se actualiza la UI |
| **Bajo rendimiento**: actualizar el DOM manualmente es costoso | **Virtual DOM**: solo modifica lo que cambió |
| **Código no reutilizable** | **Componentes reutilizables** (como piezas de Lego) |

> Alternativa moderna mencionada: **HTMX** para ciertos casos.

### React Web vs React Native

| React Web | React Native |
|---|---|
| Para **SPAs**: los componentes se renderizan en el navegador | Framework para apps **móviles nativas** (iOS/Android) con la misma sintaxis |

### El cambio de paradigma

| Enfoque clásico / jQuery | Paradigma React |
|---|---|
| El HTML define la estructura; JS **busca y modifica** el DOM existente (`$("#boton")`) | **JavaScript genera la interfaz**: componentes que devuelven la descripción visual |
| Mutaciones **imperativas** | **UI = f(Estado)**: React deduce qué actualizar |
| Estado disperso en muchos nodos | Estado en los componentes |

### 🔑 Declarativo vs Imperativo

- **Declarativo (React):** describe **QUÉ** debe pasar; oculta los detalles de bajo nivel.
- **Imperativo:** indica **CÓMO**, paso a paso (manipular el DOM línea por línea).

### 🔑 Virtual DOM y reconciliación

**El Virtual DOM es una copia ("foto") del DOM en memoria. React la compara con la versión anterior y modifica en el DOM real solo la parte necesaria.**

| # | Paso | Qué pasa |
|---|---|---|
| 1 | **Mutación de estado** | El usuario interactúa y se llama al setter |
| 2 | **Nuevo Virtual DOM** | React re-ejecuta el componente y arma un nuevo árbol en memoria |
| 3 | **Diffing** | Compara el VDOM nuevo con el anterior |
| 4 | **Reconciliación** | Aplica el **mínimo** de cambios al DOM real |

> Clave para sitios con miles de datos (ej. Mercado Libre).

### Arquitectura SPA

- El servidor entrega un **HTML base mínimo** + un **bundle de JS** grande.
- React toma el elemento raíz `<div id="root"></div>`.
- Necesita herramientas de compilación (Node, Babel, Vite, Webpack).
- Las transiciones de pantalla ocurren **sin recargar**.
- Se comunica con el backend por **APIs REST/GraphQL con JSON**.

### Ventajas finales

**Reutilización** (piezas de Lego) · **Mantenibilidad** (encapsulamiento, menos acoplamiento) · **Multiplataforma** (web, móvil, escritorio) · **Predictivo** (flujo de datos unidireccional padre → hijo).

---

## 10. Proyecto React: Node, npm y Vite

### Definiciones

| Herramienta | Definición |
|---|---|
| **Node.js** | **Entorno de ejecución que permite ejecutar JavaScript fuera del navegador.** React no lo necesita para funcionar en el navegador, pero lo usamos en el desarrollo para correr Vite, instalar dependencias y preparar el código |
| **npm** | **Gestor de paquetes de JavaScript/Node.js.** Se verifica con `npm -v` |
| **Vite** | **Herramienta de compilación y desarrollo frontend diseñada para acelerar la creación de apps web.** Ultrarrápida y con configuración mínima. **Reemplaza al antiguo Create React App** |
| **Bootstrap** | Librería CSS/JS para acelerar el diseño de la UI |

**Otros gestores de paquetes (comparativa):** Windows → `choco` · Linux → `apt` (Ubuntu), `dnf` (Fedora) · Java → `mvn` · Python → `pip`.

### Comandos

```bash
npm create vite@latest nombre-del-proyecto -- --template react   # crear
npm install                                                       # instalar dependencias
npm run dev                                                       # levantar → http://localhost:5173
```

### 🔑 Qué hace `npm install` (4 pasos)

| # | Paso | Qué hace |
|---|---|---|
| 1 | **Lee `package.json`** | El manifiesto con las dependencias |
| 2 | **Descarga** | Baja los paquetes del registro global de npm |
| 3 | **`node_modules`** | Crea la carpeta donde se instalan físicamente |
| 4 | **`package-lock.json`** | Registra las **versiones exactas** para que todo el equipo trabaje igual |

### `package.json`

| Sección | Propósito |
|---|---|
| **`dependencies`** | Necesarias **en producción** (`react`, `react-dom`) |
| **`devDependencies`** | **Solo para desarrollo** (`vite`, `eslint`, `prettier`) |

### Estructura de un proyecto

```
mi-app/
├── node_modules/      ← paquetes instalados
├── src/
│   ├── App.css
│   ├── App.jsx        ← componente principal
│   ├── index.css
│   ├── main.jsx       ← punto de entrada: monta <App> en #root
│   ├── components/    ← piezas reutilizables (ListaTareas, TareaItem)
│   └── pages/         ← una por pantalla (Tareas, AcercaDe)
├── index.html         ← tiene el <div id="root">
└── package.json
```

**Ruta de ejecución: `index.html` → `main.jsx` → `App.jsx`.**

### 🔑 HMR (Hot Module Replacement)

**Actualiza módulos sin recargar la página completa.** Cambios inmediatos y **mantiene el estado**: no se pierden los datos de formularios ni la navegación al editar.

---

## 11. Componentes, JSX, props y estado

### Los 4 pilares de React

| Pilar | Definición |
|---|---|
| **Componente** | **Función que devuelve un subárbol del DOM.** Unidad básica reutilizable; encapsula lógica y presentación; se componen en jerarquía padre-hijo |
| **JSX** | **Extensión de sintaxis similar a HTML dentro de JS.** Se traduce a `React.createElement` (Babel). Interpola expresiones con `{ }` |
| **Props** | **Propiedades recibidas del padre. SOLO LECTURA.** Parametrizan el componente y fluyen hacia abajo |
| **Estado** | **Datos PRIVADOS del componente que pueden cambiar.** Su actualización dispara un re-render. Se maneja con `useState` |

### JSX

**JavaScript XML: permite escribir código similar a HTML dentro de archivos JS. Un componente es una función JS que devuelve XML (js + xml = jsx).** El código se **transpila** a JS estándar. **Dentro de `{ }` se ejecuta JavaScript puro.**

```jsx
const nombre = "Ana";
return <h1>Hola, {nombre.toUpperCase()}</h1>;
```

### 🔑 Nomenclatura

| Estilo | Uso | Ejemplo |
|---|---|---|
| **PascalCase** | **Componentes React** | `UserDetail`, `ProductCard` |
| **camelCase** | Funciones JS / Java | `getUserByName()` |
| **snake_case** | Bases de datos | `user_id`, `order_date` |
| **kebab-case** | Clases CSS / URLs | `main-container` |

> **Los componentes van en PascalCase para no confundirse con las etiquetas HTML estándar.**

### 🔑 Componentes de clase vs funcionales

| | **De clase** (antes de React 16.8) | **Funcionales + Hooks** (16.8+) |
|---|---|---|
| Sintaxis | `class X extends React.Component` | Función que recibe props y devuelve JSX |
| Render | Método **obligatorio** `render()` | El `return` de la función |
| Estado | `this.state` en el constructor + `this.setState()` | `useState` |
| Contexto | `this` y `bind(this)` en los callbacks | No existe `this` |
| Ciclo de vida | `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` | `useEffect` |
| Hoy | Legado | **Estándar de la industria** |

```jsx
// DE CLASE (legado)
class Contador extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };                         // inicializa el estado
    this.incrementar = this.incrementar.bind(this);    // bind manual de this
  }
  incrementar() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return <button onClick={this.incrementar}>{this.state.count}</button>;
  }
}

// FUNCIONAL (moderno)
function Contador() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Ciclo de vida de las clases:**
- **`componentDidMount`**: se ejecuta **después de insertar** el componente en el DOM (llamadas a APIs).
- **`componentWillUnmount`**: **limpieza** de suscripciones y timers antes de destruirlo.

### 🔑 Props

**Mecanismo para pasar datos de un componente Padre a un componente Hijo.** Permiten que los componentes se comuniquen y sean reutilizables.

- Pueden enviar **texto, objetos o funciones**.
- **Son inmutables: el hijo no las puede modificar.**
- **`props.children`**: lo que va **entre las etiquetas** del componente (texto o elementos). Lo hace mucho más reutilizable.

```jsx
function Tarjeta({ titulo, children }) {
  return <section><h2>{titulo}</h2>{children}</section>;
}

<Tarjeta titulo="Ofertas"><p>Esto es children</p></Tarjeta>
```

### 🔑 Flujo de datos: props hacia abajo, callbacks hacia arriba

| **One-way data binding** (descendente) | **Comunicación ascendente** |
|---|---|
| El padre pasa datos al hijo por props | El padre le pasa una **función callback** por props |
| El hijo no las puede modificar | El hijo la **invoca** (ej. al hacer clic) |
| Siempre se sabe de dónde vienen los datos | La función se ejecuta **en el padre**, donde vive el estado |
| Evita efectos inesperados del two-way binding | **Elevación de estado** (*state lifting*): el padre actualiza y los datos vuelven a bajar |

```jsx
// PADRE: tiene el estado y la función
<ListaTareas tareas={tareas} onEliminar={eliminarTarea} />

// HIJO: recibe por props y avisa con el callback
function TareaItem({ tarea, onEliminar }) {
  return <button onClick={() => onEliminar(tarea.id)}>Eliminar</button>;
}
```

### Listas con `map()`

```jsx
function ListaTareas({ tareas }) {
  return (
    <section>
      <h2>Tareas ({tareas.length})</h2>
      {tareas.map(tarea => (
        <TareaItem key={tarea.id} tarea={tarea} />
      ))}
    </section>
  );
}
```

> **`key`** identifica cada elemento de la lista para que React actualice solo el que cambió. Se usa el id.

### Modularizar componentes (clase 14)

**Dividir la interfaz en piezas reutilizables e independientes, cada una con su propia lógica y presentación.**

**Ventajas:** reutilización · mantenibilidad (un cambio en un lugar se refleja en todas las instancias) · menos acoplamiento · encapsulamiento · coherencia visual · ahorro de tiempo.

**Ejemplo de la cátedra (TodoList):**

| Archivo | Tipo | Responsabilidad |
|---|---|---|
| `App.jsx` | Raíz | Configura la navegación con React Router: rutas y menú |
| `Tareas.jsx` | **Página** | Maneja el **estado** de las tareas; crea, completa y elimina; se comunica con la API REST |
| `AcercaDe.jsx` | **Página** | Describe el TP, tecnologías y conceptos aplicados |
| `ListaTareas.jsx` | **Componente** | Recibe la lista **por props**, usa `map()` para una tarjeta por tarea, muestra el total y "No hay tareas" |
| `TareaItem.jsx` | **Componente** | Una tarjeta: título, descripción, categoría y botones que llaman a **funciones recibidas por props** |

---

## 12. Hooks: useState y useEffect

### Qué es un Hook

**Funciones especiales de React que permiten agregar funcionalidades a los componentes funcionales, como manejar datos que cambian o ejecutar acciones cuando se carga una página.** Permiten "engancharse" a características internas de React.

- Presentados en la **React Conf 2018** (Sophie Alpert y Dan Abramov), disponibles desde **React 16.8**.
- **Sin breaking changes**: compatibilidad total hacia atrás.

**Beneficios:** eliminan la clase y el `this` · reutilizan lógica con **Custom Hooks** · agrupan el código relacionado en vez de partirlo en métodos del ciclo de vida · componentes más cortos y fáciles de testear.

### Los más usados

| Hook | Para qué |
|---|---|
| **`useState`** | Variables de estado local |
| **`useEffect`** | Efectos secundarios: APIs, timers, suscripciones |
| **`useContext`** | Acceder a un contexto global **sin prop drilling** |
| **`useRef`** | Referencias mutables directas a nodos del DOM |

### 🔑 Las 2 Reglas de Oro

| Regla | Detalle | Por qué |
|---|---|---|
| **1. Solo en el nivel superior** | **NUNCA** dentro de bucles, condicionales, funciones anidadas ni `try/catch` | React asocia el estado de cada hook por el **orden** en que se llaman. Si un hook queda en un `if`, el orden cambia en el siguiente render y la app colapsa |
| **2. Solo desde funciones de React** | Desde **componentes funcionales** (mayúscula, ej. `Contador()`) o **Custom Hooks** (prefijo `use`, ej. `useProductos()`). **NUNCA** desde funciones JS comunes, manejadores de eventos (`onClick={() => useState()}`) ni callbacks asíncronos | — |

> Existe el plugin oficial **`eslint-plugin-react-hooks`** que audita estas reglas.

### 🔑 useState

**Hook que permite añadir estado a un componente funcional. Guarda datos que pueden cambiar y, cuando cambian, React vuelve a dibujar el componente.**

```jsx
const [titulo, setTitulo] = useState('');
//      ↑         ↑                  ↑
//   valor     setter          valor inicial
```

| Parte | Qué es |
|---|---|
| `titulo` | Contiene el **valor actual** |
| `setTitulo` | **Función que actualiza** el valor y dispara el re-render |
| `useState('')` | **Inicializa** el estado (acá, con una cadena vacía) |

- **Devuelve un array de exactamente 2 elementos** → por eso se usa **desestructuración**.
- El estado **persiste entre renders**.
- **Cada componente mantiene su propio estado por separado.**

### Ciclo reactivo (5 pasos)

```
1. Clic → onClick llama a setCount(count + 1)
2. React re-ejecuta la función Contador(); useState devuelve el nuevo valor
3. Se arma un nuevo árbol JSX
4. Diffing: React detecta que solo cambió el nodo de texto
5. Actualiza solo ese nodo en el DOM real
```

### 🔑 useEffect

**Hook que permite ejecutar código como consecuencia del renderizado de un componente, por ejemplo para consultar una API, cargar datos o sincronizar con un servicio externo.** Se usa para el **ciclo de vida** del componente.

```jsx
useEffect(() => {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error('Error al obtener las tareas');
      return response.json();
    })
    .then(data => setTareas(data))
    .catch(error => console.error(error));
}, []);
```

| Array de dependencias | Cuándo se ejecuta |
|---|---|
| **`[]`** | **Una sola vez**, al montar (cargar datos al abrir la página) |
| **`[q]`** | Al montar y **cada vez que cambia `q`** |
| Sin array | Después de **cada** render |

**La función que retorna es la limpieza** (equivale a `componentWillUnmount`):

```jsx
useEffect(() => {
  const timer = setTimeout(() => buscar(q), 500);
  return () => clearTimeout(timer);   // limpia el timer anterior
}, [q]);
```

### Equivalencias con el ciclo de vida de las clases

| Clase | Hooks |
|---|---|
| `constructor` + `this.state` | `useState` |
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [dependencia])` |
| `componentWillUnmount` | `return () => {...}` dentro del `useEffect` |

---

## 13. Eventos, formularios y renderizado condicional

### 🔑 Eventos sintéticos

**React envuelve los eventos nativos del navegador en una interfaz `SyntheticEvent`, que garantiza el mismo comportamiento en todos los navegadores (Chrome, Safari, Firefox, Edge).**

| Regla | Ejemplo |
|---|---|
| **camelCase** | `onClick` (no `onclick`), `onChange`, `onSubmit` |
| Se pasa una **referencia**, NO una llamada | `{handleClick}` ✅ · `{handleClick()}` ❌ |
| `e.preventDefault()` | Cancela el comportamiento por defecto (que el form recargue la página) |

### Formulario en React

```jsx
function FormularioProducto({ onAgregar }) {
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();                         // evita la recarga
    if (!nombre.trim()) return;                 // valida
    onAgregar({ nombre: nombre, id: Date.now() });  // avisa al padre por callback
    setNombre('');                              // limpia el input
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nombre}                                  // el valor viene del estado
        onChange={(e) => setNombre(e.target.value)}     // cada tecla actualiza el estado
        placeholder="Nombre del producto"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
```

> **Campo controlado:** su valor vive en el estado (`value` + `onChange`). Cuando el usuario escribe, `setNombre` guarda el nuevo valor y React actualiza la interfaz.

### 🔑 Renderizado condicional

**Mostrar distintos elementos de la interfaz según se cumpla o no una condición.** Se implementa con **`if`**, el **operador ternario (`? :`)** o el **operador lógico (`&&`)**.

```jsx
// 1. if
if (cargando) return <p>Cargando...</p>;

// 2. ternario: una cosa u otra
{tareas.length === 0 ? <p>No hay tareas</p> : <Lista tareas={tareas} />}

// 3. &&: algo o nada
{tareas.length === 0 && <p>No hay tareas</p>}
```

**¿Cómo funciona en `ListaTareas.jsx`?** Si `tareas.length === 0` es verdadero, se muestra "No hay tareas"; si hay una o más, el mensaje no se muestra.

---

## 14. React Router y SPA

### Qué es una SPA

**Single Page Application: aplicación web que carga una única página HTML y actualiza su contenido dinámicamente según las acciones del usuario, sin recargar toda la página al navegar.**

### Qué es React Router

**Biblioteca que permite definir rutas y mostrar distintos componentes según la URL.** Con ella se implementa fácilmente una SPA en React.

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Tareas</Link>
        <Link to="/acerca">Acerca de</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Tareas />} />
        <Route path="/acerca" element={<AcercaDe />} />
      </Routes>
    </BrowserRouter>
  );
}
```

| Pieza | Para qué |
|---|---|
| `BrowserRouter` | Envuelve la app y habilita el enrutamiento |
| `Routes` | Contenedor de las rutas |
| `Route path element` | Asocia una URL con un componente |
| `Link to` | Navega **sin recargar** (en lugar de `<a href>`) |
| `path="*"` | Ruta comodín para una página 404 |

> `<a href>` **recarga** la página y pierde el estado; `Link` no.

---

## 15. Fetch y CORS

### Qué es fetch

**Función de JavaScript que permite realizar solicitudes HTTP para enviar y recibir datos de un servidor, por ejemplo para comunicarse con una API REST.**

### 🔑 Agregar tarea: los 7 pasos

```jsx
async function agregarTarea(event) {
  event.preventDefault();                                  // 1. evita que se recargue la página
  if (titulo.trim() === '') return;                        // 2. valida el título
  const nuevaTarea = { titulo, descripcion, tipo, completada: false };  // 3. prepara los datos

  const response = await fetch(API_URL, {                  // 4. envía al backend con fetch
    method: 'POST',                                        // 5. await espera la respuesta
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaTarea)
  });

  if (!response.ok) {                                      // 6. comprueba la respuesta
    console.error('Error al crear la tarea');
    return;
  }

  const tareaGuardada = await response.json();             // 7. actualiza la interfaz
  setTareas([...tareas, tareaGuardada]);                   //    y limpia el formulario
  setTitulo('');
}
```

> `response.json()` obtiene la tarea **devuelta por el backend**, que incluye el **ID generado por la base**. `setTareas([...tareas, tareaGuardada])` agrega esa tarea al estado y React actualiza la lista.

### Los otros pedidos del TodoList

```jsx
// UPDATE: cambiar estado de una tarea
const response = await fetch(`${API_URL}/${tarea.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...tarea, completada: !tarea.completada })
});
const actualizada = await response.json();
setTareas(tareas.map(item => item.id === actualizada.id ? actualizada : item));

// DELETE
await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
setTareas(tareas.filter(tarea => tarea.id !== id));
```

| Operación | Método | Body | Cómo se actualiza el estado |
|---|---|---|---|
| Listar | GET | No | `setTareas(data)` |
| Agregar | POST | Sí | `[...tareas, nueva]` |
| Modificar | PUT | Sí | `tareas.map(...)` |
| Eliminar | DELETE | No | `tareas.filter(...)` |

### 🔑 CORS

**Cross-Origin Resource Sharing: mecanismo de seguridad del navegador que controla qué sitios pueden hacer peticiones a un servidor.**

- **Vite corre en `localhost:5173` y Spring Boot en `localhost:8080`** → el navegador los considera **orígenes diferentes** y bloquea.
- **Los clientes que no son navegadores (Postman, curl, servidor a servidor) NO aplican CORS**: ignoran la restricción.
- **Solución:** registrar en el servidor Spring los clientes que pueden hacer peticiones (configuración de CORS).

```java
// CorsConfig.java del TodoList de la cátedra
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")                       // qué endpoints
                        .allowedOrigins("http://localhost:5173")     // qué cliente (Vite)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
```

---

## 16. Comparativa Thymeleaf vs HTMX vs React

### 🔑 Matriz global

| Criterio | **Thymeleaf** (SSR puro) | **Thymeleaf + HTMX** | **React** (SPA) |
|---|---|---|---|
| Paradigma | Renderizado en servidor (multi-página) | Server-Driven UI con hipermedia | SPA basada en componentes |
| Estado | 100% en el servidor | 100% en el servidor | **Distribuido** en el cliente |
| Payload de red | Páginas HTML completas | Fragmentos de ~1 a 3 kB | JSON liviano, tras un bundle inicial pesado |
| JS en el cliente | **0 kB** | **~14 kB** | **100 kB a 1+ MB** |
| Tooling | Ninguno (Maven/Gradle) | Ninguno (script CDN o static) | **Complejo**: Node, npm, Vite/Webpack, Babel |
| Caso ideal | Contenido, SEO, reportes, portales | **Gestión, CRUDs, B2B, intranets** | Apps ultra-interactivas, SaaS, diseño |

### Sobrecarga de red

| | Thymeleaf / HTMX | React |
|---|---|---|
| **Primera carga (FCP)** | Casi instantánea: llega HTML listo | Demorada: HTML vacío → bundle → parseo → recién arma el DOM |
| **Por petición** | HTML (300–1000 bytes) | JSON (50–200 bytes) |
| **Latencia** | Necesita ida y vuelta al servidor (`hx-indicator` la disimula) | Actualizaciones **optimistas** sin esperar la red |

> Con **gzip**, la diferencia HTML vs JSON es insignificante en sistemas de gestión.

### Gestión del estado

| Server-Driven (HTMX + Thymeleaf) | Client-Side (React) |
|---|---|
| Reglas, validaciones y permisos **en el backend** | Grafo de estado complejo en el navegador |
| **Imposible desincronizarse** con la base | Requiere sincronizadores y caché (React Query, Redux, Zustand) |
| Un solo lenguaje y ecosistema | **Duplica validaciones**: en React y en la API de Spring |
| Menos bugs de sincronización | Si falla la red a mitad de camino, puede quedar **inconsistente** |

### 🔑 Cuándo elegir cada una

| Si el sistema es... | Elegir | Ejemplos |
|---|---|---|
| **Documental / SEO** | **Thymeleaf puro** | Sitios institucionales, blogs, landings, reportes PDF |
| **Transaccional / B2B** | **Thymeleaf + HTMX** — *la opción más rentable para el 80% de las apps* | Backoffices, ERP, CRM, tablas con filtros, equipos backend Java |
| **App rica / productividad** | **React** | Editores, mapas, offline (PWA), drag-and-drop (Trello), dashboards financieros, equipos frontend dedicados |

### Mismo catálogo en React

Para hacer en React lo que HTMX resuelve con atributos se necesita: un `@RestController` que devuelva JSON, `useState` para productos y búsqueda, `useEffect` con `fetch`, un debounce manual con `setTimeout`, handlers que actualicen el array y un `map()` en el JSX. **Aproximadamente 4 veces más código de frontend.**

### 🔑 Los 5 principios de la cátedra

1. **Simplicidad primero:** no adoptar una SPA con React por inercia si se resuelve con Thymeleaf y HTMX.
2. **Soberanía del servidor:** centralizar reglas de negocio y validaciones en Spring Boot.
3. **Rendimiento consciente:** vigilar el tamaño de los bundles y la carga inicial.
4. **Seguridad sin concesiones:** escape automático (`th:text`) y tokens CSRF.
5. **La herramienta adecuada:** React para interfaces hiper-reactivas; HTMX para sistemas transaccionales y de gestión.

---

## 17. Banco de preguntas

### 17.1 Verdadero o Falso

| # | Afirmación | | Justificación de las falsas |
|---|---|---|---|
| 1 | HTML define la apariencia visual de la página | **F** | Define la **estructura y el contenido**; la apariencia es de CSS |
| 2 | Puede haber varios `<h1>` por página sin problema | **F** | **Uno solo** por página, para mantener la jerarquía |
| 3 | El atributo `alt` es obligatorio en las imágenes | **V** | |
| 4 | `rel="noopener"` es necesario al usar `target="_blank"` | **V** | |
| 5 | Las tablas se pueden usar para maquetar la página | **F** | Solo para **datos tabulares**; el layout se hace con Flexbox o Grid |
| 6 | La validación HTML5 en el cliente alcanza para garantizar la seguridad | **F** | Se evita modificando el DOM; **siempre se revalida en el backend** |
| 7 | Con `defer` el script se ejecuta después de parsear el DOM | **V** | |
| 8 | El estilo inline es el método recomendado para conectar CSS | **F** | Lo recomendado es la **hoja externa** compartida |
| 9 | Un selector de ID tiene más especificidad que uno de clase | **V** | |
| 10 | Flexbox gestiona filas y columnas al mismo tiempo | **F** | Flexbox es **unidimensional**; el bidimensional es **Grid** |
| 11 | Con `box-sizing: border-box` el width incluye padding y border | **V** | |
| 12 | `querySelector` devuelve todos los elementos que coinciden | **F** | Devuelve **el primero**; todos es `querySelectorAll` |
| 13 | Thymeleaf se ejecuta en el navegador del cliente | **F** | Se ejecuta en el **servidor** (JVM) |
| 14 | Las plantillas de Thymeleaf se pueden abrir en el navegador sin servidor | **V** | |
| 15 | `th:utext` escapa los caracteres HTML | **F** | **No escapa**: el que escapa es `th:text` |
| 16 | Los archivos de `templates/` son accesibles directamente por URL | **F** | Solo a través del controlador; los públicos van en `static/` |
| 17 | HTMX requiere escribir `fetch()` para hacer peticiones | **F** | Las hace desde **atributos HTML**, sin JS |
| 18 | En HTMX el servidor responde con fragmentos HTML | **V** | |
| 19 | Sin `hx-target`, la respuesta reemplaza al elemento que disparó la petición | **V** | |
| 20 | El `hx-swap` por defecto es `outerHTML` | **F** | Es **`innerHTML`** |
| 21 | Un `<form>` con HTMX se dispara por defecto con `click` | **F** | Con **`submit`**; los inputs con `change` y el resto con `click` |
| 22 | Si el usuario cancela un `hx-confirm`, la petición no se envía | **V** | |
| 23 | React es un framework | **F** | Es una **librería**; el framework es Angular |
| 24 | React se enfoca exclusivamente en la capa de vista | **V** | |
| 25 | Las props pueden ser modificadas por el componente hijo | **F** | Son **inmutables / de solo lectura** |
| 26 | Los componentes en React se nombran en camelCase | **F** | En **PascalCase**, para no confundirlos con etiquetas HTML |
| 27 | `useState` devuelve un array con el valor y la función para actualizarlo | **V** | |
| 28 | Los hooks se pueden llamar dentro de un `if` | **F** | Solo en el **nivel superior**: React los identifica por su orden |
| 29 | Los hooks se pueden usar en componentes de clase | **F** | Solo en **componentes funcionales** y **custom hooks** |
| 30 | `useEffect` con `[]` se ejecuta en cada render | **F** | Se ejecuta **una sola vez**, al montar |
| 31 | El Virtual DOM actualiza toda la página cuando cambia el estado | **F** | Compara y actualiza **solo lo que cambió** |
| 32 | React es declarativo | **V** | |
| 33 | Vite reemplaza al antiguo Create React App | **V** | |
| 34 | `devDependencies` son necesarias en producción | **F** | Son **solo para desarrollo**; las de producción son `dependencies` |
| 35 | React necesita Node.js para funcionar en el navegador | **F** | No: Node se usa **durante el desarrollo** (Vite, dependencias) |
| 36 | HMR pierde el estado de los formularios al guardar | **F** | **Mantiene** el estado |
| 37 | En React los eventos se escriben en camelCase | **V** | |
| 38 | `onClick={handleClick()}` pasa la función como referencia | **F** | La **ejecuta** al renderizar; la referencia es `onClick={handleClick}` |
| 39 | Una SPA recarga la página completa en cada navegación | **F** | Actualiza el contenido **sin recargar** |
| 40 | Postman aplica las restricciones de CORS | **F** | CORS es del **navegador**; Postman y curl lo ignoran |
| 41 | Vite (5173) y Spring (8080) en localhost son el mismo origen | **F** | El **puerto distinto** los hace orígenes diferentes |
| 42 | Una SPA de React tiene un FCP más rápido que Thymeleaf | **F** | Es al revés: React descarga y parsea el bundle antes de dibujar |
| 43 | En una arquitectura con React se duplican las validaciones | **V** | |
| 44 | Thymeleaf + HTMX es lo recomendado para sistemas de gestión y CRUDs | **V** | |
| 45 | `package-lock.json` registra las versiones exactas de las dependencias | **V** | |

### 17.2 Selección múltiple

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | HTML significa | **HyperText Markup Language** |
| 2 | CSS significa | **Cascading Style Sheets** |
| 3 | DOM significa | **Document Object Model** |
| 4 | SPA significa | **Single Page Application** |
| 5 | JSX significa | **JavaScript XML** |
| 6 | ¿Qué atributo de `<script>` espera a que se parsee el DOM? | **`defer`** |
| 7 | ¿Qué meta hace que la página se adapte al ancho del celular? | **`viewport`** |
| 8 | ¿Qué etiqueta representa el contenido central de la página? | **`<main>`** |
| 9 | ¿Qué etiqueta es una unidad de contenido independiente? | **`<article>`** |
| 10 | ¿Qué atributo del input es la clave con la que lo recibe el backend? | **`name`** |
| 11 | ¿Qué selector CSS tiene mayor especificidad? | **El estilo inline** |
| 12 | ¿Qué propiedad alinea en el eje principal de Flexbox? | **`justify-content`** |
| 13 | ¿Qué propiedad alinea en el eje cruzado de Flexbox? | **`align-items`** |
| 14 | ¿Qué capa del box model es el espacio interno? | **padding** |
| 15 | ¿Qué método evita que un form recargue la página? | **`e.preventDefault()`** |
| 16 | ¿Qué expresión de Thymeleaf accede a una variable del Model? | **`${...}`** |
| 17 | ¿Qué expresión de Thymeleaf resuelve URLs? | **`@{...}`** |
| 18 | ¿Qué expresión de Thymeleaf referencia un fragmento? | **`~{...}`** |
| 19 | ¿Qué directiva de Thymeleaf itera una colección? | **`th:each`** |
| 20 | ¿Cuánto pesa HTMX aproximadamente? | **~14 kB** |
| 21 | ¿Qué `hx-swap` agrega una fila al final de una tabla? | **`beforeend`** |
| 22 | ¿Qué `hx-target` apunta a la fila contenedora? | **`closest tr`** |
| 23 | ¿Qué atributo de HTMX actualiza la URL del navegador? | **`hx-push-url`** |
| 24 | ¿Qué atributo de HTMX muestra un spinner durante la petición? | **`hx-indicator`** |
| 25 | ¿Qué modificador de `hx-trigger` hace debounce? | **`delay:500ms`** |
| 26 | ¿Qué modificador de `hx-trigger` hace polling? | **`every 2s`** |
| 27 | HATEOAS significa | **Hypermedia As The Engine Of Application State** |
| 28 | ¿Quién creó React? | **Meta (Facebook)** |
| 29 | ¿Desde qué versión existen los Hooks? | **React 16.8** |
| 30 | ¿Qué hook maneja el estado local? | **`useState`** |
| 31 | ¿Qué hook se usa para pedir datos al back al cargar la página? | **`useEffect`** |
| 32 | ¿Qué hook evita el prop drilling? | **`useContext`** |
| 33 | ¿Qué hook da referencias directas al DOM? | **`useRef`** |
| 34 | ¿Qué método obligatorio tiene un componente de clase? | **`render()`** |
| 35 | ¿Qué método del ciclo de vida de clase se usaba para llamar a APIs? | **`componentDidMount`** |
| 36 | ¿Cuál es la ruta de ejecución de una app React con Vite? | **`index.html` → `main.jsx` → `App.jsx`** |
| 37 | ¿En qué puerto corre Vite por defecto? | **5173** |
| 38 | ¿Qué comando levanta el servidor de desarrollo? | **`npm run dev`** |
| 39 | ¿Qué librería se instala para la navegación? | **`react-router-dom`** |
| 40 | ¿Qué prop recibe lo que va entre las etiquetas de un componente? | **`children`** |
| 41 | ¿Con qué operadores se hace renderizado condicional? | **`if`, ternario `? :` y `&&`** |
| 42 | ¿Qué método de arrays se usa para renderizar una lista? | **`map()`** |
| 43 | ¿Qué tecnología es ideal para un sistema ERP o backoffice? | **Thymeleaf + HTMX** |
| 44 | ¿Qué tecnología es ideal para un editor tipo Figma o Trello? | **React** |

### 17.3 Desarrollo breve — respuestas modelo

**a) ¿Qué es React? ¿Es una librería o un framework?**
> React es una **librería de JavaScript** creada por Meta para construir interfaces de usuario basadas en **componentes reutilizables**. Se enfoca solo en la capa de vista y usa un Virtual DOM para actualizar eficientemente la pantalla. Es una **librería** porque el desarrollador tiene el control: la llama y decide la estructura. Angular, en cambio, es un **framework**: tiene el control e impone una metodología.

**b) ¿Qué es el Virtual DOM y cómo funciona?**
> Es una **copia del DOM en memoria**. Cuando cambia el estado, React re-ejecuta el componente y genera un nuevo Virtual DOM, lo **compara** con el anterior (*diffing*) y aplica en el DOM real **solo los cambios mínimos** (*reconciliación*). Así evita actualizar todo el HTML, que es costoso.

**c) Diferencia entre props y estado**
> Las **props** son datos que un componente **recibe de su padre**; son de **solo lectura** y fluyen hacia abajo. El **estado** son datos **privados** del componente que **pueden cambiar** con las acciones del usuario; se maneja con `useState` y al actualizarse provoca un nuevo renderizado.

**d) ¿Cómo modifica un hijo el estado del padre si las props son de solo lectura?**
> El padre le pasa por props una **función callback** (ej. `onEliminar`). Cuando el usuario actúa sobre el hijo, este la invoca. La función se ejecuta en el padre, que es donde vive el estado (**elevación de estado**); el padre lo actualiza y los nuevos datos vuelven a bajar por props.

**e) ¿Qué son los Hooks y cuáles son sus reglas?**
> Son funciones especiales (desde React 16.8) que permiten a los componentes funcionales manejar estado (`useState`), efectos (`useEffect`), contexto (`useContext`) y referencias (`useRef`). Reglas: **1)** llamarlos solo en el **nivel superior** del componente, nunca dentro de `if`, bucles o funciones anidadas, porque React los identifica por el **orden** de llamada; **2)** llamarlos solo desde **componentes funcionales** o **custom hooks**.

**f) Diferencia entre componentes de clase y funcionales**
> Los **de clase** extienden `React.Component`, necesitan un método `render()`, manejan el estado con `this.state` y `this.setState()` y el ciclo de vida con métodos como `componentDidMount`; obligan a usar `this` y `bind`. Los **funcionales** son funciones que reciben props y devuelven JSX; manejan estado y ciclo de vida con Hooks. Son más cortos, legibles y reutilizables, y son el estándar actual.

**g) ¿Para qué sirve `useEffect`? ¿Qué significa el array vacío?**
> Ejecuta código **como consecuencia del renderizado**: consultar una API, cargar datos, sincronizar con un servicio externo. El array de dependencias indica cuándo se repite: con **`[]` se ejecuta una sola vez** al montar el componente (ideal para traer los datos del backend al abrir la página); con `[x]`, cada vez que cambia `x`.

**h) ¿Qué es una SPA y cómo se implementa en React?**
> Es una aplicación que **carga una sola página HTML** y actualiza su contenido dinámicamente sin recargar al navegar. En React se implementa con **React Router**: `BrowserRouter` envuelve la app, `Routes`/`Route` asocian cada URL con un componente y `Link` navega sin recargar.

**i) ¿Qué es CORS? ¿Por qué aparece al conectar React con Spring?**
> Es un **mecanismo de seguridad del navegador** que controla qué sitios pueden hacer peticiones a un servidor. Aparece porque Vite corre en `localhost:5173` y Spring en `localhost:8080`: al tener **puertos distintos** son **orígenes diferentes**. Se resuelve registrando en Spring los orígenes permitidos. Postman o curl no lo sufren porque no son navegadores.

**j) ¿Qué es HTMX y qué diferencia tiene con React?**
> HTMX es una biblioteca de ~14 kB que permite hacer peticiones AJAX **desde atributos HTML** y reemplazar partes del DOM con **fragmentos HTML** que manda el servidor, sin escribir JavaScript. El **estado vive en el servidor**. React, en cambio, genera el HTML en el navegador, recibe **JSON** de una API y mantiene el **estado en el cliente**; necesita Node, npm y Vite, y duplica las validaciones.

**k) ¿Qué es HATEOAS?**
> *Hypermedia As The Engine Of Application State*: el **estado y las acciones posibles viajan dentro del HTML** que envía el servidor. El cliente no necesita conocer las reglas de negocio: si un usuario no puede borrar, el servidor directamente no incluye el botón. Elimina la serialización JSON y la duplicación de validaciones.

**l) ¿Qué son las plantillas naturales de Thymeleaf?**
> Son archivos HTML5 100% válidos que se pueden abrir en el navegador sin servidor y se ven con texto de prototipo, porque el navegador ignora los atributos `th:*`. Cuando Spring las procesa, Thymeleaf reemplaza ese texto con los datos reales del modelo. Facilitan el trabajo entre diseñadores y desarrolladores.

**m) Diferencia entre `th:text` y `th:utext`**
> `th:text` **escapa** los caracteres especiales de HTML: si un usuario ingresa un `<script>`, se muestra como texto inofensivo. `th:utext` **no escapa** y renderiza las etiquetas tal cual, por lo que puede ejecutar código malicioso (**XSS**). Solo debe usarse con HTML generado internamente y de confianza.

**n) ¿Cuándo elegirías Thymeleaf, Thymeleaf + HTMX o React?**
> **Thymeleaf puro** para sitios documentales o donde importa el SEO (institucionales, blogs, reportes). **Thymeleaf + HTMX** para sistemas transaccionales y de gestión (backoffices, ERP, CRM, CRUDs): es la opción más rentable para la mayoría de las apps. **React** para interfaces muy interactivas (editores, drag-and-drop, offline, dashboards en tiempo real) y con equipos frontend dedicados.

**ñ) ¿Por qué usar HTML semántico?**
> Por **accesibilidad** (los lectores de pantalla navegan por *landmarks*), **SEO** (los buscadores entienden la jerarquía), **mantenibilidad** (código legible) y **ahorro de CSS** (no hacen falta clases como `.header` o `.footer`).

**o) ¿Por qué no alcanza con validar en el frontend?**
> Porque la validación del cliente se puede evitar modificando el DOM o haciendo la petición directo a la API (por ejemplo con Postman). Sirve para dar **feedback inmediato** al usuario, pero **siempre** hay que volver a validar en el backend.

**p) ¿Qué ventajas tiene modularizar componentes?**
> Cada componente encapsula su lógica y presentación, se puede **reutilizar** en varias pantallas, un cambio se hace en **un solo lugar**, hay **menos acoplamiento** (se comunican solo por props y callbacks) y el código es más **legible y mantenible**.

**q) ¿Qué pasa al ejecutar `npm install`?**
> Lee el `package.json`, descarga los paquetes del registro de npm, los instala en `node_modules` y registra las versiones exactas en `package-lock.json` para que todo el equipo trabaje con lo mismo.

---

## 18. Ejercicios con snippets de código

### Ejercicio 1 — Encontrar los errores

```jsx
function contador() {
  if (activo) {
    const [count, setCount] = useState(0);
  }
  return <button onclick={setCount(count + 1)}>{count}</button>;
}
```

> 1. `contador` debe ir en **PascalCase**: `Contador`.
> 2. **`useState` dentro de un `if`**: rompe la regla del nivel superior.
> 3. `onclick` debe ser **`onClick`** (camelCase).
> 4. `onClick={setCount(count + 1)}` **ejecuta** la función al renderizar (loop infinito). Debe ser `onClick={() => setCount(count + 1)}`.

---

### Ejercicio 2 — Leer un useState

```jsx
const [titulo, setTitulo] = useState('');
<input value={titulo} onChange={e => setTitulo(e.target.value)} />
```

**a) ¿Qué contiene `titulo`?** El valor actual del campo.
**b) ¿Qué hace `setTitulo`?** Actualiza el valor y hace que React vuelva a dibujar el componente.
**c) ¿Con qué valor arranca?** Con una cadena vacía.
**d) ¿Qué pasa cuando el usuario escribe?** `onChange` llama a `setTitulo` con el texto nuevo y React actualiza la interfaz.

---

### Ejercicio 3 — ¿Por qué no se actualiza la lista?

```jsx
function agregar(nueva) {
  tareas.push(nueva);
  setTareas(tareas);
}
```

> Se **mutó** el array original y se le pasó la misma referencia: React no detecta el cambio. Hay que crear un array nuevo: `setTareas([...tareas, nueva])`.

---

### Ejercicio 4 — Completar el useEffect

Traer las tareas **una sola vez** al abrir la página:

```jsx
useEffect(() => {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => setTareas(data));
}, [ ___ ]);
```

> `[]` (array vacío).

---

### Ejercicio 5 — Renderizado condicional

Mostrar "No hay tareas" si la lista está vacía y la lista si no:

```jsx
{tareas.length === 0
  ? <p>No hay tareas</p>
  : tareas.map(t => <TareaItem key={t.id} tarea={t} />)}
```

---

### Ejercicio 6 — Props y callback

Completar para que el botón elimine la tarea del padre:

```jsx
// Padre
<TareaItem tarea={t} onEliminar={eliminarTarea} />

// Hijo
function TareaItem({ tarea, onEliminar }) {
  return (
    <article>
      <h3>{tarea.titulo}</h3>
      <button onClick={() => onEliminar(tarea.id)}>Eliminar</button>
    </article>
  );
}
```

---

### Ejercicio 7 — Pasar un componente de clase a funcional

```jsx
class Saludo extends Component {
  constructor(props) { super(props); this.state = { nombre: 'Ana' }; }
  render() { return <h1>Hola {this.state.nombre}</h1>; }
}
```

> ```jsx
> function Saludo() {
>   const [nombre, setNombre] = useState('Ana');
>   return <h1>Hola {nombre}</h1>;
> }
> ```

---

### Ejercicio 8 — Agregar con fetch (ordenar los pasos)

Ordená: *(a) actualizar el estado · (b) preventDefault · (c) fetch POST · (d) validar · (e) comprobar `response.ok` · (f) preparar los datos · (g) limpiar el form*

> **b → d → f → c → e → a → g**

---

### Ejercicio 9 — Rutas

Definir dos rutas: `/` muestra `Tareas` y `/acerca` muestra `AcercaDe`.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Tareas />} />
    <Route path="/acerca" element={<AcercaDe />} />
  </Routes>
</BrowserRouter>
```

---

### Ejercicio 10 — Leer HTMX

```html
<button hx-delete="/api/productos/42"
        hx-target="closest tr"
        hx-swap="outerHTML"
        hx-confirm="¿Eliminar?">Eliminar</button>
```

**a) ¿Qué petición hace?** `DELETE /api/productos/42`.
**b) ¿Qué pasa antes?** Muestra un diálogo de confirmación; si se cancela, no se envía nada.
**c) ¿Qué elemento se reemplaza?** La **fila** (`tr`) que contiene al botón, completa (`outerHTML`).
**d) ¿Qué pasa si el servidor responde 200 sin cuerpo?** La fila desaparece.

---

### Ejercicio 11 — Escribir HTMX

Un buscador que consulte `/api/productos/buscar` mientras se escribe, esperando 500ms y mostrando los resultados en `#resultados`:

```html
<input type="text" name="q"
       hx-get="/api/productos/buscar"
       hx-trigger="keyup changed delay:500ms"
       hx-target="#resultados">
<div id="resultados"></div>
```

---

### Ejercicio 12 — Leer Thymeleaf

```html
<tr th:each="p, stat : ${productos}">
  <td th:text="${stat.count}">1</td>
  <td th:text="${p.nombre}">Teclado</td>
</tr>
<p th:if="${#lists.isEmpty(productos)}">No hay productos.</p>
```

**a) ¿Qué hace `th:each`?** Repite el `<tr>` por cada producto.
**b) ¿Qué muestra `stat.count`?** El número de fila **empezando en 1** (`index` empieza en 0).
**c) ¿Qué se ve abriendo el archivo sin servidor?** "1" y "Teclado" (texto de prototipo).
**d) ¿Cuándo aparece el `<p>`?** Solo si la lista está vacía.

---

### Ejercicio 13 — Rutas relativas

Desde `producto/detalle.html`, completar:

| Recurso | Ruta |
|---|---|
| `index.html` | `../index.html` |
| `css/styles.css` | `../css/styles.css` |
| `img/logo.png` | `../img/logo.png` |

---

### Ejercicio 14 — Especificidad

```css
p { color: black; }
.texto { color: blue; }
#intro { color: red; }
```
```html
<p id="intro" class="texto">Hola</p>
```

> **Rojo.** El selector de ID (100) gana sobre la clase (10) y la etiqueta (1).

---

### Ejercicio 15 — Grid responsive

Hacer una grilla de tarjetas de mínimo 220px que acomode sola las columnas:

```css
.catalogo {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
```

---

## 19. Errores típicos y trampas

| ❌ Trampa | ✅ Realidad |
|---|---|
| "React es un framework" | Es una **librería** |
| "Las props se modifican en el hijo" | Son de **solo lectura**; se usa un callback |
| "Componente en camelCase" | **PascalCase** |
| "`onclick` en JSX" | **`onClick`** |
| "`onClick={f()}`" | `onClick={f}` o `onClick={() => f(x)}` |
| "Hook dentro de un `if`" | Solo en el **nivel superior** |
| "`useEffect([])` corre siempre" | Corre **una vez**, al montar |
| "Mutar el array y pasarlo al setter" | Crear uno nuevo: `[...arr, x]`, `filter`, `map` |
| "El Virtual DOM redibuja toda la página" | Solo lo que **cambió** |
| "Node es necesario para que React corra en el navegador" | Solo para **desarrollar** |
| "`<a href>` para navegar en una SPA" | **`Link`**: no recarga |
| "CORS es un error de Spring" | Es una restricción del **navegador** |
| "Postman tiene problemas de CORS" | No: **solo los navegadores** lo aplican |
| "`hx-swap` por defecto es `outerHTML`" | Es **`innerHTML`** |
| "HTMX manda JSON" | Manda y recibe **HTML** |
| "Thymeleaf corre en el navegador" | Corre en el **servidor** |
| "`th:utext` es más seguro" | Es al revés: **`th:text`** escapa |
| "Varios `<h1>` por página" | **Uno solo** |
| "Tablas para el layout" | Solo para **datos**; layout con Flexbox/Grid |
| "Flexbox es 2D" | Flexbox **1D**, Grid **2D** |
| "`async` y `defer` son iguales" | `defer` espera al DOM |
| "La validación del front alcanza" | **Siempre** revalidar en el backend |

---

## 20. Glosario relámpago

| Término | Definición |
|---|---|
| **DOM** | Árbol de nodos que arma el navegador a partir del HTML |
| **Semántica** | Usar cada etiqueta según su significado (`header`, `nav`, `main`...) |
| **Box model** | Content + padding + border + margin |
| **Especificidad** | Peso de un selector CSS: inline > id > clase > etiqueta |
| **Media query** | Regla CSS que aplica estilos según el tamaño de pantalla |
| **SSR** | El servidor arma el HTML |
| **SPA** | Una sola página que cambia su contenido sin recargar |
| **Plantilla natural** | HTML válido que se ve sin servidor (Thymeleaf) |
| **Fragmento** | Bloque parcial de HTML reutilizable |
| **Hipermedia** | HTML con enlaces y acciones que guían la aplicación |
| **HATEOAS** | El hipermedia como motor del estado |
| **Swap** | Forma en que HTMX inserta la respuesta |
| **Debounce** | Esperar a que el usuario deje de escribir antes de enviar |
| **Polling** | Consultar al servidor cada cierto tiempo |
| **Componente** | Función que devuelve JSX |
| **JSX** | HTML dentro de JavaScript |
| **Props** | Datos del padre al hijo, solo lectura |
| **Estado** | Datos propios que cambian y provocan re-render |
| **Hook** | Función de React que agrega estado o ciclo de vida a un componente funcional |
| **Custom Hook** | Hook propio con prefijo `use` para reutilizar lógica |
| **Virtual DOM** | Copia del DOM en memoria |
| **Diffing** | Comparar el Virtual DOM nuevo con el anterior |
| **Reconciliación** | Aplicar al DOM real solo los cambios mínimos |
| **Re-render** | Volver a ejecutar el componente cuando cambia su estado |
| **Elevación de estado** | Subir el estado al padre común |
| **Prop drilling** | Pasar props por muchos niveles para llegar a un componente lejano |
| **SyntheticEvent** | Envoltorio de React sobre los eventos nativos |
| **Renderizado condicional** | Mostrar algo según una condición (`if`, `? :`, `&&`) |
| **React Router** | Librería de rutas para SPAs |
| **Fetch** | Función de JS para hacer peticiones HTTP |
| **CORS** | Seguridad del navegador entre orígenes distintos |
| **Bundle** | Archivo JS final que descarga el navegador |
| **HMR** | Recarga de módulos en caliente sin perder estado |
| **npm** | Gestor de paquetes de JavaScript |
| **Vite** | Herramienta de desarrollo y build frontend |

---

## Mini-repaso final (leer 10 minutos antes)

1. **HTML** = estructura · **CSS** = presentación · **JS** = comportamiento.
2. **Un solo `h1`**, **`alt` obligatorio**, **`label for`**, **`rel="noopener"`** con `_blank`, **`defer`** en los scripts.
3. **Especificidad:** inline (1000) > id (100) > clase (10) > etiqueta (1).
4. **Flexbox = 1D**, **Grid = 2D**. `repeat(auto-fill, minmax(220px, 1fr))`.
5. **Validación del cliente = comodidad. Validación del servidor = seguridad.**
6. **Thymeleaf** = plantillas en el **servidor**; `th:text` escapa, `th:utext` no.
7. **HTMX** = AJAX desde atributos, responde **HTML**. Default: `innerHTML`; form → `submit`, input → `change`, resto → `click`.
8. **React** = **librería** de Meta para la vista. **Declarativo**. **Virtual DOM**.
9. **Componente** = función que devuelve JSX, en **PascalCase**.
10. **Props** bajan (solo lectura); **callbacks** suben.
11. **`useState`** → `[valor, setter]`. **`useEffect(..., [])`** → una vez al montar.
12. **Reglas de los Hooks:** nivel superior y solo desde funciones de React.
13. **SPA** con **React Router**: `BrowserRouter`, `Routes`, `Route`, `Link`.
14. **CORS**: 5173 ≠ 8080 → se configura en Spring. Postman no lo aplica.
15. **Elegir:** documental → Thymeleaf · gestión/CRUD → HTMX · app rica → React.
