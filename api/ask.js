// /api/ask.js  -- CommonJS version for Vercel

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENROUTER_API_KEY" });
  }

  const { prompt } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://your-app.vercel.app",
        "X-Title": "Verdict AI"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content:
              "Return valid HTML ONLY. No markdown. Use <h2>, <h3>, <p>, <ul>, <li>, <strong>."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error Response:", data);
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter API error"
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error while calling OpenRouter" });
  }
};
