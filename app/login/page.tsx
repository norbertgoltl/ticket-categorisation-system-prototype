"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Prototípus hozzáférés</h1>
          <p className="text-sm text-gray-500 mt-1">Add meg a jelszót a folytatáshoz.</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
            placeholder="Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-600">Hibás jelszó.</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !password.trim()}
            className="w-full px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Ellenőrzés..." : "Belépés"}
          </button>
        </div>
      </div>
    </main>
  );
}