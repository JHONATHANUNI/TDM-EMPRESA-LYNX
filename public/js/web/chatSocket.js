import { addMessage, addSystemMessage, updateUserList } from "../ui/chatUI.js";

let socket;
let currentGroup = "general";
let currentUserName = "";
let msgCounter = 0; // contador de mensajes para evitar duplicados

function safeParse(data) {
  try { return JSON.parse(data); } 
  catch (err) { console.error("JSON parse error:", err, data); return null; }
}

export function connect(user, group = "general") {
  currentGroup = group;
  currentUserName = user.name;

  const wsBase = location.hostname === "localhost" ? "ws://localhost:3001" : `wss://${location.host}`;
  const wsUrl = `${wsBase}?group=${encodeURIComponent(currentGroup)}`;
  socket = new WebSocket(wsUrl);

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "login", user, group: currentGroup }));
    console.log("WS conectado en grupo:", currentGroup);
  });

  socket.addEventListener("message", (event) => {
    const data = safeParse(event.data);
    if (!data) return;

    const msgGroup = data.group || currentGroup;
    if (msgGroup !== currentGroup) return;

    // Generar un ID único para cada mensaje
    const msgId = data.id || `${data.user}-${msgCounter++}`;

    switch (data.type) {
      case "chat":
        addMessage(
          { name: data.user, img: data.img || '', connected: true },
          data.text,
          data.user === currentUserName,
          msgId
        );
        break;
      case "system":
        addSystemMessage(data.text);
        break;
      case "users":
        updateUserList(data.users || []);
        break;
      default:
        console.warn("Tipo de mensaje WS desconocido:", data.type);
    }
  });

  socket.addEventListener("close", () => console.log("WS cerrado"));
  socket.addEventListener("error", err => console.error("WS error:", err));
}

export function sendMessage(user, text, group = currentGroup) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ type: "chat", user, text, group, id: `${user}-${Date.now()}` }));
}
