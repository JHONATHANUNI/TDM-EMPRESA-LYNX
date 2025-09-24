const messagesEl = document.getElementById("messages");
const userListEl = document.getElementById("userList");

// Guardamos IDs o hashes de mensajes para evitar duplicados
const messageSet = new Set();

export function addMessage(userObj, text, self = false, msgId = null) {
  if (!messagesEl) return;

  msgId = msgId || Date.now() + Math.random(); // id único
  const container = document.createElement("div");
  container.classList.add("message-container");
  container.dataset.id = msgId;
  if (self) container.classList.add("self");

  // Avatar + estado
  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("avatar-container");
  const avatarImg = document.createElement("img");
  avatarImg.classList.add("avatar");
  avatarImg.src = userObj.img || "https://i.pravatar.cc/150?img=1";
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

  // Botones de acción si es tu mensaje
  if (self) {
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("message-actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => editMessage(msgId));

    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", () => deleteMessage(msgId));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(delBtn);
    contentDiv.appendChild(actionsDiv);
  }

  container.appendChild(avatarDiv);
  container.appendChild(contentDiv);
  messagesEl.appendChild(container);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
// EDIT MENSAJE
export function editMessage(msgId) {
  const msgEl = messagesEl.querySelector(`.message-container[data-id="${msgId}"] p`);
  if (!msgEl) return;
  const newText = prompt("Editar mensaje:", msgEl.textContent);
  if (newText !== null) {
    msgEl.textContent = newText;
    // aquí también puedes enviar al servidor el cambio
    window.socket.send(JSON.stringify({
      type: "edit",
      id: msgId,
      text: newText
    }));
  }
}
// DELETE MENSAJE
export function deleteMessage(msgId) {
  const msgEl = messagesEl.querySelector(`.message-container[data-id="${msgId}"]`);
  if (!msgEl) return;
  if (confirm("¿Deseas eliminar este mensaje?")) {
    msgEl.remove();
    // enviar al servidor para borrar en todos los clientes
    window.socket.send(JSON.stringify({
      type: "delete",
      id: msgId
    }));
  }
}

// AGREGAR AL SISTEMA UN MENSAJE
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
