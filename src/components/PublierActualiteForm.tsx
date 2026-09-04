"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublierActualiteForm({
  ecoles,
}: {
  ecoles: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/schools/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      const body = await res.json();
      setErreur(body.error ?? "Une erreur est survenue.");
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6">
      <h2 className="font-semibold text-zinc-900 mb-4">Publier une actualité</h2>

      {erreur && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <select
          name="schoolId"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        >
          <option value="">Choisir une école</option>
          {ecoles.map((ecole) => (
            <option key={ecole.id} value={ecole.id}>
              {ecole.name}
            </option>
          ))}
        </select>
        <input
          name="title"
          placeholder="Titre de l'actualité"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <textarea
          name="content"
          placeholder="Contenu"
          required
          rows={4}
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50 w-fit"
        >
          {loading ? "Publication..." : "Publier"}
        </button>
      </form>
    </div>
  );
}