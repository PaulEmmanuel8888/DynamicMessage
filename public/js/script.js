const loader = document.getElementById("loader-div");
const main = document.getElementById("main-content");
const minLoadTime = 1000;
const start = Date.now();

window.addEventListener("load", function () {
  const elapsed = Date.now() - start;
  const remaining = minLoadTime - elapsed;

  setTimeout(
    () => {
      if (loader) loader.style.display = "none";
      if (main) main.style.display = "flex";
    },
    remaining > 0 ? remaining : 0
  );
});

const messageInput = document.getElementById("message-input");
const messageButtonSave = document.getElementById("message-button-save");
const messageButtonClear = document.getElementById("message-button-clear");

messageButtonClear.addEventListener("click", () => {
  messageInput.value = "";
});

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });
}
