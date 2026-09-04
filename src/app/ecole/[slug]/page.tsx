import ClaimSchoolForm from "@/components/ClaimSchoolForm";
import { getCoordonneesVille } from "@/lib/coordonnees-villes";
import CarteEcoleUniqueWrapper from "@/components/CarteEcoleUniqueWrapper";import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ecole = await prisma.school.findUnique({
    where: { slug },
    include: { city: true, commune: true },
  });

  if (!ecole) {
    return { title: "École non trouvée | ECOLES CI" };
  }

  const typeLisible: Record<string, string> = {
    MATERNELLE: "École maternelle",
    PRIMAIRE: "École primaire",
    COLLEGE: "Collège",
    LYCEE: "Lycée",
    PROFESSIONNEL: "École professionnelle",
    UNIVERSITE: "Université",
  };

  const titre = `${typeLisible[ecole.type] ?? "Établissement"} ${
    ecole.status === "PRIVE" ? "privé" : "public"
  } à ${ecole.city.name} | ${ecole.name} | ECOLES CI`;

  const description =
    ecole.description ??
    `${ecole.name}, ${typeLisible[ecole.type]?.toLowerCase() ?? "établissement"} situé à ${
      ecole.commune?.name ? `${ecole.commune.name}, ` : ""
    }${ecole.city.name}, Côte d'Ivoire.`;

  return {
    title: titre,
    description,
    openGraph: {
      title: titre,
      description,
      type: "website",
    },
  };
}

export default async function FicheEcole({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ecole = await prisma.school.findUnique({
    where: { slug },
    include: {
      city: true,
      commune: true,
      news: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!ecole) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
            <div className="h-64 bg-blue-900 flex items-end px-6 py-6">
        <div className="max-w-5xl mx-auto w-full text-white">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{ecole.name}</h1>
            {ecole.isVerified && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Établissement vérifié
              </span>
            )}
          </div>
          <p className="text-zinc-300 mt-1">
            {ecole.commune?.name}, {ecole.city.name}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Type</p>
            <p className="font-medium text-zinc-900">{ecole.type}</p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Statut</p>
            <p className="font-medium text-zinc-900">{ecole.status}</p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Contact</p>
            <p className="font-medium text-zinc-900">
              {ecole.phone ?? "Information non disponible"}
            </p>
          </div>
        </div>
        {ecole.news.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              Actualités
            </h2>
            <div className="grid gap-3">
              {ecole.news.map((actu) => (
                <div key={actu.id} className="border border-zinc-200 rounded-xl p-4">
                  <h3 className="font-medium text-zinc-900">{actu.title}</h3>
                  <p className="text-sm text-zinc-600 mt-1">{actu.content}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    {new Date(actu.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">
            Présentation
          </h2>
          <p className="text-zinc-600">
            {ecole.description ?? "Information non disponible"}
          </p>
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">
            Localisation
          </h2>
          <div className="h-80 rounded-xl overflow-hidden border border-zinc-200">
            <CarteEcoleUniqueWrapper
              nom={ecole.name}
              latitude={getCoordonneesVille(ecole.city.name)[0]}
              longitude={getCoordonneesVille(ecole.city.name)[1]}
            />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Position approximative basée sur la ville ({ecole.city.name}).
          </p>
        </section>
        <section className="mt-10">
          {ecole.isVerified ? (
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5 text-emerald-800 text-sm">
              Cet établissement est vérifié et géré par son administration.
            </div>
          ) : (
            <ClaimSchoolForm schoolId={ecole.id} />
          )}
        </section>
      </div>
    </main>
  );
}