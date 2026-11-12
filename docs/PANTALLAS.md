# Lo que ves en pantalla → dónde está en el código

Para cuando el profe señala algo y pregunta **"¿dónde está esto en el código?"**. Está ordenado por pantalla. Cada
fila dice qué ves, en qué archivo y línea está, y qué hace al tocarlo.

**Cómo llegar rápido:** **Ctrl + P** y el nombre del archivo (por ejemplo `Compra`), después **Ctrl + G** y el número
de línea. Las líneas son de la versión actual. Si algo se movió, busca el texto del botón con **Ctrl + Shift + F**.

---

## Cómo seguir el hilo de cualquier botón

Todos los botones funcionan igual. Si te preguntan "¿qué pasa cuando toco esto?", sigue esta cadena:

```
1. El botón en el JSX            →  onClick={...}  o  type="submit" dentro de un <form onSubmit={...}>
2. La función de la página       →  alta, modificar, borrar, confirmar...
3. ejecutar(...) de useMensaje   →  muestra el mensaje de éxito o de error
4. enviar(form) de js/api.js     →  arma el JSON y hace el fetch con el method y action del form
5. El back (Spring)              →  responde con datos o con un error
```

Ejemplo con el botón **"Borrar"** de Productos (`paginas/Productos.jsx`):

```jsx
// línea 174: el formulario de cada fila declara el método y la URL
<form method="post" data-metodo="DELETE" action={"/api/productos/" + p.id} onSubmit={(e) => borrar(e, p)}>
  <button type="submit" className="peligro">Borrar...</button>      {/* línea 175 */}
</form>

// línea 95: la función que se ejecuta al tocarlo
function borrar(e, producto) {
  e.preventDefault();
  if (!window.confirm("¿Borrar el producto " + producto.nombre + "?")) return;
  ejecutar(() => enviar(e.currentTarget), "Producto borrado.", recargar);
}
```

Al tocar "Borrar": pregunta si estás seguro → `DELETE /api/productos/{id}` → muestra "Producto borrado." → recarga la
lista.

---

## En todas las pantallas

| Lo que ves | Dónde | Qué hace |
|---|---|---|
| "Saltar al contenido" (aparece con el primer Tab) | `App.jsx:32` | Salta el menú y va directo al contenido |
| "Gimnasio de Barrio" (arriba a la izquierda) | `componentes/Encabezado.jsx:22` | Enlace al inicio |
| **El menú** (Inicio, Socios, Empleados...) | `componentes/Encabezado.jsx:4-12` (la lista `ENLACES`) y `:37` (el `NavLink`) | Navega sin recargar. Para agregar una página al menú, se suma una línea a `ENLACES` |
| Botón "Menú" (solo en celular) | `componentes/Encabezado.jsx:24` | Abre y cierra el menú (`useState abierto`) |
| Qué página se muestra según la URL | `App.jsx:37-47` (las `<Route>`) | `/socios` → `<Socios />`, etc. |
| **Pie:** "Políticas de seguridad y privacidad" | `componentes/Pie.jsx:9` | Va a `/politicas` |
| **Pie:** "Acerca de" | `componentes/Pie.jsx:12` | Va a `/acerca` |
| Mensaje verde o rojo arriba de la página | `componentes/Mensaje.jsx` (lo usa cada página) | Resultado de la última acción |
| "Cargando..." / error con **Reintentar** / "No hay..." | `componentes/Estado.jsx` (Reintentar en la línea 19) | Los estados de cada lista |
| El texto rojo debajo de un campo con error | `componentes/Campo.jsx:47` | El mensaje de validación de ese campo |

---

## Inicio (`/` → `paginas/Inicio.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Título "Gimnasio de Barrio" | 33 | El `h1` de la portada |
| Botón **"Ver clases"** | 36 | `<Link to="/clases">`: va a Clases |
| Botón **"Comprar en el kiosco"** | 39 | `<Link to="/compra">`: va a Comprar |
| Tarjetas "Qué ofrecemos" | 49 | Se dibujan con `.map()` sobre la lista `SERVICIOS` (línea 9) |
| Tarjetas "Planes de membresía" con precio | 62 | Salen de `MEMBRESIAS` en `js/membresias.js` |
| Tarjetas "Próximas clases" | 82 | Vienen del back (`GET /api/clases`). Se filtran y ordenan en las líneas 25-28 |
| Etiqueta "N lugares libres" / "Sin cupo" | 87 | Usa `textoCupos()` (línea 15) |
| Enlace "Ver todas las clases" | 95 | Va a Clases |

---

