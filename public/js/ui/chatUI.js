const messagesEl = document.getElementById("messages");
const userListEl = document.getElementById("userList");

// Guardamos IDs o hashes de mensajes para evitar duplicados
const messageSet = new Set();

export function addMessage(userObj, text, self = false) {
  if (!messagesEl) return;

  const container = document.createElement("div");
  container.classList.add("message-container");
  if (self) container.classList.add("self");

  // Avatar + estado
  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("avatar-container");

  const avatarImg = document.createElement("img");
  avatarImg.classList.add("avatar");
  avatarImg.src = userObj.img || "https://i.pravatar.cc/150?img=1"; // fallback
  avatarDiv.appendChild(avatarImg);

  const statusSpan = document.createElement("span");
  statusSpan.classList.add("status");
  statusSpan.classList.add(userObj.connected ? "online" : "offline");
  avatarDiv.appendChild(statusSpan);

  // Contenido del mensaje
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("message-content");

  const strong = document.createElement("strong");
  strong.textContent = userObj.name + ": ";

  const p = document.createElement("p");
  p.textContent = text;

  contentDiv.appendChild(strong);
  contentDiv.appendChild(p);

  container.appendChild(avatarDiv);
  container.appendChild(contentDiv);

  messagesEl.appendChild(container);
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
        <img class="avatar-img" src="${u.img || 'https://www.gravatar.com/avatar/?d=mp'}" alt="${u.name}"/>
        <span class="status ${u.connected ? 'online' : 'offline'}"></span>
      </div>
      <div class="user-info">
        <div class="user-name">${u.name}</div>
        <div class="user-role">${u.rol || ''}</div>
      </div>
    `;
    userListEl.appendChild(li);
  });
}

export function showUserList(sidebarEl, show) {
  if (!sidebarEl) return;
  sidebarEl.classList.toggle("active", show);
}

export function clearUser() {
  localStorage.removeItem("user");
  sessionStorage.clear();
}

export function redirectToLogin() {
  window.location.href = "login.html";
}
