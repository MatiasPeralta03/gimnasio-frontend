# Gimnasio de Barrio — Front-end

Interfaz web del TPO de Aplicaciones Interactivas (UADE). Es una app **React** (con Vite y React Router)
que consume la API REST del back-end en Spring Boot, que está en otro repositorio:
[aplicaciones-interactivas](https://github.com/MatiasPeralta03/aplicaciones-interactivas).

- Cómo está hecho y cómo cumple la rúbrica: [docs/FRONTEND.md](docs/FRONTEND.md).
- Preparación para la defensa (qué hace cada archivo, guion de la demo, preguntas): [docs/DEFENSA.md](docs/DEFENSA.md).

## Cómo levantarlo

Necesita **Node.js 20** o superior y el back-end corriendo en el puerto 8080.

```bash
npm install
npm run dev
```

Abrir **http://localhost:5173**.

Para apuntar a un back-end en otro equipo, copiar `.env.example` como `.env` y cambiar `BACKEND_URL`.

## Pantallas

| Ruta | Qué hace |
|---|---|
| `/` | Presentación del gimnasio, planes y próximas clases |
| `/login` | Inicio de sesión (usuario y contraseña) |
| `/socios` | Alta, listado con búsqueda y filtro, detalle, edición, baja, reactivación y pago de deuda |
| `/empleados` | Alta, listado, detalle, edición y baja |
| `/clases` | Alta, agenda con cupos, edición, cancelación e inscripción de socios |
| `/productos` | Alta, catálogo con búsqueda y orden, detalle, edición y borrado |
| `/ventas` | Gestión de ventas del kiosco: cargar producto → socio y pago → comprobante, y listado de ventas registradas |
| `/acerca` | La compañía, los integrantes y las tecnologías |
| `/politicas` | Políticas de seguridad y privacidad, con enlace al sitio oficial (AAIP) |

## Login y roles

Las pantallas de gestión (Socios, Clases, Productos y Ventas) piden iniciar sesión. **Empleados** es solo
para el rol **ADMIN**: un usuario con rol **EMPLEADO** no ve el enlace en el menú y, si escribe la URL,
ve un aviso de "sin permiso". Inicio, Acerca de y Políticas son públicas.

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `empleado` | `empleado123` | EMPLEADO |

Es una **simulación del lado del front** (`src/js/sesion.js`): el back no tiene endpoint de login y no
devuelve contraseñas, así que los usuarios de prueba están en el código y la sesión se guarda en
`sessionStorage` (se borra al cerrar la pestaña). En un sistema real el back valida las credenciales y
devuelve un token, y también controla los permisos en cada endpoint.

## Integrantes

Ezequiel Ibarra, Lucas Bollini, Matias Peralta e Ignacio Barborini.
