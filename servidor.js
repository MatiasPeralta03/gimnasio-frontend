/*
 * Servidor de desarrollo del front (solo necesita Node.js, sin instalar nada).
 *  - Sirve los archivos estaticos de esta carpeta (html, css, js).
 *  - Redirige todo lo que empiece con /api al backend Spring (puerto 8080),
 *    asi el front y la API quedan en el mismo origen y no hace falta configurar CORS.
 *
 * Uso:  node servidor.js     ->  http://localhost:5173
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PUERTO = 5173;
const BACKEND = { host: "localhost", port: 8080 };
const TIPOS = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
};

http
    .createServer((req, res) => {
        if (req.url.startsWith("/api")) {
            const proxy = http.request(
                { ...BACKEND, path: req.url, method: req.method, headers: req.headers },
                (respuesta) => {
                    res.writeHead(respuesta.statusCode, respuesta.headers);
                    respuesta.pipe(res);
                }
            );
            proxy.on("error", () => {
                res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Backend no disponible");
            });
            req.pipe(proxy);
            return;
        }

        let ruta = decodeURIComponent(req.url.split("?")[0]);
        if (ruta === "/") ruta = "/index.html";
        const archivo = path.join(__dirname, path.normalize(ruta));
        if (!archivo.startsWith(__dirname)) {
            res.writeHead(403);
            res.end();
            return;
        }
        fs.readFile(archivo, (error, contenido) => {
            if (error) {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("No encontrado");
                return;
            }
            res.writeHead(200, { "Content-Type": TIPOS[path.extname(archivo)] || "application/octet-stream" });
            res.end(contenido);
        });
    })
    .listen(PUERTO, () => console.log("Front en http://localhost:" + PUERTO));
