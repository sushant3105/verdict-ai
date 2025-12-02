// /api/ask.js  (Node serverless function on Vercel)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GOOGLE_API_KEY on server" });
  }

  const { prompt } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const MODEL = "models/gemini-2.0-flash";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
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
                    "Now write the full HTML answer for this situation:\n\n" +
                    prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ reply: aiText || "No response from AI." });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error while calling Gemini" });
  }
}
