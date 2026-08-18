// Theme
const html = document.documentElement;
let prefs = { theme: "light" };
try {
  prefs = JSON.parse(localStorage.getItem("preferences")) || prefs;
} catch (e) { /* corrupted storage — fall back to defaults */ }
html.setAttribute("data-theme", prefs.theme);

// DOM
const userInput = document.getElementById("userInput");
const messageArea = document.getElementById("messageArea");
const micStatus = document.getElementById("micStatus");
const themeToggle = document.getElementById("themeToggle");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const typingIndicator = document.getElementById("typingIndicator");
const suggestions = document.getElementById("suggestions");

// Constants
const API_BASE = "https://new-codriver.onrender.com/api";
const BACKEND_URL = API_BASE + "/chat";

let gameActive = false;
let secretNumber = null;

// Theme
themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  html.setAttribute("data-theme", next);
  prefs.theme = next;
  localStorage.setItem("preferences", JSON.stringify(prefs));
});

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.addEventListener("start", () => {
    micStatus.style.display = "block";
    micBtn.style.background = "#ef476f";
    micBtn.style.color = "white";
  });

  recognition.addEventListener("end", () => {
    micStatus.style.display = "none";
    micBtn.style.background = "";
    micBtn.style.color = "";
  });

  recognition.addEventListener("result", (event) => {
    userInput.value = event.results[0][0].transcript;
    sendMessage();
  });

  micBtn.addEventListener("click", () => {
    try {
      recognition.start();
    } catch (e) {
      // already listening or unsupported — ignore
    }
  });
} else {
  micBtn.style.display = "none";
}

// Typing Indicator
function showTyping() {
  typingIndicator.classList.add("active");
  messageArea.scrollTop = messageArea.scrollHeight;
}

function hideTyping() {
  typingIndicator.classList.remove("active");
}

// Message Rendering
function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.innerHTML = `
    <div class="message-avatar user">👤</div>
    <div class="message-content">
      <div class="message-bubble">${escapeHtml(text)}</div>
    </div>
  `;
  messageArea.appendChild(msg);
  scrollToBottom();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function addAssistantMessage(response) {
  hideTyping();

  const msg = document.createElement("div");
  msg.className = "message assistant";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = response;

  const content = document.createElement("div");
  content.className = "message-content";
  content.appendChild(bubble);

  const actions = document.createElement("div");
  actions.className = "message-actions";

  const speakerBtn = document.createElement("button");
  speakerBtn.innerHTML = "🔊";
  speakerBtn.title = "Read aloud";
  speakerBtn.addEventListener("click", () => speak(response));
  actions.appendChild(speakerBtn);

  content.appendChild(actions);

  msg.innerHTML = `<div class="message-avatar assistant">🤖</div>`;
  msg.appendChild(content);

  messageArea.appendChild(msg);
  scrollToBottom();
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    messageArea.scrollTop = messageArea.scrollHeight;
  });
}

// Utility
function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

// External Fetches (proxied through backend — no API keys in the browser)
async function fetchWeather(city) {
  try {
    const resp = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}`);
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    return data.reply || "Sorry, I couldn't fetch the weather.";
  } catch {
    return "Sorry, I couldn't fetch the weather.";
  }
}

async function fetchNews() {
  try {
    const resp = await fetch(`${API_BASE}/news`);
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    return data.reply || "Sorry, I couldn't fetch the top news.";
  } catch {
    return "Sorry, I couldn't fetch the top news.";
  }
}

// Data
function getRandomQuote() {
  return [
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Be the change you wish to see in the world.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "Keep your face always toward the sunshine—and shadows will fall behind you.",
    "The best time to plant a tree was 20 years ago. The second best time is now."
  ][Math.floor(Math.random() * 5)];
}

function getRandomFunFact() {
  return [
    "Honey never spoils!",
    "Bananas are berries, but strawberries aren't!",
    "Sharks existed before trees.",
    "Octopuses have three hearts.",
    "A day on Venus is longer than a year on Venus."
  ][Math.floor(Math.random() * 5)];
}

function getRandomJoke() {
  return [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I told my computer I needed a break, and it said 'No problem, I'll go to sleep.'",
    "What do you call fake spaghetti? An impasta!",
    "Why did the math book look so sad? Because it had too many problems."
  ][Math.floor(Math.random() * 5)];
}

function getRandomRiddle() {
  return [
    "What has keys but can't open locks? A piano.",
    "What can travel around the world while staying in one spot? A stamp.",
    "What gets wetter the more it dries? A towel.",
    "What has an eye but cannot see? A needle.",
    "What building has the most stories? The library."
  ][Math.floor(Math.random() * 5)];
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `The current time is ${formattedHours}:${minutes} ${period}.`;
}

// Main
async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  addUserMessage(input);

  let response = "";

  if (gameActive) {
    if (/exit game/i.test(input)) {
      gameActive = false;
      response = "Game exited. How else can I assist you?";
    } else if (/^\d+$/.test(input)) {
      const guess = parseInt(input, 10);
      if (guess === secretNumber) {
        gameActive = false;
        response = "🎉 Congratulations! You guessed it right!";
      } else if (guess < secretNumber) {
        response = "⬆️ Too low. Try again!";
      } else {
        response = "⬇️ Too high. Try again!";
      }
    } else {
      response = "We're in a game! Please enter a number or type 'exit game'.";
    }
    userInput.value = "";
    addAssistantMessage(response);
    return;
  }

  if (/hello|hi|hey|greetings/i.test(input)) response = "Hello! How can I assist you today?";
  else if (/quote/i.test(input)) response = getRandomQuote();
  else if (/weather (.+)/i.test(input)) {
    const city = input.match(/weather (.+)/i)[1];
    showTyping();
    response = await fetchWeather(city);
  } else if (/news/i.test(input)) {
    showTyping();
    response = await fetchNews();
  } else if (/fun fact/i.test(input)) response = getRandomFunFact();
  else if (/joke/i.test(input)) response = getRandomJoke();
  else if (/riddle/i.test(input)) response = getRandomRiddle();
  else if (/time/i.test(input)) response = getCurrentTime();
  else if (/game/i.test(input)) {
    gameActive = true;
    secretNumber = Math.floor(Math.random() * 10) + 1;
    response = "🎲 Let's play a game! I'm thinking of a number between 1 and 10. What's your guess?";
  } else {
    showTyping();
    try {
      const apiResp = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await apiResp.json();
      response = data.reply || "Sorry, I didn't understand that.";
    } catch {
      response = "Sorry, I couldn't connect to the server.";
    }
  }

  userInput.value = "";
  addAssistantMessage(response);
}

// Quick Action Chips
suggestions.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  userInput.value = chip.getAttribute("data-command");
  sendMessage();
});

// Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Buttons
sendBtn.addEventListener("click", sendMessage);
