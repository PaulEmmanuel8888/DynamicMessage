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

try {
  // Clear message input
  const messageInput = document.getElementById("message_input");
  const messageButtonClear = document.getElementById("message-button-clear");
  if (messageInput && messageButtonClear) {
    messageButtonClear.addEventListener("click", () => {
      messageInput.value = "";
    });
  }

  // Toggle password visibility
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  if (passwordInput && togglePassword) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      togglePassword.classList.toggle("fa-eye");
      togglePassword.classList.toggle("fa-eye-slash");
    });
  }
} catch (error) {
  console.log("Error: ", error);
}

var messagesDivs = document.querySelectorAll(".main-message-div");

if (messagesDivs) {
  for (var i = 0; i < messagesDivs.length; i++) {
    const currentMessage = messagesDivs[i];
    currentMessage.addEventListener("click", () => {
      if (currentMessage.classList.contains("active")) {
        currentMessage.classList.remove("active");
      } else {
        clearActive();
        currentMessage.classList.add("active");
      }
    });
  }
}

function clearActive() {
  messagesDivs.forEach((messageDiv) => {
    messageDiv.classList.remove("active");
  });
}
function flashClass(element, className, duration) {
  const messageCopyDiv = element.closest(".message-copy");
  messageCopyDiv.classList.add(className);
  setTimeout(() => {
    messageCopyDiv.classList.remove(className);
  }, duration);
}

document.querySelectorAll(".copy-button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = btn.getAttribute("data-message-id");
    const element = document.getElementById(id);

    if (element) {
      const text = element.textContent.trim();
      if (!text) {
        console.warn("No text found to copy");
        return;
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          flashClass(btn, "copy_successful", 1500);
        })
        .catch((err) => {
          flashClass(btn, "copy_failed", 1500);
          console.error("Clipboard copy failed:", err);
        });
    } else {
      console.warn(`Element with ID ${id} not found.`);
    }
  });
});
