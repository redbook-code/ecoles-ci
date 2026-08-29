"use client";

import dynamic from "next/dynamic";

const CarteEcoles = dynamic(() => import("@/components/CarteEcoles"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-zinc-500">
      Chargement de la carte...
    </div>
  ),
});

type EcolePourCarte = {
  id: string;
  slug: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
};

export default function CarteEcolesWrapper({ ecoles }: { ecoles: EcolePourCarte[] }) {
  return <CarteEcoles ecoles={ecoles} />;
}