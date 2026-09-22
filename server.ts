import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    name: "Yaru Files Server",
  });
});

// Low-latency AI endpoint: Powered by gemini-3.1-flash-lite
app.post("/api/ai/quick", async (req, res) => {
  try {
    const { prompt, selectedFiles, currentPath } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getAI();

    let contextText = `Current Linux Path: ${currentPath || "/home/ubuntu"}\n`;
    if (selectedFiles && Array.isArray(selectedFiles) && selectedFiles.length > 0) {
      contextText += `Selected File(s):\n${selectedFiles
        .map(
          (f: any) =>
            `- ${f.name} (type: ${f.type || "file"}, size: ${f.size || "unknown"}, path: ${f.path || f.name})`
        )
        .join("\n")}\n`;
    }

    const systemInstruction =
      "You are the fast assistant for Ubuntu Yaru Files (Nautilus). Provide rapid, concise, crystal-clear answers regarding file operations, quick summaries, shell one-liners, and directory advice. Keep answers succinct without unnecessary fluff.";

    const fullPrompt = `${contextText}\nUser Query: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const outputText = response.text || "No response received.";
    res.json({
      text: outputText,
      model: "gemini-3.1-flash-lite",
      latencyMode: "fast",
    });
  } catch (error: any) {
    console.error("Quick AI error:", error);
    res.status(500).json({
      error: error.message || "Failed to process quick query",
      hint: !process.env.GEMINI_API_KEY
        ? "Please set your GEMINI_API_KEY in the Settings > Secrets menu."
        : undefined,
    });
  }
});

// High-thinking AI endpoint: Powered by gemini-3.1-pro-preview with ThinkingLevel.HIGH
app.post("/api/ai/thinking", async (req, res) => {
  try {
    const { prompt, selectedFiles, currentPath, detailedContext } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const ai = getAI();

    let contextText = `Current Ubuntu Path: ${currentPath || "/home/ubuntu"}\n`;
    if (selectedFiles && Array.isArray(selectedFiles) && selectedFiles.length > 0) {
      contextText += `Selected Items:\n${JSON.stringify(selectedFiles, null, 2)}\n`;
    }
    if (detailedContext) {
      contextText += `Detailed Context/File Content:\n${detailedContext}\n`;
    }

    const systemInstruction =
      "You are an expert Linux systems architect and code reasoning engineer inside Ubuntu Yaru Files. Apply deep analysis, high reasoning, edge-case checking, code architectural review, script generation, and structured breakdown. Explain your analysis thoroughly and clearly.";

    const fullPrompt = `${contextText}\nComplex Task/Query:\n${prompt}`;

    // Note: ThinkingLevel.HIGH without maxOutputTokens as strictly required
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: fullPrompt,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const outputText = response.text || "No response generated.";
    res.json({
      text: outputText,
      model: "gemini-3.1-pro-preview",
      thinkingLevel: "HIGH",
    });
  } catch (error: any) {
    console.error("Thinking AI error:", error);
    res.status(500).json({
      error: error.message || "Failed to process high-thinking query",
      hint: !process.env.GEMINI_API_KEY
        ? "Please set your GEMINI_API_KEY in the Settings > Secrets menu."
        : undefined,
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ubuntu Yaru Files server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
