import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { INITIAL_COMMUNITY_THEMES } from "./src/data/defaultThemes";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Local persistent themes file path
const THEMES_FILE = path.join(process.cwd(), "user_themes.json");

function loadThemes(): any[] {
  try {
    if (fs.existsSync(THEMES_FILE)) {
      const data = fs.readFileSync(THEMES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading themes file, falling back to initial seed:", err);
  }
  // Initialize with seed themes
  try {
    fs.writeFileSync(THEMES_FILE, JSON.stringify(INITIAL_COMMUNITY_THEMES, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not write initial themes file:", e);
  }
  return [...INITIAL_COMMUNITY_THEMES];
}

function saveThemes(themes: any[]) {
  try {
    fs.writeFileSync(THEMES_FILE, JSON.stringify(themes, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving themes to file:", err);
  }
}

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

// Community Themes Endpoints
app.get("/api/themes", (req, res) => {
  try {
    let themes = loadThemes();
    const { search, mode, sort } = req.query;

    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      themes = themes.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.author.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
      );
    }

    if (mode && typeof mode === "string" && mode !== "all") {
      themes = themes.filter((t) => t.baseMode === mode);
    }

    if (sort === "newest") {
      themes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "name") {
      themes.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // default: popular by likes
      themes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    res.json({ themes });
  } catch (error: any) {
    console.error("Error retrieving themes:", error);
    res.status(500).json({ error: "Failed to fetch community themes" });
  }
});

app.post("/api/themes", (req, res) => {
  try {
    const {
      name,
      author,
      description,
      baseMode,
      accentColor,
      headerColor,
      sidebarColor,
      windowBg,
      dockColor,
      borderRadius,
      tags,
      version,
    } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "Theme name is required." });
      return;
    }

    if (!accentColor || typeof accentColor !== "string") {
      res.status(400).json({ error: "Valid accent color is required." });
      return;
    }

    const themes = loadThemes();

    const newTheme = {
      id: `theme-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim().slice(0, 50),
      author: (author && typeof author === "string" ? author.trim() : "Ubuntu Enthusiast").slice(0, 40),
      description: (description && typeof description === "string" ? description.trim() : "Custom Yaru theme crafted by the Ubuntu community.").slice(0, 250),
      version: version && typeof version === "string" ? version.trim() : "1.0.0",
      baseMode: baseMode === "light" || baseMode === "aubergine" ? baseMode : "dark",
      accentColor: accentColor.startsWith("#") ? accentColor : `#${accentColor}`,
      headerColor: headerColor || (baseMode === "light" ? "#F2F2F2" : "#2D2D2D"),
      sidebarColor: sidebarColor || (baseMode === "light" ? "#E8E8E8" : "#242424"),
      windowBg: windowBg || (baseMode === "light" ? "#FAFAFA" : "#1E1E1E"),
      dockColor: dockColor || "rgba(17, 17, 17, 0.95)",
      borderRadius: typeof borderRadius === "number" ? Math.min(Math.max(borderRadius, 0), 24) : 12,
      tags: Array.isArray(tags) && tags.length > 0 ? tags.map((t: string) => String(t).trim().toLowerCase()) : ["custom", "community"],
      likes: 1,
      downloads: 1,
      createdAt: new Date().toISOString(),
      isOfficial: false,
    };

    themes.unshift(newTheme);
    saveThemes(themes);

    res.status(201).json({
      theme: newTheme,
      message: "Custom Yaru theme published successfully to the community gallery!",
    });
  } catch (error: any) {
    console.error("Error publishing custom theme:", error);
    res.status(500).json({ error: "Failed to publish theme" });
  }
});

app.post("/api/themes/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const themes = loadThemes();
    const theme = themes.find((t) => t.id === id);

    if (!theme) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }

    theme.likes = (theme.likes || 0) + 1;
    saveThemes(themes);

    res.json({ theme, likes: theme.likes });
  } catch (error: any) {
    console.error("Error liking theme:", error);
    res.status(500).json({ error: "Failed to like theme" });
  }
});

app.get("/api/themes/:id/export", (req, res) => {
  try {
    const { id } = req.params;
    const themes = loadThemes();
    const theme = themes.find((t) => t.id === id);

    if (!theme) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }

    // Increment downloads count
    theme.downloads = (theme.downloads || 0) + 1;
    saveThemes(themes);

    const safeFilename = `${theme.name.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()}_yaru_theme.json`;
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(theme, null, 2));
  } catch (error: any) {
    console.error("Error exporting theme:", error);
    res.status(500).json({ error: "Failed to export theme" });
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
