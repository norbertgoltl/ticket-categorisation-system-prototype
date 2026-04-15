import { LogEntry } from "../types";

export function createLogEntry(
  category: LogEntry["category"],
  message: string,
  detail?: string
): LogEntry {
  const now = new Date();
  const timestamp = now.toTimeString().slice(0, 8);
  return { timestamp, category, message, detail };
}
