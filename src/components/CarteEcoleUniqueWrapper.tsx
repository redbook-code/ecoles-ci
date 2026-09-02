"use client";

import dynamic from "next/dynamic";

const CarteEcoleUnique = dynamic(() => import("@/components/CarteEcoleUnique"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center text-zinc-500 bg-zinc-100">
      Chargement de la carte...
    </div>
  ),
});

export default function CarteEcoleUniqueWrapper({
  nom,
  latitude,
  longitude,
}: {
  nom: string;
  latitude: number;
  longitude: number;
}) {
  return <CarteEcoleUnique nom={nom} latitude={latitude} longitude={longitude} />;
}