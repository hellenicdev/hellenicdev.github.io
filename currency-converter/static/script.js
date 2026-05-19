// Theme
const html = document.documentElement;
const prefs = JSON.parse(localStorage.getItem("preferences")) || { theme: "light" };
html.setAttribute("data-theme", prefs.theme);

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  prefs.theme = next;
  localStorage.setItem("preferences", JSON.stringify(prefs));
});

// DOM
const amount = document.getElementById("amount");
const from = document.getElementById("from");
const to = document.getElementById("to");
const result = document.getElementById("result");
const rateBox = document.getElementById("rate");
const convertBtn = document.getElementById("convert");

// Convert
document.getElementById("convert").onclick = convert;
document.getElementById("swap").onclick = () => {
  [from.value, to.value] = [to.value, from.value];
  convert();
};

amount.addEventListener("keydown", e => {
  if (e.key === "Enter") convert();
});

async function convert() {
  if (!amount.value) {
    amount.focus();
    return;
  }

  convertBtn.classList.add("loading");
  result.textContent = "";
  rateBox.textContent = "";

  try {
    const res = await fetch("/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount.value,
        from: from.value,
        to: to.value
      })
    });

    if (!res.ok) {
      result.textContent = "⚠️ Rate limit reached. Try again later.";
      return;
    }

    const data = await res.json();
    result.textContent = `${amount.value} ${from.value} = ${data.result} ${to.value}`;
    rateBox.textContent = `1 ${from.value} = ${data.rate} ${to.value}`;
  } catch {
    result.textContent = "⚠️ Connection error. Please try again.";
  } finally {
    convertBtn.classList.remove("loading");
  }
}
