const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

// Importar rutas
const handleUsersRoutes = require("./routes/users");
const handleAuthRoutes = require("./routes/auth");
const setupChat = require("./web/chat"); // Activamos chat

const PORT = 3001; // cualquier puerto libre

// Carpeta pública (un nivel arriba de src)
const PUBLIC_PATH = path.join(__dirname, "../public");

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // 1️⃣ Rutas API
    if (handleUsersRoutes(req, res)) return;
    if (handleAuthRoutes(req, res)) return;

    // 2️⃣ Servir archivos estáticos
    let filePath = req.url === "/" ? "login.html" : req.url;

    // Limpiar query params (?group=general)
    filePath = filePath.split("?")[0];

    // Si no tiene extensión, asumimos HTML
    if (!path.extname(filePath)) filePath += ".html";

    const extname = path.extname(filePath);
    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif"
    };

    const fullPath = path.join(PUBLIC_PATH, filePath);

    fs.readFile(fullPath, (err, content) => {
        if (err) {
            console.error(`❌ Archivo no encontrado: ${fullPath}`);
            res.writeHead(err.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain" });
            res.end(err.code === "ENOENT" ? "404 Not Found" : `Error interno: ${err.code}`);
        } else {
            res.writeHead(200, { "Content-Type": mimeTypes[extname] || "text/plain" });
            res.end(content);
        }
    });
});

// 3️⃣ Servidor WebSocket
const wss = new WebSocket.Server({ server });
setupChat(wss); // Inicializamos el chat

server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 public path: ${PUBLIC_PATH}`);
});
