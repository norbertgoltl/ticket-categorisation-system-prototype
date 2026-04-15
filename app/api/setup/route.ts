import { NextResponse } from "next/server";
import { isCacheReady, getCachedCategories } from "@/lib/cache";
import { createLogEntry } from "@/lib/logger";
import { ensureCacheReady } from "@/lib/setup";
import { LogEntry } from "@/types";

export async function GET() {
  const logs: LogEntry[] = [];

  if (isCacheReady()) {
    logs.push(
      createLogEntry("SETUP", "Embedding cache már betöltve, újragenerálás kihagyva", `${getCachedCategories()!.length} kategória`)
    );
    return NextResponse.json({ success: true, cached: true, logEntries: logs });
  }

  try {
    const { logs: setupLogs } = await ensureCacheReady();
    logs.push(...setupLogs);
    return NextResponse.json({ success: true, cached: false, logEntries: logs });
  } catch (error) {
    logs.push(
      createLogEntry("SETUP", "Embedding generálás sikertelen", String(error))
    );
    return NextResponse.json({ success: false, logEntries: logs }, { status: 500 });
  }
}