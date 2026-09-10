"use client";

import { useState } from "react";

export default function PartnershipForm() {
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/partnership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      setEnvoye(true);
    } else {
      const body = await res.json();
      setErreur(body.error ?? "Une erreur est survenue.");
    }
  }

  if (envoye) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-6 text-emerald-800 text-center">
        Merci ! Votre demande a bien ete envoyee. Notre equipe vous contactera sous peu.
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6">
      {erreur && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          name="schoolName"
          placeholder="Nom de votre etablissement"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="contactName"
          placeholder="Votre nom"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="phone"
          placeholder="Votre telephone"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Votre email (optionnel)"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <textarea
          name="message"
          placeholder="Message (optionnel)"
          rows={3}
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition disabled:opacity-50 w-fit"
        >
          {loading ? "Envoi..." : "Envoyer ma demande"}
        </button>
      </form>
    </div>
  );
}