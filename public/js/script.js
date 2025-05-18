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

function clearActive() {
  const messagesDivs = document.querySelectorAll(".main-message-div");
  messagesDivs.forEach((messageDiv) => {
    messageDiv.classList.remove("active");
  });
}

function flashClass(element, className, duration) {
  const messageCopyDiv = element.closest(".message-copy");
  if (!messageCopyDiv) return;
  messageCopyDiv.classList.add(className);
  setTimeout(() => {
    messageCopyDiv.classList.remove(className);
  }, duration);
}

/**
 * Add event listeners to message divs and copy buttons inside the container.
 * @param {HTMLElement} container - Parent element or document containing messages
 */
function addMessageListeners(container) {
  if (!container) return;

  // Attach click listener to each message div
  const messagesDivs = container.querySelectorAll
    ? container.querySelectorAll(".main-message-div")
    : [];

  messagesDivs.forEach((div) => {
    // To prevent adding multiple listeners, remove existing listener by cloning node
    // or use a flag. Here we do a simple check to avoid duplicates:
    if (!div._hasClickListener) {
      div.addEventListener("click", function () {
        if (this.classList.contains("active")) {
          this.classList.remove("active");
        } else {
          clearActive();
          this.classList.add("active");
        }
      });
      div._hasClickListener = true; // custom flag
    }
  });

  // Attach click listener to each copy button
  const copyButtons = container.querySelectorAll
    ? container.querySelectorAll(".copy-button")
    : [];

  copyButtons.forEach((btn) => {
    if (!btn._hasClickListener) {
      btn.addEventListener("click", async (e) => {
        if (navigator.clipboard) {
          e.preventDefault();
          e.stopPropagation();
        }
        const id = btn.getAttribute("data-message-id");
        const element = document.getElementById(id);

        if (!element) {
          console.warn(`Element with ID ${id} not found.`);
          return;
        }

        const text = element.textContent.trim();
        if (!text) {
          console.warn("No text found to copy");
          return;
        }

        try {
          // Fallback for older mobile browsers
          if (!navigator.clipboard) {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed"; // Prevent scrolling
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            e.preventDefault();
            e.stopPropagation();
          } else {
            await navigator.clipboard.writeText(text);
          }
          flashClass(btn, "copy_successful", 1500);
        } catch (err) {
          flashClass(btn, "copy_failed", 1500);
          console.error("Clipboard copy failed:", err);
        }
      });
      btn._hasClickListener = true; // custom flag
    }
  });
}

// Run once on initial page load for existing elements
document.addEventListener("DOMContentLoaded", () => {
  addMessageListeners(document);
});
