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
| `/socios` | Alta, listado con búsqueda y filtro, detalle, edición, baja, reactivación y pago de deuda |
| `/empleados` | Alta, listado, detalle, edición y baja |
| `/clases` | Alta, agenda con cupos, edición, cancelación e inscripción de socios |
| `/productos` | Alta, catálogo con búsqueda y orden, detalle, edición y borrado |
| `/compra` | Flujo de compra: producto → socio y pago → comprobante |
| `/acerca` | La compañía, los integrantes y las tecnologías |
| `/politicas` | Políticas de seguridad y privacidad, con enlace al sitio oficial (AAIP) |

## Integrantes

Ezequiel Ibarra, Lucas Bollini, Matias Peralta e Ignacio Barborini.
