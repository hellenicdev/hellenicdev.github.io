// netlify/functions/search.js
// Proxies a paid Google Custom Search quota. Node 18+ native fetch.
// The per-IP window lives in memory, so it applies to one warm instance.

const ALLOWED_ORIGIN = "https://hellenicdev.eu";
const WINDOW_MS = 60 * 1000;
const LIMIT = 20;
const hits = new Map();

function header(event, name) {
  const headers = event.headers || {};
  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === wanted) return value == null ? "" : String(value);
  }
  return "";
}

function clientIp(event) {
  const direct = header(event, "x-nf-client-connection-ip") || header(event, "client-ip");
  const forwarded = direct || header(event, "x-forwarded-for");
  return forwarded.split(",")[0].trim() || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, stamps] of hits) {
      if (!stamps.length || now - stamps[stamps.length - 1] >= WINDOW_MS) hits.delete(key);
    }
  }
  return false;
}

function json(statusCode, payload, extraHeaders) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(extraHeaders || {}),
    },
    body: JSON.stringify(payload),
  };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export async function handler(event) {
  const origin = header(event, "origin");
  const allowed = origin === ALLOWED_ORIGIN;
  const method = String(event.httpMethod || "GET").toUpperCase();

  if (method === "OPTIONS") {
    if (!allowed) return json(403, { error: "Forbidden" });
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  if (method !== "GET") {
    return json(405, { error: "Bad request" });
  }

  if (rateLimited(clientIp(event))) {
    return json(429, { error: "Too many requests" }, allowed ? corsHeaders() : undefined);
  }

  if (!allowed) {
    return json(403, { error: "Forbidden" });
  }

  const params = event.queryStringParameters || {};
  const query = String(params.q || "").trim().slice(0, 200);
  if (!query) {
    return json(400, { error: "Bad request" }, corsHeaders());
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cx) {
    return json(500, { error: "Search unavailable" }, corsHeaders());
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return json(502, { error: "Search unavailable" }, corsHeaders());
    }
    const data = await response.json();
    return json(200, data, corsHeaders());
  } catch {
    return json(502, { error: "Search unavailable" }, corsHeaders());
  }
}
