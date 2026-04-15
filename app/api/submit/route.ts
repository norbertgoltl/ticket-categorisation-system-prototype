import { NextRequest, NextResponse } from "next/server";
import { createLogEntry } from "@/lib/logger";
import { LogEntry, SubmitRequest } from "@/types";

export async function POST(req: NextRequest) {
  const logs: LogEntry[] = [];
  const body: SubmitRequest = await req.json();

  logs.push(
    createLogEntry(
      "SUBMIT",
      "Jegy beküldve",
      `Kategória: "${body.categoryName}" | Kiválasztás: ${body.mode === "automatic" ? "automatikus" : "manuális"} | Keresés: ${body.searchMode === "semantic" ? "szemantikus" : "LLM"} | Leírás hossz: ${body.description.length} karakter`
    )
  );

  // Productionban itt történne az adatbázisba írás.
  // Most csak a log bejegyzés szimulál egyet.

  return NextResponse.json({ success: true, logEntries: logs });
}
