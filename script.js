const API_KEY = "AIzaSyCUxUuVG4OvuHXhC6U6Uj2RbJIdWRUiL9U";
const MODEL = "models/gemini-2.0-flash";  // Use a model you saw in ListModels output

async function askAI() {
  const input = document.getElementById("userInput").value.trim();
  const box = document.getElementById("response");
  if (!input) {
    box.textContent = "Please enter your case details.";
    return;
  }
  box.textContent = "Thinking ...";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "You are a professional legal advisor. Provide structured, safe legal guidance for:\n\n" + input }
              ]
            }
          ]
        })
      }
    );
    const data = await response.json();
    if (data.error) {
      box.textContent = "API Error: " + data.error.message;
      return;
    }
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    box.textContent = aiText || "No response from AI.";
  } catch (err) {
    console.error("Network / Fetch Error:", err);
    box.textContent = "Network error. See console.";
  }
}
