import { NextResponse } from "next/server";
import { categories } from "@/data/categories";
import { generateEmbedding } from "@/lib/embeddings";
import { getCachedCategories, isCacheReady, setCachedCategories } from "@/lib/cache";
import { createLogEntry } from "@/lib/logger";
import { LogEntry } from "@/types";

export async function GET() {
  const logs: LogEntry[] = [];

  if (isCacheReady()) {
    logs.push(
      createLogEntry("SETUP", "Embedding cache már betöltve, újragenerálás kihagyva", `${getCachedCategories()!.length} kategória`)
    );
    return NextResponse.json({ success: true, cached: true, logEntries: logs });
  }

  logs.push(
    createLogEntry("SETUP", "Kategóriák embedding generálása megkezdve", `${categories.length} kategória`)
  );

  const start = Date.now();

  try {
    const categoriesWithEmbeddings = await Promise.all(
      categories.map(async (cat) => {
        const embedding = await generateEmbedding(cat.name + ". " + cat.description);
        return { ...cat, embedding };
      })
    );

    setCachedCategories(categoriesWithEmbeddings);

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    logs.push(
      createLogEntry("SETUP", "Embedding generálás kész", `Idő: ${elapsed}s | ${categories.length} kategória feldolgozva`)
    );

    return NextResponse.json({ success: true, cached: false, logEntries: logs });
  } catch (error) {
    logs.push(
      createLogEntry("SETUP", "Embedding generálás sikertelen", String(error))
    );
    return NextResponse.json({ success: false, logEntries: logs }, { status: 500 });
  }
}
