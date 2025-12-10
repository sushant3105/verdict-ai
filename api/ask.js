// /api/ask.js  -- CommonJS version for Vercel using Perplexity API

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing PERPLEXITY_API_KEY" });
  }

  const { prompt } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // 🔁 Change this to whatever Perplexity model you want, e.g. "sonar-pro", etc.
        model: "sonar",

        messages: [
          {
            role: "system",
            content:
              "You are an expert legal advisor. " +
              "Give clear, practical, structured legal guidance. " +
              "Do NOT mention that you are an AI or model. " +
              "Return valid HTML ONLY (no Markdown). " +
              "Allowed tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <br>."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Perplexity API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Perplexity API error",
      });
    }

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "No response from Perplexity.";

    // Keep the same shape your frontend expects
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server error while calling Perplexity API",
    });
  }
};
