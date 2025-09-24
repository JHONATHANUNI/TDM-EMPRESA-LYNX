import { login } from "./services/api.js";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("loginError");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await login(username, password); // ⚠️ enviar parámetros separados

        if (response.error) {
            errorMsg.textContent = response.error;
            return;
        }

        localStorage.setItem("user", JSON.stringify(response.user));
        window.location.href = "/groups.html"; // ✅ redirigir al listado de grupos
    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Usuario o contraseña incorrectos";
    }
});