## Socios (`/socios` → `paginas/Socios.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Formulario **"Alta de socio"** | 103 | `POST /api/socios`. Llama a `alta()` (línea 55) |
| Los campos DNI, Nombre, Apellido... | `componentes/CamposSocio.jsx` | Los mismos campos sirven para el alta y la edición |
| Casilla "El socio aceptó las políticas" | 108 | Obligatoria. Su enlace abre Políticas en otra pestaña (línea 110) |
| Botón **"Dar de alta"** (del formulario) | 115 | Envía el formulario |
| "Buscar por nombre o DNI" y "Mostrar" | 123-140 | Filtran en el navegador, sin pedir al back (`filtrarSocios` en `js/socios.js`) |
| La tabla de socios | 155 | `<Tabla>` con una fila por socio |
| Etiqueta "Activo" / "Baja" | 162 | Verde o roja según `s.activo` |
| Botón **"Ver"** | 169 | `verDetalle()` → `GET /api/socios/{id}` → abre el modal (línea 213) |
| Botón **"Editar"** | 172 | `abrirEdicion()` → abre el modal de edición (línea 221) → `PUT /api/socios/{id}` |
| Botón **"Pagar deuda"** (solo si debe) | 176 | `abrirPago()` → modal (línea 237) con `FormPago` (línea 244) → `POST /api/pagos` |
| Botón **"Baja"** (socio activo) | 189 | Form con `data-metodo="DELETE"` (línea 185) → `DELETE /api/socios/{id}` |
| Botón **"Dar de alta"** (socio dado de baja) | 201 | Form con `data-metodo="PUT"` (línea 197) → `PUT /api/socios/{id}/reactivar` |
| Botón "Guardar cambios" del modal | 227 | Llama a `modificar()` (línea 65) |

---

## Empleados (`/empleados` → `paginas/Empleados.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Formulario **"Alta de empleado"** | 143 | `POST /api/empleados`. Llama a `alta()` (línea 102) |
| Los campos | 17-86 (`CamposEmpleado`) | Usuario y contraseña solo en el alta (`conCredenciales`) |
| Botón **"Dar de alta"** | 148 | Envía el formulario |
| Botón **"Actualizar listado"** | 155 | Vuelve a pedir la lista (`recargar`) |
| La tabla de empleados | 160 | Una fila por empleado |
| Botón **"Ver"** | 174 | `GET /api/empleados/{id}` → modal de detalle (línea 195) |
| Botón **"Editar"** | 177 | Modal de edición (línea 203) → `PUT /api/empleados/{id}` |
| Botón **"Baja"** (solo activos) | 183 | Form con `data-metodo="DELETE"` (línea 182) → `DELETE /api/empleados/{id}` |

---

## Clases (`/clases` → `paginas/Clases.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Formulario **"Nueva clase"** | 136 | `POST /api/clases`. Llama a `alta()` (línea 102) |
| Los campos Actividad, Día y horario, Capacidad, Instructor | 17-79 (`CamposClase`) | Fecha futura y dentro de 2 años (líneas 42-43). Capacidad no menor a los inscriptos (línea 54) |
| Desplegable "Instructor" | 61-76 | Los empleados activos (`listarInstructores` en `js/clases.js`) |
| Botón **"Crear clase"** | 141 | Envía el formulario |
| Filtros (buscar, Mostrar, "Solo con lugares libres") | 148-178 | Filtran en el navegador (`filtrarClases`) |
| La tabla de clases | 187 | Una fila por clase |
| Etiqueta de cupos ("3 de 20 libres" / "Sin cupo") | 194 | Verde o roja según `cuposDisponibles`, que calcula el back |
| Etiqueta "Activa" / "Cancelada" | 199 | Según `c.activa` |
| Botón **"Inscriptos"** | 202 | Abre el modal de inscriptos (línea 241) |
| Botón **"Editar"** | 207 | Modal de edición (línea 226) → `PUT /api/clases/{id}` |
| Botón **"Cancelar"** (la clase) | 212 | Form con `data-metodo="DELETE"` (línea 211) → `DELETE /api/clases/{id}` |

**Adentro del modal de inscriptos** (`componentes/InscriptosClase.jsx`):

| Lo que ves | Línea | Qué hace |
|---|---|---|
| "N de M lugares libres" | 47 | Los cupos actualizados de la clase |
| Desplegable "Socio a inscribir" | 54 | Los socios activos |
| Botón **"Inscribir"** | 69 | `POST /api/inscripciones`. **Se deshabilita si la clase está llena o cancelada** |
| La tabla de inscriptos | 83 | Las inscripciones activas |
| Botón **"Cancelar"** (la inscripción) | 91 | Form con `data-metodo="DELETE"` (línea 90) → `DELETE /api/inscripciones/{id}` |

---

## Productos (`/productos` → `paginas/Productos.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Formulario **"Nuevo producto"** | 117 | `POST /api/productos`. Llama a `alta()` (línea 76) |
| Los campos Nombre, Precio, Stock | 17-57 (`CamposProducto`) | Con topes: precio hasta $10.000.000, stock hasta 100.000 |
| Botón **"Agregar producto"** | 122 | Envía el formulario |
| "Buscar producto", "Stock", "Ordenar por" | 129-145 | Filtran y ordenan en el navegador (`filtrarProductos`) |
| La tabla de productos | 156 | Una fila por producto |
| Etiqueta "N unidades" / "Agotado" | 163 | Verde o roja según el stock |
| Botón **"Ver"** | 167 | `verDetalle()` → `GET /api/productos/{id}` → modal (línea 186) |
| Botón **"Editar"** | 170 | Modal de edición (línea 194) → `PUT /api/productos/{id}` |
| Botón **"Borrar"** | 175 | Form con `data-metodo="DELETE"` (línea 174) → `DELETE /api/productos/{id}` |

