// web/chat.js

const broadcast = require("../utils/broadcast");
const { getUsers } = require("../models/users");

let users = []; // aquí guardamos todos los usuarios conectados

function setupChat(wss) {
    wss.on("connection", (ws, req) => {
        let currentUser = null;
        const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;

        ws.on("message", (msg) => {
            const data = JSON.parse(msg);

            // 🟢 LOGIN
            if (data.type === "login") {
                currentUser = { 
                    id: data.user.id, 
                    name: data.user.name, 
                    ws, 
                    group: data.group || "general" 
                };
                users.push(currentUser);

                console.log(`${new Date().toISOString()} - 🟢 Cliente conectado (${currentUser.name} | Grupo: ${currentUser.group} | ${ip})`);

                // Mensaje de sistema SOLO al grupo
                broadcast(
                    users.filter(u => u.group === currentUser.group),
                    { type: "system", text: `${currentUser.name} se unió al grupo ${currentUser.group}` }
                );

                // Lista de usuarios del grupo
                const allUsers = getUsers();
                broadcast(
                    users.filter(u => u.group === currentUser.group),
                    {
                        type: "users",
                        users: allUsers.map(u => ({
                            id: u.id,
                            name: u.name,
                            rol: u.rol,
                            img: u.img,
                            connected: users.some(c => c.id === u.id && c.group === currentUser.group)
                        }))
                    }
                );
            }

            // 💬 CHAT
            if (data.type === "chat") {
                // Solo enviar mensajes al grupo correspondiente
                broadcast(
                    users.filter(u => u.group === currentUser.group),
                    { 
                        type: "chat", 
                        user: data.user, 
                        text: data.text,
                        group: currentUser.group, // 🔥 FIX: incluir grupo
                        id: Date.now()            // 🔥 FIX: ID único del mensaje
                    }
                );
            }
        });

        ws.on("close", () => {
            if (currentUser) {
                console.log(`${new Date().toISOString()} - 🔴 Cliente desconectado (${currentUser.name} | Grupo: ${currentUser.group} | ${ip})`);
                users = users.filter(u => u !== currentUser);

                // Mensaje de sistema SOLO al grupo
                broadcast(
                    users.filter(u => u.group === currentUser.group),
                    { type: "system", text: `${currentUser.name} salió del grupo ${currentUser.group}` }
                );

                // Actualizar lista de usuarios del grupo
                const allUsers = getUsers();
                broadcast(
                    users.filter(u => u.group === currentUser.group),
                    {
                        type: "users",
                        users: allUsers.map(u => ({
                            id: u.id,
                            name: u.name,
                            rol: u.rol,
                            img: u.img,
                            connected: users.some(c => c.id === u.id && c.group === currentUser.group)
                        }))
                    }
                );
            }
        });
    });
}

module.exports = setupChat;

