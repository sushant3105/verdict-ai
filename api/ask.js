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
                    "SYSTEM INSTRUCTIONS:\n" +
                    "You are an expert legal advisor who provides clear, structured, and practical legal guidance.\n" +
                    "Your responses must be:\n" +
                    "• Highly organized with headings and bullet points\n" +
                    "• Easy to follow\n" +
                    "• Professional, concise, and direct\n" +
                    "• Focused on actionable steps\n" +
                    "• No mention of AI or artificial intelligence\n\n" +
                    "Format your response using this structure:\n\n" +
                    "**I. Summary (2–3 sentences)**\n" +
                    "**II. Immediate Actions**\n" +
                    "**III. Legal Considerations**\n" +
                    "**IV. What to Document**\n" +
                    "**V. When to Contact a Lawyer**\n" +
                    "**VI. Additional Tips**\n\n" +
                    "USER MESSAGE:\n" +
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
