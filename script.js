// =====================
// Service Worker registration
// =====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// =====================
// Logo click handler
// =====================
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', showThankYou);
  }
});

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
// Popup ad (safe) — dialog with focus trap
// =====================
window.addEventListener("load", () => {
  const popup = document.getElementById('popup-ad');
  const closeBtn = document.getElementById('popupCloseBtn');
  if (!popup || !closeBtn) return;

  function openPopup() {
    popup.style.display = 'block';
    popup.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    // trap focus inside popup
    popup.addEventListener('keydown', trapFocus);
  }

  function closePopup() {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    popup.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    const focusable = popup.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    if (e.key === 'Escape') closePopup();
  }

  closeBtn.addEventListener('click', closePopup);

  setTimeout(openPopup, 5000);
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
  function toggleMenu() {
    const isOpen = sideMenu.style.left === "0px";
    sideMenu.style.left = isOpen ? "-250px" : "0px";
    menuButton.setAttribute("aria-expanded", !isOpen);
    menuButton.classList.toggle("open", !isOpen);
  }

  menuButton.addEventListener("click", toggleMenu);

  menuButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu.style.left === "0px") {
      toggleMenu();
      menuButton.focus();
    }
  });

  sideMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && sideMenu.style.left === "0px") {
      toggleMenu();
    }
  });
}