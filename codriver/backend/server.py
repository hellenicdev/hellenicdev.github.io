from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import os
import time
from collections import defaultdict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = os.getenv("MODEL_ID", "meta-llama/Llama-3.1-8B-Instruct")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
NYT_API_KEY = os.getenv("NYT_API_KEY")

app = FastAPI()

# Allow requests from your GH Pages frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your domain
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

# Simple per-IP rate limiting (protects upstream API costs)
REQUESTS = defaultdict(list)
RATE_LIMIT = 10  # requests per minute per IP
RATE_WINDOW = 60  # seconds

def rate_limited(ip):
    now = time.time()
    REQUESTS[ip] = [t for t in REQUESTS[ip] if now - t < RATE_WINDOW]
    if len(REQUESTS[ip]) >= RATE_LIMIT:
        return True
    REQUESTS[ip].append(now)
    return False

@app.post("/api/chat")
def chat(msg: Message, request: Request):
    ip = request.client.host if request.client else "unknown"
    if rate_limited(ip):
        return JSONResponse(status_code=429, content={"error": "Too many requests"})

    if not HF_TOKEN:
        return JSONResponse(status_code=500, content={"error": "Server not configured"})

    url = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    json_data = {
        "model": MODEL_ID,
        "messages": [{"role": "user", "content": msg.message}]
    }
    try:
        r = requests.post(url, headers=headers, json=json_data, timeout=30)
        r.raise_for_status()
        reply = r.json()["choices"][0]["message"]["content"]
    except Exception:
        return JSONResponse(status_code=502, content={"error": "Upstream error"})
    return {"reply": reply}

@app.get("/api/weather")
def weather(city: str):
    if not WEATHER_API_KEY:
        return JSONResponse(status_code=500, content={"error": "Weather not configured"})
    try:
        r = requests.get(
            f"https://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={city}",
            timeout=10
        )
        r.raise_for_status()
        data = r.json()
        return {"reply": f"🌤 Weather in {data['location']['name']}: {data['current']['temp_c']}°C, {data['current']['condition']['text']}"}
    except Exception:
        return JSONResponse(status_code=502, content={"error": "Weather unavailable"})

@app.get("/api/news")
def news():
    if not NYT_API_KEY:
        return JSONResponse(status_code=500, content={"error": "News not configured"})
    try:
        r = requests.get(
            f"https://api.nytimes.com/svc/topstories/v2/home.json?api-key={NYT_API_KEY}",
            timeout=10
        )
        r.raise_for_status()
        data = r.json()
        titles = [a["title"] for a in data.get("results", [])[:5]]
        return {"reply": "\n".join(f"• {t}" for t in titles)}
    except Exception:
        return JSONResponse(status_code=502, content={"error": "News unavailable"})
