"use client";

import { useEffect, useRef, useState } from "react";
import { LogEntry, SearchResponse } from "@/types";

type AppState =
  | "initializing"
  | "ready"
  | "searching"
  | "result"
  | "below_threshold"
  | "submitted"
  | "error";

type SearchMode = "semantic" | "llm";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("initializing");
  const [searchMode, setSearchMode] = useState<SearchMode>("semantic");
  const [description, setDescription] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<"automatic" | "manual">("automatic");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLogs = (entries: LogEntry[]) => {
    setLogs((prev) => [...prev, ...entries]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    async function setup() {
      try {
        const res = await fetch("/api/setup");
        const data = await res.json();
        addLogs(data.logEntries || []);
        if (data.success) {
          setAppState("ready");
        } else {
          setErrorMessage("Nem sikerült betölteni a kategóriákat.");
          setAppState("error");
        }
      } catch {
        setErrorMessage("Szerver kapcsolati hiba az inicializálás során.");
        setAppState("error");
      }
    }
    setup();
  }, []);

  const handleSearch = async () => {
    if (!description.trim()) return;
    setAppState("searching");
    setSearchResult(null);
    setSelectedCategoryId(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, mode: searchMode }),
      });
      const data: SearchResponse = await res.json();
      addLogs(data.logEntries || []);
      setSearchResult(data);

      if (data.belowThreshold) {
        setAppState("below_threshold");
      } else {
        setSelectedCategoryId(data.top1!.category.id);
        setSelectionMode("automatic");
        setAppState("result");
      }
    } catch {
      setErrorMessage("Keresési hiba történt.");
      setAppState("error");
    }
  };

  const handleSelectAlternative = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectionMode("manual");
    const entry: LogEntry = {
      timestamp: new Date().toTimeString().slice(0, 8),
      category: "ACTION",
      message: "Felhasználó manuálisan átváltott",
      detail: `Kategória ID: ${categoryId}`,
    };
    addLogs([entry]);
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (appState === "result" || appState === "below_threshold") {
      const entry: LogEntry = {
        timestamp: new Date().toTimeString().slice(0, 8),
        category: "ACTION",
        message: "Leírás módosítva – újrakeresés szükséges",
        detail: `Új hossz: ${val.length} karakter`,
      };
      addLogs([entry]);
      setAppState("ready");
      setSearchResult(null);
      setSelectedCategoryId(null);
    }
  };

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    if (appState === "result" || appState === "below_threshold") {
      const entry: LogEntry = {
        timestamp: new Date().toTimeString().slice(0, 8),
        category: "ACTION",
        message: "Keresési mód váltva – újrakeresés szükséges",
        detail: `Új mód: ${mode === "semantic" ? "Szemantikus" : "LLM"}`,
      };
      addLogs([entry]);
      setAppState("ready");
      setSearchResult(null);
      setSelectedCategoryId(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategoryId || !searchResult) return;

    const allResults = [searchResult.top1, searchResult.top2, searchResult.top3].filter(Boolean);
    const selected = allResults.find((r) => r!.category.id === selectedCategoryId);
    if (!selected) return;

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          categoryId: selectedCategoryId,
          categoryName: selected.category.name,
          mode: selectionMode,
          searchMode,
        }),
      });
      const data = await res.json();
      addLogs(data.logEntries || []);
      if (data.success) {
        setAppState("submitted");
      }
    } catch {
      setErrorMessage("Beküldési hiba történt.");
      setAppState("error");
    }
  };

  const handleReset = () => {
    setAppState("ready");
    setDescription("");
    setSearchResult(null);
    setSelectedCategoryId(null);
    setErrorMessage("");
  };

  const getSelectedCategory = () => {
    if (!searchResult || !selectedCategoryId) return null;
    const all = [searchResult.top1, searchResult.top2, searchResult.top3].filter(Boolean);
    return all.find((r) => r!.category.id === selectedCategoryId) || null;
  };

  const logCategoryColor: Record<LogEntry["category"], string> = {
    SETUP: "text-blue-600",
    INPUT: "text-gray-600",
    SEARCH: "text-yellow-600",
    RESULT: "text-green-600",
    ACTION: "text-purple-600",
    SUBMIT: "text-red-600",
  };

  const isLLM = searchMode === "llm";

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Ticket bejelentő</h1>
          <p className="text-sm text-gray-500 mt-1">
            Írja le a problémáját, a rendszer automatikusan besorolja a megfelelő kategóriába.
          </p>
        </div>

        {/* Initializing */}
        {appState === "initializing" && (
          <div className="text-sm text-gray-500">Kategóriák betöltése folyamatban...</div>
        )}

        {/* Error */}
        {appState === "error" && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Main form */}
        {(appState === "ready" || appState === "searching" || appState === "result" || appState === "below_threshold") && (
          <div className="space-y-4">

            {/* Mód választó */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Keresési mód</p>
              <div className="inline-flex rounded border border-gray-300 overflow-hidden">
                <button
                  onClick={() => handleModeChange("semantic")}
                  className={`px-4 py-1.5 text-sm ${
                    searchMode === "semantic"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Szemantikus
                </button>
                <button
                  onClick={() => handleModeChange("llm")}
                  className={`px-4 py-1.5 text-sm border-l border-gray-300 ${
                    searchMode === "llm"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  LLM
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probléma leírása
              </label>
              <textarea
                className="w-full border border-gray-300 rounded p-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                rows={5}
                placeholder="Pl. Az FM adónk reggel 6 óta nem sugároz, a stúdióból a jel nem jut el az adóhoz..."
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                disabled={appState === "searching"}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={appState === "searching" || !description.trim()}
              className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {appState === "searching" ? "Besorolás folyamatban..." : "Kategória meghatározása"}
            </button>

            {/* Below threshold */}
            {appState === "below_threshold" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                <p className="font-medium">Nem sikerült egyértelműen besorolni a problémát.</p>
                <p className="mt-1">Kérjük, pontosítsa a leírást, és próbálja újra.</p>
              </div>
            )}

            {/* Result */}
            {appState === "result" && searchResult && (
              <div className="space-y-3">
                {/* Top 1 */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Besorolt kategória</p>
                  <div
                    className={`border rounded p-3 cursor-pointer text-sm ${
                      selectedCategoryId === searchResult.top1!.category.id
                        ? "border-gray-800 bg-gray-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSelectAlternative(searchResult.top1!.category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{searchResult.top1!.category.name}</span>
                      <span className="text-xs text-gray-500">
                        {isLLM ? "Confidence" : "Score"}: {(searchResult.top1!.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    {isLLM && searchResult.top1!.reason && (
                      <p className="mt-1 text-xs text-gray-500 italic">{searchResult.top1!.reason}</p>
                    )}
                  </div>
                </div>

                {/* Top 2-3 */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Alternatív javaslatok</p>
                  <div className="space-y-2">
                    {[searchResult.top2, searchResult.top3].filter(Boolean).map((result) => (
                      <div
                        key={result!.category.id}
                        onClick={() => handleSelectAlternative(result!.category.id)}
                        className={`border rounded p-3 cursor-pointer text-sm ${
                          selectedCategoryId === result!.category.id
                            ? "border-gray-800 bg-gray-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`${selectedCategoryId === result!.category.id ? "font-medium" : ""} text-gray-800`}>
                            {result!.category.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {isLLM ? "Confidence" : "Score"}: {(result!.score * 100).toFixed(1)}%
                          </span>
                        </div>
                        {isLLM && result!.reason && (
                          <p className="mt-1 text-xs text-gray-500 italic">{result!.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected summary */}
                {getSelectedCategory() && (
                  <div className="text-xs text-gray-500">
                    Kiválasztott:{" "}
                    <span className="font-medium text-gray-700">
                      {getSelectedCategory()!.category.name}
                    </span>{" "}
                    {selectionMode === "manual" && "(manuálisan módosítva)"}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!selectedCategoryId}
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Jegy beküldése
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submitted */}
        {appState === "submitted" && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-medium">Jegy sikeresen beküldve.</p>
              <p className="mt-1">
                Kategória:{" "}
                <span className="font-semibold">{getSelectedCategory()?.category.name}</span>
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
            >
              Új jegy beküldése
            </button>
          </div>
        )}

        {/* Log panel */}
        {logs.length > 0 && (
          <div className="border border-gray-200 rounded">
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rendszernapló</p>
            </div>
            <div className="p-3 max-h-64 overflow-y-auto font-mono text-xs space-y-1 bg-white">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-400 shrink-0">[{log.timestamp}]</span>
                  <span className={`shrink-0 w-14 ${logCategoryColor[log.category]}`}>
                    {log.category}
                  </span>
                  <span className="text-gray-700">{log.message}</span>
                  {log.detail && (
                    <span className="text-gray-500">| {log.detail}</span>
                  )}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
