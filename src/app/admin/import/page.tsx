"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportEcoles() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/schools/import", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    setResult(data);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-zinc-900 mb-2">
          Importer des écoles (CSV)
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Le fichier doit contenir les colonnes : name, cityName, communeName,
          type, status. Colonnes optionnelles : phone, description.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="border border-zinc-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={!file || loading}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-700 transition disabled:opacity-50 w-fit"
          >
            {loading ? "Import en cours..." : "Importer"}
          </button>
        </form>

        {result && (
          <div className="mt-6 border-t border-zinc-200 pt-4">
            <p className="text-emerald-600 font-medium">
              {result.created} école(s) créée(s)
            </p>
            {result.skipped > 0 && (
              <p className="text-amber-600">
                {result.skipped} ligne(s) ignorée(s)
              </p>
            )}
            {result.errors.length > 0 && (
              <ul className="text-sm text-red-600 mt-2 list-disc pl-5">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}