"use client";

import { useState } from "react";

export default function ClaimSchoolForm({ schoolId }: { schoolId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/schools/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, schoolId }),
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
      <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5 text-emerald-800">
        Ta demande a bien été envoyée. Elle sera examinée avant validation.
      </div>
    );
  }

  if (!ouvert) {
    return (
      <div className="border border-zinc-200 rounded-xl p-5">
        <p className="text-zinc-700 font-medium mb-2">
          Vous représentez cet établissement ?
        </p>
        <button
          onClick={() => setOuvert(true)}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition"
        >
          Revendiquer cette fiche
        </button>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 rounded-xl p-5">
      <p className="text-zinc-700 font-medium mb-4">Revendiquer cette fiche</p>

      {erreur && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          name="name"
          placeholder="Votre nom"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Votre email"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm"
        />
        <input
          name="phone"
          placeholder="Téléphone de l'établissement (optionnel)"
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
          className="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50 w-fit"
        >
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}