# Front-end: guía para entenderlo y defenderlo

Está organizada según la **rúbrica del front** (8 criterios, 100 puntos).

## 1. Cómo está hecho

App **React 18** con **Vite** y **React Router**. Es una SPA: hay un solo `index.html` y React dibuja cada
pantalla según la ruta, sin recargar. No usa librerías de interfaz: el HTML y el CSS son propios.

```
src/
├── main.jsx          arranque: monta <App> con el router
├── App.jsx           estructura común: encabezado, rutas y pie
├── estilo.css        todos los estilos (variables, modo claro/oscuro, responsive)
├── paginas/          una por pantalla (ruta)
├── componentes/      piezas reutilizables: Campo, Tabla, Dialogo, Mensaje, Estado...
├── hooks/            estado reutilizable
│   ├── useDatos.js     carga datos y expone cargando / error / recargar
│   ├── useMensaje.js   mensaje de éxito o error, y "ejecutar" una acción
│   └── useTitulo.js    título de la pestaña
└── js/               lógica sin HTML
    ├── api.js          el único lugar que hace fetch
    ├── socios.js, clases.js, productos.js, empleados.js, compra.js
    ├── validaciones.js, formatos.js, membresias.js
```

| Capa | Qué hace | Dónde |
|---|---|---|
| Presentación | Estructura, textos y **método HTTP + URL de cada formulario** | `paginas/`, `componentes/` |
| Lógica | Consultas, filtros, formatos y validaciones | `js/` |
| Estado reutilizable | Cargando, error, datos y mensajes | `hooks/` |
| Estilos | Todo el aspecto visual | `estilo.css` |

## 2. Cómo se conecta con el back

```
Navegador → Vite (localhost:5173) → proxy /api → Spring Boot (localhost:8080) → MySQL
```

- Cada `<form>` declara su método y su URL: `method="post"` y `action="/api/socios"`. Como HTML solo admite
  GET y POST, PUT y DELETE se declaran con `data-metodo="PUT"` o `data-metodo="DELETE"`. `js/api.js` lee esos
  atributos y hace el `fetch`.
- **CORS:** el navegador bloquea pedidos entre orígenes distintos, y `:5173` y `:8080` lo son. Nosotros usamos el
  **proxy de Vite**: el navegador le pide todo a `:5173` y Vite reenvía `/api` al back, así que para el navegador
  es el mismo origen. La alternativa, la que se vio en clase con TodoList, es una clase `CorsConfig` en Spring.
  Si el front se publicara en un servidor propio, habría que usar esa.
- **Mover el servidor a otro equipo:** se cambia `BACKEND_URL` en el archivo `.env`, sin tocar el código.
- **Errores:** si el back responde con error, `api.js` toma el `detail` y se muestra en pantalla. Así el usuario ve
  el mismo mensaje que generó la regla de negocio en Java.

## 3. El flujo de compra

1. **Elegir producto:** `GET /api/productos?soloDisponibles=true`; se muestran los que tienen stock.
2. **Socio y pago:** `GET /api/socios` (solo activos). Se elige cantidad, socio y forma de pago. El total se calcula
   en el navegador. Hasta acá no se guardó nada.
3. **Confirmar:** un solo `POST /api/ventas`:
   ```json
   { "socioId": 2, "productoId": 4, "cantidad": 1, "pagada": true }
   ```
   `VentaService.registrar()` (con `@Transactional`) valida socio, producto y stock, descuenta el stock, suma la deuda
   si `pagada` es `false` y guarda la venta. Si falla una regla responde 409 y el front muestra el motivo.
4. **Comprobante:** se arma con la venta que devolvió el back (número, monto y fecha reales).

**Por qué un producto por compra:** en el back cada `Venta` es de un producto. Un carrito haría un POST por producto, y
si fallaba el segundo, el primero ya quedaba vendido. Con una sola venta, la operación es atómica.

La forma de pago (efectivo o transferencia) se muestra en el comprobante, pero el back solo guarda si quedó pagada o no.

## 4. Cómo cumple cada criterio de la rúbrica

| Criterio | Puntos | Cómo lo cumple |
|---|---|---|
| Modelo de negocio | 15 | Socios, empleados, clases con cupos, kiosco y deudas. Landing con servicios, planes y próximas clases |
| Estructura | 10 | Rutas claras y menú único. Páginas separadas de los componentes reutilizables |
| Semántica y accesibilidad | 15 | Un `h1` por pantalla, landmarks, `label` en todos los campos, errores con `aria-describedby`, `aria-live`, `<dialog>` nativo, "Saltar al contenido", foco visible |
| Diseño visual | 15 | Paleta en variables CSS, modo claro y oscuro, jerarquía visual, basado en el Figma |
| Adaptabilidad | 10 | Mobile first. El menú se pliega y las tablas pasan a tarjetas |
| Interacción | 15 | Búsquedas, filtros, orden, confirmaciones y respuesta visible en cada acción |
| Formularios y estados | 10 | Validación con mensajes claros junto al campo. Estados de carga, error con "Reintentar", vacío y éxito |
| Calidad técnica | 10 | Código modular, un solo lugar hace `fetch`, solo React y React Router |

Se verificó con un recorrido automático contra el back real, con axe (accesibilidad WCAG 2.1 AA, claro y oscuro, 375 a
1280 px) y sin desbordes horizontales.

## 5. Preguntas que pueden hacer

| Pregunta | Respuesta corta |
|---|---|
| ¿Qué es un hook? | Una función que le agrega capacidades a un componente. `useState` guarda datos que cambian y `useEffect` ejecuta código al renderizar, por ejemplo cargar datos |
| ¿Qué hace `useDatos`? | Es un hook propio: junta `useState` y `useEffect` para no repetir en cada página la carga de datos con sus estados |
| ¿Para qué es `useCallback`? | Mantiene la misma función entre renders. Sin eso, `useEffect` se volvería a ejecutar en cada render |
| ¿Qué son las props? | Datos que un componente recibe de su padre, por ejemplo `<Tabla titulo="..." />` |
| ¿Qué es una SPA? | Una página HTML cuyo contenido cambia sin recargar. React Router muestra un componente según la URL |
| ¿Por qué `noValidate` en los forms? | Para no mostrar el globo del navegador y poner el error junto al campo. La validación igual la hacen `required`, `pattern` y `min` |
| ¿Por qué `<dialog>`? | El navegador resuelve foco, Escape y accesibilidad, con menos código propio |
| ¿Validar en el front alcanza? | No. Es ayuda para el usuario; alguien puede llamar a la API directamente. Por eso el back también tiene que validar |
| ¿Cliente y empleado? | No hay login: un único usuario, el empleado del gimnasio, opera todo el sistema |
| ¿De dónde salen los precios de la landing? | Son contenido fijo en `js/membresias.js`. El back no guarda precios de membresía |

## 6. Pendientes conocidos del back

- Productos: no valida nombre vacío ni precio negativo. El front lo bloquea, pero Postman no.
- Socios y empleados: editar con un email repetido da error 500 en vez de 409.
- Empleados: la contraseña se guarda sin cifrar.
