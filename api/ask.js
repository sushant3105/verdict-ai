// /api/ask.js  – Vercel serverless function using OpenRouter

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENROUTER_API_KEY on server" });
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

        // Optional but recommended so OpenRouter can show your app name + origin
        "HTTP-Referer": "https://your-vercel-app-url.vercel.app", // change to your deployed URL
        "X-Title": "Verdict AI – Legal Advisor",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content:
              "You are an expert legal advisor. " +
              "Give clear, practical, structured legal guidance. " +
              "Do NOT mention AI or that you are a model. " +
              "Answer as if you are a human legal professional.\n\n" +
              "VERY IMPORTANT: Return the answer as valid HTML ONLY. " +
              "Do NOT use Markdown. Do NOT use asterisks (* or **). " +
              "Use only these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <br>.\n\n" +
              "FORMAT:\n" +
              "<h2>Summary</h2>\n" +
              "<p>2–3 sentence summary of the situation and main priorities.</p>\n" +
              "<h2>Immediate Actions</h2>\n" +
              "<ul><li>Action step…</li></ul>\n" +
              "<h2>Legal Considerations</h2>\n" +
              "<ul><li>Key legal point…</li></ul>\n" +
              "<h2>What to Document</h2>\n" +
              "<ul><li>Evidence to collect…</li></ul>\n" +
              "<h2>When to Contact a Lawyer</h2>\n" +
              "<ul><li>Situation where a lawyer is recommended…</li></ul>\n" +
              "<h2>Additional Tips</h2>\n" +
              "<ul><li>Extra practical advice…</li></ul>\n\n" +
              "Now write the full HTML answer for this situation:",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(response.status).json({
        error:
          data.error?.message ||
          data.error ||
          `OpenRouter API error (status ${response.status})`,
      });
    }

    const aiText =
      data.choices?.[0]?.message?.content?.trim() ||
      "No response from AI.";

    // Keep the same response shape your frontend expects
    return res.status(200).json({ reply: aiText });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ error: "Server error while calling OpenRouter" });
  }
}
