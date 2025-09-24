const messagesEl = document.getElementById("messages");
const userListEl = document.getElementById("userList");

export function addMessage(user, text, self = false) {
  if (!messagesEl) return;
  const msg = document.createElement("div");
  msg.className = "message";
  if (self) msg.classList.add("self");
  msg.innerHTML = `<strong>${escapeHtml(user)}:</strong> ${escapeHtml(text)}`;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

export function addSystemMessage(text) {
  if (!messagesEl) return;
  const msg = document.createElement("div");
  msg.className = "message system";
  msg.textContent = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

export function updateUserList(users = []) {
  if (!userListEl) return;
  userListEl.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.className = "user-item";
    li.innerHTML = `
      <div class="user-avatar">
        <img class="avatar-img" src="${u.img || 'https://www.gravatar.com/avatar/?d=mp'}" alt="${escapeHtml(u.name)}"/>
        <span class="status ${u.connected ? 'online' : 'offline'}"></span>
      </div>
      <div class="user-info">
        <div class="user-name">${escapeHtml(u.name)}</div>
        <div class="user-role">${escapeHtml(u.rol || '')}</div>
      </div>
    `;
    userListEl.appendChild(li);
  });
}

export function showUserList(sidebarEl, show) {
  if (!sidebarEl) return;
  if (show) sidebarEl.classList.add("active");
  else sidebarEl.classList.remove("active");
}

export function clearUser() {
  localStorage.removeItem("user");
  sessionStorage.clear();
}

export function redirectToLogin() {
  window.location.href = "login.html";
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
