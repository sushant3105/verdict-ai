// script.js – FRONTEND ONLY, no API key here

async function askAI() {
  const input = document.getElementById("userInput").value.trim();
  const box = document.getElementById("response");

  if (!input) {
    box.textContent = "Please enter your case details.";
    return;
  }

  box.textContent = "Thinking ...";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await response.json();

    if (!response.ok) {
      box.textContent = "API Error: " + (data.error || "Unknown error");
      return;
    }

    box.innerHTML = data.reply || "No response from AI.";
  } catch (err) {
    console.error("Network / Fetch Error:", err);
    box.textContent = "Network error. See console.";
  }
}
