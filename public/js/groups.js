// public/js/groups.js
document.addEventListener("DOMContentLoaded", () => {
  // 🔒 Validación de sesión
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    // Si no hay sesión → mandar a login
    window.location.href = "login.html";
    return;
  }

  // 🔒 Bloqueo del botón "Atrás" del navegador
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };

  // === Tu código original ===
  const generalBtn = document.querySelector(".btn-general");
  const soporteBtn = document.querySelector(".btn-soporte");
  const programacionBtn = document.querySelector(".btn-programacion");
  const logoutBtn = document.querySelector(".btn-logout");

  if (generalBtn)
    generalBtn.addEventListener(
      "click",
      () => (window.location.href = "chat.html?group=general")
    );
  if (soporteBtn)
    soporteBtn.addEventListener(
      "click",
      () => (window.location.href = "chat.html?group=bugs")
    );
  if (programacionBtn)
    programacionBtn.addEventListener(
      "click",
      () => (window.location.href = "chat.html?group=ideas")
    );

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user"); // limpiamos sesión
      sessionStorage.clear();
      window.location.replace("login.html"); // redirigir y evitar back
    });
  }
});
