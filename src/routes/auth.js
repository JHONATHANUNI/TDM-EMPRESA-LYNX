const { getUsers } = require("../models/users");

function handleAuthRoutes(req, res) {
    if (req.url.startsWith("/api/login")) {
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => (body += chunk));
            req.on("end", () => {
                try {
                    const { username, password } = JSON.parse(body);
                    const users = getUsers();

                    const user = users.find(
                        u => u.name.toLowerCase() === username.toLowerCase() && u.password === password
                    );

                    if (!user) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Usuario o contraseña incorrectos" }));
                        return;
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "Login exitoso",
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            rol: user.rol,
                            img: user.img
                        }
                    }));
                } catch (err) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Formato de datos inválido" }));
                }
            });
            return true;
        }
    }
    return false;
}

module.exports = handleAuthRoutes;
