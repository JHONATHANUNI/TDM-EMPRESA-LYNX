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

// ------------------- NUEVO: Sidebar de canales -------------------
const channelSidebar = document.getElementById("channelSidebar");
const channelItems = channelSidebar ? channelSidebar.querySelectorAll("li") : [];
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && channelSidebar) {
  // Abrir/cerrar sidebar
  menuBtn.addEventListener("click", () => {
    channelSidebar.classList.toggle("show");
  });

  // Cambiar de canal
  channelItems.forEach(item => {
    item.addEventListener("click", () => {
      const newChannel = item.getAttribute("data-channel");
      if (newChannel === currentGroup) return; // mismo canal, no hacer nada

      // Limpiar mensajes actuales
      const messagesEl = document.getElementById("messages");
      if (messagesEl) messagesEl.innerHTML = "";

      // Actualizar la clase activa
      channelItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      // Cambiar canal actual y reconectar
      currentGroup = newChannel;
      if (window.socket) window.socket.close(); // cerrar conexión anterior
      connect(user, currentGroup);

      // Ocultar sidebar en móvil
      channelSidebar.classList.remove("show");
    });
  });
}
// ------------------- FIN NUEVO -------------------

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

try {
  connect(user, currentGroup);
} catch (err) {
  console.error("❌ Error conectando al chat:", err);
  alert("No se pudo conectar al chat. Intenta de nuevo más tarde.");
  window.location.href = "groups.html";
}

// Enviar mensaje propio
if (chatForm && messageInput) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const selfUser = {
      name: user.name,
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/250px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg",
      connected: true
    };

    import("./ui/chatUI.js").then(module => {
      /*  module.addMessage(selfUser, text, true);*/
    });

    sendMessage(user.name, text, currentGroup);
    messageInput.value = "";
    messageInput.focus();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearUser();
    redirectToLogin();
  });
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => showUserList(sidebar, true));
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => showUserList(sidebar, false));
}