---

## Comprar (`/compra` → `paginas/Compra.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Los pasos "1. Elegir producto, 2. Socio y pago, 3. Comprobante" | 84 | Resalta el paso actual. El paso se calcula en la línea 42 |
| **Paso 1:** tarjetas de productos con stock | 105 | Solo los que tienen stock (línea 38) |
| Botón **"Comprar"** de cada tarjeta | 109 | `elegir(p.id)` (línea 44): guarda el producto y pasa al paso 2 |
| **Paso 2:** título con el nombre del producto | 121 | El producto elegido |
| Formulario de compra | 133 | Al enviarlo llama a `confirmar()` (línea 59) |
| Campo "Cantidad" | 137 | Entre 1 y el stock disponible |
| Desplegable "Socio" | 149 | Los socios activos |
| Opciones de forma de pago | 169 | Efectivo, Transferencia o "Anotar en la cuenta del socio" (`FORMAS_DE_PAGO` en `js/compra.js`) |
| "Total: $ ..." | 175 | Se calcula en la línea 41 y se actualiza mientras escribís |
| Botón **"Volver"** | 179 | `reiniciar()`: vuelve al paso 1 |
| Botón **"Confirmar compra"** | 182 | Envía el formulario → **un solo `POST /api/ventas`** (líneas 66-72). Mientras espera dice "Procesando..." |
| **Paso 3:** "Compra realizada" | 193 | — |
| El comprobante | 197 | `componentes/Ticket.jsx`, con los datos que devolvió el back |
| Botón **"Hacer otra compra"** | 199 | `reiniciar()`: vuelve al paso 1 limpio |
| Botón **"Imprimir comprobante"** | 202 | `window.print()`. El CSS de impresión oculta el menú y los botones |

---

## Acerca de (`/acerca` → `paginas/Acerca.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| "La compañía" | 18 | Texto fijo |
| Enlace a las políticas | 27 | Va a `/politicas` |
| Tarjetas de integrantes con iniciales | 32 en adelante | `.map()` sobre `INTEGRANTES` (línea 4) |
| "Tecnologías" | 46 | Texto fijo |

## Políticas (`/politicas` → `paginas/Politicas.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| Las secciones (qué datos, para qué, cómo los cuidamos, derechos) | 19, 32, 41, 51 | Texto fijo, cada una en su `<section>` |
| **Enlace a la AAIP** (sitio oficial, externo) | 55 | Abre en otra pestaña con `rel="noopener noreferrer"`. La URL está en la línea 4 |
| "Volver al inicio" | 65 | Va a `/` |

## Página no encontrada (cualquier URL que no exista → `paginas/NoEncontrada.jsx`)

| Lo que ves | Línea | Qué hace |
|---|---|---|
| "Página no encontrada" y enlace al inicio | 8-9 | La muestra la ruta `path="*"` de `App.jsx:46` |

---

## Preguntas típicas, ya respondidas

| "¿Dónde está...?" | Respuesta |
|---|---|
| ...el botón para ir a Socios (o a cualquier página)? | En el menú: `componentes/Encabezado.jsx`, lista `ENLACES` (líneas 4-12) |
| ...el botón para comprar? | `paginas/Compra.jsx:109` ("Comprar" de cada tarjeta) y `:182` ("Confirmar compra") |
| ...dónde se registra la venta? | `paginas/Compra.jsx:72` → `POST /api/ventas` |
| ...dónde se da de alta un socio? | `paginas/Socios.jsx:103` (el formulario) y `:55` (la función `alta`) |
| ...dónde se borra un producto? | `paginas/Productos.jsx:174` (el form) y `:95` (la función `borrar`) |
| ...dónde se inscribe a una clase? | `componentes/InscriptosClase.jsx:52` (el form) y `:28` (la función `inscribir`) |
| ...dónde se valida el DNI? | `js/validaciones.js:7` (`PATRON_DNI`), usado en `componentes/CamposSocio.jsx` |
| ...dónde se muestra un error de validación? | `componentes/Campo.jsx` (la función `alInvalido`, línea 12) |
| ...dónde se llama al back? | `js/api.js`, la función `pedir` (línea 50) |
| ...el enlace a las políticas? | `componentes/Pie.jsx:9` (en todas las páginas) |
| ...dónde se define qué página se ve en cada URL? | `App.jsx:37-47` |
| ...dónde están los colores? | `estilo.css`, al principio (`:root`) |
