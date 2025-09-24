// public/js/groups.js
document.addEventListener("DOMContentLoaded", () => {
  const generalBtn = document.querySelector(".btn-general");
  const soporteBtn = document.querySelector(".btn-soporte");
  const programacionBtn = document.querySelector(".btn-programacion");
  const logoutBtn = document.querySelector(".btn-logout");

  if (generalBtn) generalBtn.addEventListener("click", () => window.location.href = "chat.html?group=general");
  if (soporteBtn) soporteBtn.addEventListener("click", () => window.location.href = "chat.html?group=bugs");
  if (programacionBtn) programacionBtn.addEventListener("click", () => window.location.href = "chat.html?group=ideas");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userSession"); // si guardas sesión en localStorage
      window.location.href = "login.html";
    });
  }
});
