"use client";

import { useEffect, useState } from "react";

type EcoleComparaison = { id: string; slug: string; name: string };

function lireSelection(): EcoleComparaison[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("comparaison_ecoles") ?? "[]");
  } catch {
    return [];
  }
}

export default function CompareCheckbox({ ecole }: { ecole: EcoleComparaison }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(lireSelection().some((e) => e.id === ecole.id));
  }, [ecole.id]);

  function toggle() {
    const selection = lireSelection();
    let nouvelle: EcoleComparaison[];

    if (selection.some((e) => e.id === ecole.id)) {
      nouvelle = selection.filter((e) => e.id !== ecole.id);
    } else {
      if (selection.length >= 3) {
        alert("Tu peux comparer au maximum 3 écoles à la fois.");
        return;
      }
      nouvelle = [...selection, ecole];
    }

    localStorage.setItem("comparaison_ecoles", JSON.stringify(nouvelle));
    setChecked(!checked);
    window.dispatchEvent(new Event("comparaison-updated"));
  }

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600 mt-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={toggle} />
      Comparer
    </label>
  );
}