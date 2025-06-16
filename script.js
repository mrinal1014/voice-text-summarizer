const inputText = document.getElementById("inputText");
const summaryOutput = document.getElementById("summaryOutput");
const summarizeBtn = document.getElementById("summarizeBtn");
const speakBtn = document.getElementById("speakBtn");
const startVoice = document.getElementById("startVoice");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;


  inputText.addEventListener("input", () => {
    inputText.style.height = "auto"; // reset height
    inputText.style.height = inputText.scrollHeight + "px"; // expand to fit content
  });

  // Optional: auto-size on page load if pre-filled
  window.addEventListener("load", () => {
    inputText.style.height = "auto";
    inputText.style.height = inputText.scrollHeight + "px";
  });


// ----- Animated Intro Typing with Sound -----
const introLines = [
  "Hi, I’m Mrinal 👋",
  "Welcome to Voice-Text Summarizer — a sleek, no-fuss tool that transforms your thoughts into concise summaries, whether spoken or typed.",
  "Crafted with care 💙, combining voice tech and minimalist design to make your experience seamless and smart."
];

const animatedIntro = document.getElementById("animatedIntro");
const typingSound = new Audio("assets/typing.mp3");

function playTypingAnimation(lines, element, lineDelay = 1200, charDelay = 30) {
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) return;

    const p = document.createElement("p");
    element.appendChild(p);
    const line = lines[lineIndex];
    let charIndex = 0;

    // Sound: replay only once at start of each line
    try {
      typingSound.currentTime = 0;
      typingSound.play().catch(() => {});
    } catch (e) {}

    function typeChar() {
      if (charIndex < line.length) {
        p.innerHTML += line.charAt(charIndex);  // ⬅ innerHTML supports emoji or markup
        charIndex++;
        setTimeout(typeChar, charDelay);
      } else {
        lineIndex++;
        setTimeout(typeLine, lineDelay);
      }
    }

    typeChar();
  }

  typeLine();
}

// ---- Toast Notification ----
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.getElementById("toastContainer").appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// ---- Typewriter Effect ----
function typeWriter(text, element, speed = 30) {
  element.textContent = '';
  let i = 0;
  element.classList.add('typing');

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.classList.remove('typing');
    }
  }

  type();
}

// ---- Theme Toggle ----
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});

// ---- Summarize Action ----
summarizeBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) return showToast("Please enter or speak some text.");

  typeWriter("Summarizing...", summaryOutput);

  try {
    const res = await fetch("https://backend-uqe7.onrender.com/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (data.summary) {
      typeWriter(data.summary, summaryOutput);
      showToast("Summary generated successfully!");
    } else {
      summaryOutput.textContent = "No summary returned.";
      showToast("Summarization failed.");
    }
  } catch (err) {
    summaryOutput.textContent = "Error contacting server.";
    showToast("Server error occurred.");
    console.error(err);
  }
});

// ---- Voice Input ----
startVoice.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return showToast("Speech recognition not supported.");

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  startVoice.classList.add("recording");
  showToast("Listening...");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value += " " + transcript;
    showToast("Voice captured successfully!");
  };

  recognition.onend = () => startVoice.classList.remove("recording");

  recognition.onerror = (event) => {
    startVoice.classList.remove("recording");
    showToast("Speech recognition error: " + event.error);
  };
});

// ---- Speak Summary ----
speakBtn.addEventListener("click", () => {
  const summary = summaryOutput.textContent.trim();
  if (!summary) return showToast("No summary to speak.");

  const utterance = new SpeechSynthesisUtterance(summary);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
  showToast("Reading summary aloud...");
});

// ---- Download Summary ----
downloadBtn.addEventListener("click", () => {
  const summary = summaryOutput.textContent.trim();
  if (!summary) return showToast("Nothing to download.");

  const blob = new Blob([summary], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "summary.txt";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Summary downloaded as summary.txt");
});

// ---- Init: Theme, Intro Typing, Particles ----
window.addEventListener("DOMContentLoaded", () => {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark");

  // Start typing intro
  playTypingAnimation(introLines, animatedIntro);

  // Initialize tsParticles
  tsParticles.load("particles-js", {
    fullScreen: { enable: false },
    background: { color: "transparent" },
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#00bfff" },
      shape: { type: "circle" },
      opacity: { value: 0.4 },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        outModes: { default: "out" }
      },
      links: {
        enable: true,
        distance: 150,
        color: "#00bfff",
        opacity: 0.3,
        width: 1
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 2 }
      }
    },
    detectRetina: true
  });
});
