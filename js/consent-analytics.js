/**
 * Shared, consent-gated Google Analytics for hellenicdev.eu sites.
 *
 * Loads gtag.js and sends a GA4 page view only after Cookiebot reports
 * statistics consent (Cookiebot.consent.statistics). Declining, or not
 * choosing, leaves Analytics unloaded. Withdrawing consent sets Google's
 * ga-disable flag so later hits are dropped.
 *
 * The page must include Cookiebot's uc.js. This portfolio uses:
 *
 *   <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js"
 *           data-cbid="06e4a97f-2c34-41ed-8ab6-d53b581ff080"
 *           type="text/javascript" async></script>
 *
 * Other sites (and this one) then add a single tag. The only per-site
 * parameter is data-ga-id, the GA4 measurement ID for that property.
 * This portfolio's measurement ID is G-9FWQFZME3Z.
 *
 *   <script src="https://hellenicdev.eu/js/consent-analytics.js"
 *           data-ga-id="G-9FWQFZME3Z"
 *           defer></script>
 *
 * Replace G-9FWQFZME3Z with the measurement ID for the site embedding
 * the tag. Use a classic script tag so data-ga-id is readable; do not
 * load this file as type="module".
 */
(function () {
  var GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

  function readMeasurementId() {
    var el = document.currentScript;
    if (!el || !el.getAttribute("data-ga-id")) {
      var tagged = document.querySelectorAll("script[data-ga-id]");
      el = tagged.length ? tagged[tagged.length - 1] : null;
    }
    var id = el ? (el.getAttribute("data-ga-id") || "").trim() : "";
    return GA_ID_PATTERN.test(id) ? id : "";
  }

  var measurementId = readMeasurementId();
  if (!measurementId) {
    console.warn("consent-analytics: missing or invalid data-ga-id");
    return;
  }

  var loaded = false;

  function cookiebot() {
    return window.Cookiebot || window.CookieConsent || null;
  }

  function statisticsAllowed() {
    var bot = cookiebot();
    return !!(bot && bot.consent && bot.consent.statistics === true);
  }

  function disable() {
    window["ga-disable-" + measurementId] = true;
  }

  function enable() {
    if (!statisticsAllowed()) return;
    window["ga-disable-" + measurementId] = false;
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function sync() {
    if (statisticsAllowed()) enable();
    else disable();
  }

  window.addEventListener("CookiebotOnConsentReady", sync);
  window.addEventListener("CookiebotOnAccept", sync);
  window.addEventListener("CookiebotOnDecline", sync);
  window.addEventListener("pageshow", sync);
  sync();
})();
