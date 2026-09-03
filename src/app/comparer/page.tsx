import { prisma } from "@/lib/prisma";
import Link from "next/link";

const LABELS_TYPE: Record<string, string> = {
  MATERNELLE: "École maternelle",
  PRIMAIRE: "École primaire",
  COLLEGE: "Collège",
  LYCEE: "Lycée",
  PROFESSIONNEL: "École professionnelle",
  UNIVERSITE: "Université",
};

export default async function ComparerPage({
  searchParams,
}: {
  searchParams: Promise<{ ecoles?: string }>;
}) {
  const { ecoles: ecolesParam } = await searchParams;
  const slugs = ecolesParam ? ecolesParam.split(",") : [];

  if (slugs.length < 2) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 mb-4">
            Comparateur d&apos;écoles
          </h1>
          <p className="text-zinc-500">
            Sélectionne au moins 2 écoles depuis la page de{" "}
            <Link href="/recherche" className="text-blue-900 underline">
              recherche
            </Link>{" "}
            pour les comparer ici.
          </p>
        </div>
      </main>
    );
  }

  const ecoles = await prisma.school.findMany({
    where: { slug: { in: slugs } },
    include: { city: true, commune: true },
  });

  const lignes = [
    { label: "Type", valeur: (e: (typeof ecoles)[0]) => LABELS_TYPE[e.type] ?? e.type },
    { label: "Statut", valeur: (e: (typeof ecoles)[0]) => (e.status === "PRIVE" ? "Privé" : "Public") },
    {
      label: "Localisation",
      valeur: (e: (typeof ecoles)[0]) =>
        `${e.commune?.name ? e.commune.name + ", " : ""}${e.city.name}`,
    },
    { label: "Vérifiée", valeur: (e: (typeof ecoles)[0]) => (e.isVerified ? "Oui" : "Non") },
    { label: "Téléphone", valeur: (e: (typeof ecoles)[0]) => e.phone ?? "Information non disponible" },
    {
      label: "Description",
      valeur: (e: (typeof ecoles)[0]) => e.description ?? "Information non disponible",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">
          Comparateur d&apos;écoles
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-zinc-50 border-b border-zinc-200 w-40">
                  Critère
                </th>
                {ecoles.map((ecole) => (
                  <th
                    key={ecole.id}
                    className="text-left p-3 bg-zinc-50 border-b border-zinc-200 min-w-[200px]"
                  >
                    <Link
                      href={`/ecole/${ecole.slug}`}
                      className="text-blue-900 hover:underline"
                    >
                      {ecole.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne) => (
                <tr key={ligne.label}>
                  <td className="p-3 border-b border-zinc-100 font-medium text-zinc-700">
                    {ligne.label}
                  </td>
                  {ecoles.map((ecole) => (
                    <td key={ecole.id} className="p-3 border-b border-zinc-100 text-zinc-600">
                      {ligne.valeur(ecole)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}