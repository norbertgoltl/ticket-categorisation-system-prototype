import OpenAI from "openai";
import { Category, SearchResult } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LLM_MODEL = "gpt-4o-mini";
const LLM_THRESHOLD = 40; // confidence 0-100 skálán

interface LLMResult {
  id: string;
  confidence: number;
  reason: string;
}

interface LLMResponse {
  belowThreshold: boolean;
  results: LLMResult[];
}

interface LLMSearchOutput {
  top3: SearchResult[];
  belowThreshold: boolean;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  elapsedSeconds: string;
  model: string;
}

export async function searchWithLLM(
  description: string,
  categories: Category[]
): Promise<LLMSearchOutput> {
  const categoryList = categories
    .map((c) => `ID: ${c.id}\nNév: ${c.name}\nLeírás: ${c.description}`)
    .join("\n\n");

  const systemPrompt = `Te egy ticket kategorizáló rendszer vagy egy média ügynökségnél.
Az alábbi kategóriák közül válaszd ki a 3 legmegfelelőbbet a felhasználó problémájára.

Ha egyik kategória sem illeszkedik egyértelműen (egyik confidence értéke sem éri el a ${LLM_THRESHOLD}-et),
akkor a belowThreshold mezőt állítsd true-ra, és a results tömb lehet üres vagy részleges.

Válaszolj KIZÁRÓLAG valid JSON formátumban, semmi más szöveg ne szerepeljen a válaszban:
{
  "belowThreshold": boolean,
  "results": [
    { "id": "kategória id", "confidence": 0-100, "reason": "rövid magyar nyelvű indoklás" },
    { "id": "kategória id", "confidence": 0-100, "reason": "rövid magyar nyelvű indoklás" },
    { "id": "kategória id", "confidence": 0-100, "reason": "rövid magyar nyelvű indoklás" }
  ]
}

A confidence egy 0-100 közötti egész szám, ahol 100 a teljes bizonyosság.
Az indoklás legyen tömör, maximum 1-2 mondat magyarul.

Elérhető kategóriák:
${categoryList}`;

  const start = Date.now();

  const response = await openai.chat.completions.create({
    model: LLM_MODEL,
    max_tokens: 500,
    temperature: 0,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Felhasználó problémája: ${description}` },
    ],
  });

  const elapsedSeconds = ((Date.now() - start) / 1000).toFixed(2);
  const usage = response.usage!;
  const rawContent = response.choices[0].message.content || "";

  let parsed: LLMResponse;
  try {
    const cleaned = rawContent.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM válasz JSON parse hiba: ${rawContent.slice(0, 200)}`);
  }

  // Kategóriák visszakeresése ID alapján, score normalizálása 0-1 közé
  const top3: SearchResult[] = (parsed.results || [])
    .slice(0, 3)
    .reduce<SearchResult[]>((acc, r) => {
      const category = categories.find((c) => c.id === r.id);
      if (!category) return acc;
      acc.push({
        category,
        score: r.confidence / 100,
        reason: r.reason,
      });
      return acc;
    }, []);

  return {
    top3,
    belowThreshold: parsed.belowThreshold,
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    elapsedSeconds,
    model: LLM_MODEL,
  };
}