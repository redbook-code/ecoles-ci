"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouvelleEcole() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const body = await res.json();
      setError(body.error ?? "Une erreur est survenue.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-zinc-900 mb-6">
          Ajouter une école
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Nom de l&apos;établissement
            </label>
            <input
              name="name"
              required
              className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Ville</label>
            <input
              name="cityName"
              required
              defaultValue="Abidjan"
              className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">Commune</label>
            <input
              name="communeName"
              required
              className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">Type</label>
              <select
                name="type"
                required
                className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
              >
                <option value="MATERNELLE">Maternelle</option>
                <option value="PRIMAIRE">Primaire</option>
                <option value="COLLEGE">Collège</option>
                <option value="LYCEE">Lycée</option>
                <option value="PROFESSIONNEL">Professionnel</option>
                <option value="UNIVERSITE">Université</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Statut</label>
              <select
                name="status"
                required
                className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVE">Privé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Téléphone (optionnel)
            </label>
            <input
              name="phone"
              className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Description (optionnel)
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full mt-1 px-3 py-2 border border-zinc-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-700 transition disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Créer l'école"}
          </button>
        </form>
      </div>
    </main>
  );
}