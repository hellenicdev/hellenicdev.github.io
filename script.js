// =====================
// Google Analytics (delayed load)
// =====================
setTimeout(() => {
  const s = document.createElement('script');
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-9FWQFZME3Z";
  s.async = true;

  s.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-9FWQFZME3Z');
  };

  document.head.appendChild(s);
}, 3000);


// =====================
// UTM TRACKING
// =====================
const params = new URLSearchParams(window.location.search);
const utmSource = params.get('utm_source');

if (utmSource) {
  console.log('UTM Source:', utmSource);
  document.cookie = `utm_source=${utmSource}; path=/; max-age=2592000; SameSite=Lax`;
}


// =====================
// MailerLite (safe load)
// =====================
(function(w,d,e,u,f,l,n){
  w[f] = w[f] || function(){ (w[f].q = w[f].q || []).push(arguments); };
  l = d.createElement(e);
  l.async = 1;
  l.src = u;
  n = d.getElementsByTagName(e)[0];
  n.parentNode.insertBefore(l,n);
})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');

// Call only if available
setTimeout(() => {
  if (typeof ml === "function") {
    ml('account', '1922622');
  }
}, 1000);


// =====================
// YouTube lazy load
// =====================
function loadVideo(el) {
  if (!el) return;
  el.innerHTML = `<iframe loading="lazy"
    src="https://www.youtube.com/embed/99FexhxsXx8?autoplay=1"
    allowfullscreen></iframe>`;
}


// =====================
// reCAPTCHA form
// =====================
function showForm(token) {
  const el = document.getElementById("form-container");
  if (el) el.style.display = "block";
}


// =====================
// Popup ad (safe)
// =====================
window.addEventListener("load", () => {
  const popup = document.getElementById('popup-ad');
  if (!popup) return;

  setTimeout(() => {
    popup.style.display = 'block';
  }, 5000);
});


// =====================
// MailerLite success handler (safe)
// =====================
function ml_webform_success_33394663() {
  const $ = window.ml_jQuery || window.jQuery;
  if (!$) return;

  $('.ml-subscribe-form-33394663 .row-success').show();
  $('.ml-subscribe-form-33394663 .row-form').hide();
}


// =====================
// Last updated script (safe fetch)
// =====================
document.addEventListener("DOMContentLoaded", async () => {
  const items = document.querySelectorAll(".last-updated");

  for (const el of items) {
    const path = el.dataset.meta;
    if (!path) continue;

    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error();

      const data = await res.json();
      const last = new Date(data.lastUpdated);
      const days = Math.floor(
        (Date.now() - last) / (1000 * 60 * 60 * 24)
      );

      const text =
        days === 0 ? "Updated today" :
        days === 1 ? "Updated yesterday" :
        `Updated ${days} days ago`;

      el.textContent = `🕒 ${text}`;
    } catch {
      el.textContent = "";
    }
  }
});


// =====================
// Secret typing easter egg (safe)
// =====================
(function () {
  let typed = "";
  const secret = "HELLENICDEV";
  const message = document.getElementById("hidden-thanks");
  let triggered = false;

  document.addEventListener("keydown", (e) => {
    if (triggered) return;
    if (e.key.length !== 1) return;

    typed += e.key.toUpperCase();
    typed = typed.slice(-secret.length);

    if (typed === secret && message) {
      message.style.display = "block";
      triggered = true;
    }
  });
})();


// =====================
// Logo click
// =====================
function showThankYou() {
  const msg = document.getElementById("hidden-thanks");
  if (msg) msg.style.display = "block";
}


// =====================
// Navigation menu (safe)
// =====================
const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

if (menuButton && sideMenu) {
  menuButton.onclick = () => {
    sideMenu.style.left =
      sideMenu.style.left === "0px" ? "-250px" : "0px";
  };
}