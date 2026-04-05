setTimeout(() => {
  // Load GA library
  const s = document.createElement('script');
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-9FWQFZME3Z";
  s.async = true;

  // Initialize GA only after the script has loaded
  s.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9FWQFZME3Z');
  };

  document.head.appendChild(s);
}, 3000); // 3 seconds delay

// UTM SOURCE DETECT
const params = new URLSearchParams(window.location.search);
const utmSource = params.get('utm_source');
const utmMedium = params.get('utm_medium');
const utmCampaign = params.get('utm_campaign');

if (utmSource) {
  console.log('UTM Source:', utmSource);
  document.cookie = `utm_source=${utmSource}; path=/; max-age=2592000`;
}

// MailerLite Universal
(function(w,d,e,u,f,l,n){
  w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);};
  l=d.createElement(e),l.async=1,l.src=u,
  n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);
})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
ml('account', '1922622');

// YouTube lazy load
function loadVideo(el) {
  el.innerHTML = `<iframe loading="lazy" src="https://www.youtube.com/embed/99FexhxsXx8?autoplay=1" allowfullscreen></iframe>`;
}

// reCAPTCHA form
function showForm(token) {
  document.getElementById("form-container").style.display = "block";
}

// Popup ad
window.onload = function() {
  setTimeout(function() {
    document.getElementById('popup-ad').style.display = 'block';
  }, 5000);
};

// MailerLite success
function ml_webform_success_33394663() {
  var $ = ml_jQuery || jQuery;
  $('.ml-subscribe-form-33394663 .row-success').show();
  $('.ml-subscribe-form-33394663 .row-form').hide();
}

// MailerLite fetch
fetch("https://assets.mailerlite.com/jsonp/1922622/forms/171163985153885945/takel")

// Last updated script
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
        days === 0
          ? "Updated today"
          : days === 1
          ? "Updated yesterday"
          : `Updated ${days} days ago`;

      el.textContent = `🕒 ${text}`;
    } catch {
      el.textContent = "";
    }
  }
});

// Secret typing easter egg
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

    if (typed === secret) {
      message.style.display = "block";
      triggered = true;
    }
  });
})();

// Logo click
function showThankYou() {
  const msg = document.getElementById("hidden-thanks");
  msg.style.display = "block";
}
// Navigation
const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");

menuButton.onclick = () => {
  if (sideMenu.style.left === "0px") {
    sideMenu.style.left = "-250px";
  } else {
    sideMenu.style.left = "0px";
  }
};

  kofiWidgetOverlay.draw('hellenicdev', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Donate',
    'floating-chat.donateButton.background-color': '#5bc0de',
    'floating-chat.donateButton.text-color': '#323842'
  });
