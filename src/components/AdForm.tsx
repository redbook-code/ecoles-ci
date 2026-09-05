"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/ads", {
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
      <h2 className="font-semibold text-zinc-900 mb-4">Ajouter une publicité</h2>

      {erreur && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          name="advertiser"
          placeholder="Nom de l'annonceur"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="title"
          placeholder="Titre de la publicité"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="imageUrl"
          placeholder="URL de l'image (ex: https://...)"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="linkUrl"
          placeholder="Lien de destination (ex: https://...)"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <select
          name="placement"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        >
          <option value="">Emplacement</option>
          <option value="homepage">Page d&apos;accueil</option>
          <option value="recherche">Résultats de recherche</option>
          <option value="fiche_ecole">Fiche école</option>
        </select>
        <div>
          <label className="text-xs text-zinc-500">
            Date de fin (optionnel)
          </label>
          <input
            name="endDate"
            type="date"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50 w-fit"
        >
          {loading ? "Ajout..." : "Ajouter la publicité"}
        </button>
      </form>
    </div>
  );
}