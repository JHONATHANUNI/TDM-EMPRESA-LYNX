import { connect, sendMessage } from "./web/chatSocket.js";
import { showUserList, clearUser, redirectToLogin } from "./ui/chatUI.js";

const stored = localStorage.getItem("user");
const user = stored ? JSON.parse(stored) : null;
if (!user) redirectToLogin();

const urlParams = new URLSearchParams(window.location.search);
let currentGroup = urlParams.get("group") || "general";

const allowedGroups = ["general", "bugs", "ideas"];
if (!allowedGroups.includes(currentGroup.toLowerCase())) {
  window.location.href = "groups.html";
}
currentGroup = currentGroup.toLowerCase();

const headerEl = document.getElementById("chat-username");
if (headerEl) {
  const groupName = currentGroup.charAt(0).toUpperCase() + currentGroup.slice(1);
  headerEl.textContent = `Grupo: ${groupName} | Bienvenido ${user.name}`;
}

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const logoutBtn = document.getElementById("logoutBtn");
const sidebar = document.getElementById("userSidebar");
const toggleBtn = document.getElementById("usersToggle");
const closeBtn = document.getElementById("closeSidebar");
const messagesContainer = document.getElementById("messages");

// Botón volver a grupos
(function addBackToGroupsButton() {
  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;
  const backBtn = document.createElement("button");
  backBtn.className = "icon-btn";
  backBtn.title = "Volver a grupos";
  backBtn.innerHTML = "←";
  backBtn.style.fontWeight = "700";
  backBtn.style.marginRight = "8px";
  headerActions.prepend(backBtn);
  backBtn.addEventListener("click", () => window.location.href = "groups.html");
})();

// Conectar WS
try {
  connect(user, currentGroup, (msg) => {
    // Mensaje recibido por WS
    if (msg.user === user.name) return; // No duplicar mensajes locales
    addMessage(msg, msg.text, false);
  });
} catch (err) {
  console.error("❌ Error conectando al chat:", err);
  alert("No se pudo conectar al chat. Intenta de nuevo más tarde.");
  window.location.href = "groups.html";
}

// Función para agregar mensaje al DOM
export function addMessage(userObj, text, self = false, system = false) {
  const container = document.createElement("div");

  if (system) {
    container.classList.add("message", "system");
    container.textContent = text;
  } else {
    container.classList.add("message-container");
    if (self) container.classList.add("self");

    // Avatar y estado
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar-container");

    const avatarImg = document.createElement("img");
    avatarImg.classList.add("avatar");
    avatarImg.src = userObj.avatar || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/250px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg";
    avatarDiv.appendChild(avatarImg);

    const statusSpan = document.createElement("span");
    statusSpan.classList.add("status");
    statusSpan.classList.add(userObj.online ? "online" : "offline");
    avatarDiv.appendChild(statusSpan);

    // Contenido del mensaje
    const content = document.createElement("div");
    content.classList.add("message-content");

    const p = document.createElement("p");
    p.classList.add("message-text");
    p.textContent = text;

    content.appendChild(p);

    container.appendChild(avatarDiv);
    container.appendChild(content);
  }

  messagesContainer.appendChild(container);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enviar mensaje propio
if (chatForm && messageInput) {
 chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  // Solo enviar al servidor, el WS mostrará el mensaje
  sendMessage(user.name, text, currentGroup);

  messageInput.value = "";
  messageInput.focus();
});


  messageInput.focus();
}

// Botones
if (logoutBtn) logoutBtn.addEventListener("click", () => { clearUser(); redirectToLogin(); });
if (toggleBtn) toggleBtn.addEventListener("click", () => showUserList(sidebar, true));
if (closeBtn) closeBtn.addEventListener("click", () => showUserList(sidebar, false));
