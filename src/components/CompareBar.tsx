"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EcoleComparaison = { id: string; slug: string; name: string };

function lireSelection(): EcoleComparaison[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("comparaison_ecoles") ?? "[]");
  } catch {
    return [];
  }
}

export default function CompareBar() {
  const [selection, setSelection] = useState<EcoleComparaison[]>([]);

  useEffect(() => {
    setSelection(lireSelection());
    const onUpdate = () => setSelection(lireSelection());
    window.addEventListener("comparaison-updated", onUpdate);
    return () => window.removeEventListener("comparaison-updated", onUpdate);
  }, []);

  function retirer(id: string) {
    const nouvelle = selection.filter((e) => e.id !== id);
    localStorage.setItem("comparaison_ecoles", JSON.stringify(nouvelle));
    setSelection(nouvelle);
  }

  if (selection.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white px-6 py-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium">
            Comparer ({selection.length}/3) :
          </span>
          {selection.map((ecole) => (
            <span
              key={ecole.id}
              className="bg-blue-800 rounded-full px-3 py-1 text-sm flex items-center gap-2"
            >
              {ecole.name}
              <button onClick={() => retirer(ecole.id)} className="hover:text-red-300">
                ✕
              </button>
            </span>
          ))}
        </div>
        {selection.length >= 2 && (
          <Link
            href={`/comparer?ecoles=${selection.map((e) => e.slug).join(",")}`}
            className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition whitespace-nowrap"
          >
            Comparer maintenant
          </Link>
        )}
      </div>
    </div>
  );
}