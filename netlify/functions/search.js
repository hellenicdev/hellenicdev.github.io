// netlify/functions/search.js
// Uses Node 18+ native fetch (no dependencies required).

export async function handler(event) {
  const query = (event.queryStringParameters.q || "").trim().slice(0, 200);
  if (!query) return { statusCode: 400, body: 'Missing query parameter' };

  const apiKey = process.env.GOOGLE_API_KEY; // from environment vars
  const cx = process.env.GOOGLE_CSE_ID;

  if (!apiKey || !cx) {
    return { statusCode: 500, body: 'Search not configured' };
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify(data) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
