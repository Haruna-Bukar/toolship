// Vercel serverless function: POST /api/generate
// Body: { tool: "caption-generator", inputs: { ... } }
// The Gemini key lives in an environment variable on the server, never in the browser.

import { tools } from "./_tools.js";

const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

function callGemini(model, prompt) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { tool, inputs } = req.body || {};

  if (typeof tool !== "string" || !Object.hasOwn(tools, tool)) {
    return res.status(400).json({ error: "Unknown tool." });
  }
  if (!inputs || typeof inputs !== "object") {
    return res.status(400).json({ error: "Missing inputs." });
  }

  const def = tools[tool];
  const problem = def.validate(inputs);
  if (problem) {
    return res.status(400).json({ error: problem });
  }

  const prompt = `${def.prompt(inputs)}\nReturn ONLY a JSON array of ${def.count} strings.`;

  try {
    let response;
    for (const model of MODELS) {
      response = await callGemini(model, prompt);
      if (response.ok) break;
      console.error("Model failed:", model, response.status);
      // Try the next model only if this one is missing, busy, or out of quota.
      if (![404, 429, 500, 503].includes(response.status)) break;
    }

    if (!response.ok) {
      const details = await response.text();
      console.error("Gemini error:", response.status, details);
      const busy = [429, 503].includes(response.status);
      return res.status(busy ? 503 : 502).json({
        error: busy
          ? "The AI is busy right now. Please try again in a moment."
          : "The AI service failed. Try again.",
      });
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return res.status(502).json({ error: "The AI returned an unexpected answer. Try again." });
    }

    return res.status(200).json({ results: parsed.slice(0, def.count).map(String) });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}