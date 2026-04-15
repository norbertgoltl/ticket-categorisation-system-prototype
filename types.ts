export interface Category {
  id: string;
  name: string;
  description: string;
  embedding?: number[];
}

export interface SearchResult {
  category: Category;
  score: number;
  reason?: string;
}

export interface SearchRequest {
  description: string;
  mode: "semantic" | "llm";
}

export interface SearchResponse {
  success: boolean;
  mode: "semantic" | "llm";
  top1?: SearchResult;
  top2?: SearchResult;
  top3?: SearchResult;
  threshold: number;
  belowThreshold: boolean;
  logEntries: LogEntry[];
}

export interface SubmitRequest {
  description: string;
  categoryId: string;
  categoryName: string;
  mode: "automatic" | "manual";
  searchMode: "semantic" | "llm";
}

export interface SubmitResponse {
  success: boolean;
  logEntries: LogEntry[];
}

export interface LogEntry {
  timestamp: string;
  category: "SETUP" | "INPUT" | "SEARCH" | "RESULT" | "ACTION" | "SUBMIT";
  message: string;
  detail?: string;
}
