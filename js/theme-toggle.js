(function() {
  const html = document.documentElement;
  let prefs = { theme: "light" };
  try {
    prefs = JSON.parse(localStorage.getItem("preferences")) || prefs;
  } catch (e) { /* corrupted storage — fall back to defaults */ }
  html.setAttribute("data-theme", prefs.theme);

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function() {
      const current = html.getAttribute("data-theme");
      const next = current === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      prefs.theme = next;
      localStorage.setItem("preferences", JSON.stringify(prefs));
    });
  }
})();
