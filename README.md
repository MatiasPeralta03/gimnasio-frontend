# Front-end - Gimnasio de Barrio

Sitio multipagina con **HTML5, CSS y JavaScript** (sin frameworks ni recursos externos).

## Como levantarlo
1. Levantar el backend (en la raiz del proyecto): `.\mvnw.cmd spring-boot:run` (puerto 8080).
2. En otra terminal, dentro de `frontend/`:
   ```
   node servidor.js
   ```
3. Abrir http://localhost:5173

`servidor.js` sirve estos archivos y redirige `/api` al backend, asi no hace falta configurar CORS.
Solo requiere Node.js (no hay que instalar dependencias).

## Estructura
```
frontend/
├── index.html, socios.html, productos.html, compra.html, acerca.html
├── css/styles.css      # hoja de estilos compartida por todas las paginas
├── js/api.js           # funciones comunes: fetch, mensajes, formularios
├── js/socios.js        # logica de la pagina de socios
├── js/productos.js     # logica de la pagina de productos
├── js/compra.js        # logica del flujo de compra (simulacion)
└── servidor.js         # servidor de desarrollo + proxy a /api
```

## Como esta hecho
- **El HTML declara** los metodos HTTP (`method="post"`, `data-metodo="PUT"` / `"DELETE"` porque HTML
  solo admite GET y POST), las URLs (`action`) y los mensajes que se muestran (`data-ok`, `data-confirmar`).
- **El JS ejecuta**: `api.js` lee esos atributos y hace el `fetch`; cada pagina arma sus tablas y conecta
  los formularios. Los scripts se cargan con `defer`.
- Las etiquetas son semanticas: `header`, `nav`, `main`, `section`, `table` con `caption` y `th scope`,
  `fieldset`/`legend`, `label for`.
