"use client";

import { useState } from "react";

export default function EnrollmentForm({ schoolId }: { schoolId: string }) {
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const res = await fetch("/api/schools/enroll", {
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
        Ta demande a bien été envoyée à l&apos;établissement. Il te contactera directement.
      </div>
    );
  }

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
      <h3 className="font-semibold text-blue-900 mb-3">
        Demander des informations ou une inscription
      </h3>

      {erreur && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          name="parentName"
          placeholder="Votre nom"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
        />
        <input
          name="parentPhone"
          placeholder="Votre téléphone"
          required
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
        />
        <input
          name="parentEmail"
          type="email"
          placeholder="Votre email (optionnel)"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
        />
        <input
          name="studentLevel"
          placeholder="Niveau souhaité (ex: CP1, 6ème...)"
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
        />
        <textarea
          name="message"
          placeholder="Message (optionnel)"
          rows={3}
          className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
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