import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";
import { getCachedCategories, isCacheReady } from "@/lib/cache";
import { createLogEntry } from "@/lib/logger";
import { searchWithLLM } from "@/lib/llm";
import { LogEntry, SearchRequest, SearchResponse } from "@/types";

const SEMANTIC_THRESHOLD = 0.40;

export async function POST(req: NextRequest) {
  const logs: LogEntry[] = [];
  const { description, mode }: SearchRequest = await req.json();

  logs.push(
    createLogEntry(
      "INPUT",
      "Felhasználó leírást küldött",
      `Hossz: ${description.length} karakter | Mód: ${mode === "semantic" ? "Szemantikus" : "LLM"}`
    )
  );

  if (!isCacheReady()) {
    return NextResponse.json(
      { success: false, error: "Kategóriák még nincsenek betöltve." },
      { status: 503 }
    );
  }

  const cachedCategories = getCachedCategories()!;

  // ── SZEMANTIKUS MÓD ──────────────────────────────────────────────────────────
  if (mode === "semantic") {
    logs.push(createLogEntry("SEARCH", "Szemantikus keresés – embedding generálás megkezdve"));
    const searchStart = Date.now();

    let queryEmbedding: number[];
    try {
      queryEmbedding = await generateEmbedding(description);
    } catch (error) {
      logs.push(createLogEntry("SEARCH", "Embedding generálás sikertelen", String(error)));
      return NextResponse.json({ success: false, logEntries: logs }, { status: 500 });
    }

    const elapsed = ((Date.now() - searchStart) / 1000).toFixed(2);
    logs.push(createLogEntry("SEARCH", "Embedding kész", `Idő: ${elapsed}s`));
    logs.push(
      createLogEntry("SEARCH", "Cosine similarity számítás futtatva", `${cachedCategories.length} kategórián`)
    );

    const scored = cachedCategories
      .map((cat) => ({
        category: cat,
        score: cosineSimilarity(queryEmbedding, cat.embedding!),
      }))
      .sort((a, b) => b.score - a.score);

    const top3 = scored.slice(0, 3);

    top3.forEach((result, idx) => {
      logs.push(
        createLogEntry(
          "RESULT",
          `Top ${idx + 1}: "${result.category.name}"`,
          `Score: ${result.score.toFixed(4)}`
        )
      );
    });

    const belowThreshold = top3[0].score < SEMANTIC_THRESHOLD;

    logs.push(
      createLogEntry(
        "RESULT",
        `Threshold: ${SEMANTIC_THRESHOLD} | Besorolás: ${belowThreshold ? "SIKERTELEN" : "SIKERES"}`,
        `Top 1 score: ${top3[0].score.toFixed(4)}`
      )
    );

    if (!belowThreshold) {
      logs.push(
        createLogEntry("ACTION", "Jegy automatikusan besorolva", `Kategória: "${top3[0].category.name}"`)
      );
    } else {
      logs.push(
        createLogEntry("ACTION", "Besorolás sikertelen – pontosítás szükséges", `Legjobb score: ${top3[0].score.toFixed(4)} < ${SEMANTIC_THRESHOLD}`)
      );
    }

    const response: SearchResponse = {
      success: true,
      mode: "semantic",
      top1: top3[0],
      top2: top3[1],
      top3: top3[2],
      threshold: SEMANTIC_THRESHOLD,
      belowThreshold,
      logEntries: logs,
    };

    return NextResponse.json(response);
  }

  // ── LLM MÓD ─────────────────────────────────────────────────────────────────
  if (mode === "llm") {
    logs.push(
      createLogEntry("SEARCH", "LLM keresés megkezdve", `${cachedCategories.length} kategória átadva a promptnak`)
    );

    try {
      const result = await searchWithLLM(description, cachedCategories);

      logs.push(
        createLogEntry(
          "SEARCH",
          "LLM válasz megérkezett",
          `Idő: ${result.elapsedSeconds}s | Modell: ${result.model} | Tokenek: ${result.totalTokens} (prompt: ${result.promptTokens}, completion: ${result.completionTokens})`
        )
      );

      result.top3.forEach((r, idx) => {
        logs.push(
          createLogEntry(
            "RESULT",
            `Top ${idx + 1}: "${r.category.name}"`,
            `Confidence: ${(r.score * 100).toFixed(0)}% | Indoklás: ${r.reason}`
          )
        );
      });

      logs.push(
        createLogEntry(
          "RESULT",
          `Besorolás: ${result.belowThreshold ? "SIKERTELEN" : "SIKERES"}`,
          result.belowThreshold
            ? "LLM nem tudott egyértelmű kategóriát találni"
            : `Top 1: "${result.top3[0]?.category.name}"`
        )
      );

      if (!result.belowThreshold && result.top3[0]) {
        logs.push(
          createLogEntry("ACTION", "Jegy automatikusan besorolva", `Kategória: "${result.top3[0].category.name}"`)
        );
      } else {
        logs.push(
          createLogEntry("ACTION", "Besorolás sikertelen – pontosítás szükséges")
        );
      }

      const response: SearchResponse = {
        success: true,
        mode: "llm",
        top1: result.top3[0],
        top2: result.top3[1],
        top3: result.top3[2],
        threshold: 0.40,
        belowThreshold: result.belowThreshold,
        logEntries: logs,
      };

      return NextResponse.json(response);
    } catch (error) {
      logs.push(createLogEntry("SEARCH", "LLM hívás sikertelen", String(error)));
      return NextResponse.json({ success: false, logEntries: logs }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, error: "Ismeretlen mód." }, { status: 400 });
}
