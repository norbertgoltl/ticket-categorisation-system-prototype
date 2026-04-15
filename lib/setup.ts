import { categories } from "@/data/categories";
import { generateEmbedding } from "@/lib/embeddings";
import { getCachedCategories, isCacheReady, setCachedCategories } from "@/lib/cache";
import { createLogEntry } from "@/lib/logger";
import { Category, LogEntry } from "@/types";

export async function ensureCacheReady(): Promise<{ categories: Category[]; logs: LogEntry[] }> {
  const logs: LogEntry[] = [];

  if (isCacheReady()) {
    return { categories: getCachedCategories()!, logs };
  }

  logs.push(
    createLogEntry("SETUP", "Cache üres (cold start) – embedding generálás megkezdve", `${categories.length} kategória`)
  );

  const start = Date.now();

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

  return { categories: categoriesWithEmbeddings, logs };
}