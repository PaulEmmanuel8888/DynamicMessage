const loader = document.getElementById("loader-div");
const main = document.getElementById("main-content");
const minLoadTime = 1000;
const start = Date.now();

window.addEventListener("load", function () {
  const elapsed = Date.now() - start;
  const remaining = minLoadTime - elapsed;

  setTimeout(
    () => {
      if (loader) {
        loader.style.display = "none";
        main.style.display = "flex";
      }
    },
    remaining > 0 ? remaining : 0
  );
});
