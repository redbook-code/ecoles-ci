import { prisma } from "@/lib/prisma";
import { getCoordonneesVille } from "@/lib/coordonnees-villes";
import CarteEcolesWrapper from "@/components/CarteEcolesWrapper";

export default async function CartePage() {
  const ecoles = await prisma.school.findMany({
    include: { city: true },
    take: 1500,
  });

  const ecolesAvecCoords = ecoles.map((ecole) => {
    const [latitude, longitude] = getCoordonneesVille(ecole.city.name);
    return {
      id: ecole.id,
      slug: ecole.slug,
      name: ecole.name,
      type: ecole.type,
      latitude,
      longitude,
    };
  });

  return (
    <main className="h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-200">
        <h1 className="text-xl font-semibold text-zinc-900">
          Carte des établissements
        </h1>
        <p className="text-sm text-zinc-500">
          {ecoles.length} établissements affichés (position approximative par ville)
        </p>
      </div>
      <div className="flex-1">
        <CarteEcolesWrapper ecoles={ecolesAvecCoords} />
      </div>
    </main>
  );
}