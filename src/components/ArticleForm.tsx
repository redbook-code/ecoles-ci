"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ArticleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/articles", {
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
      <h2 className="font-semibold text-zinc-900 mb-4">Rediger un article</h2>

      {erreur && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          name="title"
          placeholder="Titre de l'article"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="excerpt"
          placeholder="Resume court (optionnel, affiche dans la liste)"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <textarea
          name="content"
          placeholder="Contenu complet de l'article"
          required
          rows={10}
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <select
          name="category"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        >
          <option value="EDUCATION">Education</option>
          <option value="ORIENTATION">Orientation</option>
          <option value="EXAMENS">Examens</option>
          <option value="CONSEILS_PARENTS">Conseils aux parents</option>
          <option value="ACTUALITE">Actualite du secteur</option>
        </select>
        <input
          name="coverImage"
          placeholder="URL image de couverture (optionnel)"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="author"
          placeholder="Auteur (optionnel, par defaut: Redaction ECOLES CI)"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition disabled:opacity-50 w-fit"
        >
          {loading ? "Publication..." : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}