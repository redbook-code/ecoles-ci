import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAR_PAGE = 20;

export default async function Recherche({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageActuelle = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [total, ecoles] = await Promise.all([
    prisma.school.count(),
    prisma.school.findMany({
      include: { city: true, commune: true },
      orderBy: { name: "asc" },
      skip: (pageActuelle - 1) * PAR_PAGE,
      take: PAR_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAR_PAGE);

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
          Résultats de recherche
        </h1>
        <p className="text-sm text-zinc-500 mb-8">{total} établissements</p>

        <div className="grid gap-4">
          {ecoles.map((ecole) => (
            <div
              key={ecole.id}
              className="border border-zinc-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-zinc-900">{ecole.name}</h2>
                  {ecole.isVerified && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Établissement vérifié
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 mt-1">
                  {ecole.type} · {ecole.status} ·{" "}
                  {ecole.commune?.name ? `${ecole.commune.name}, ` : ""}
                  {ecole.city.name}
                </p>
              </div>
              <Link
                href={`/ecole/${ecole.slug}`}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition"
              >
                Voir l&apos;école
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 text-sm text-zinc-600">
          <p>
            Page {pageActuelle} sur {totalPages}
          </p>
          <div className="flex gap-2">
            {pageActuelle > 1 && (
              <Link
                href={`/recherche?page=${pageActuelle - 1}`}
                className="px-3 py-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-100"
              >
                Précédent
              </Link>
            )}
            {pageActuelle < totalPages && (
              <Link
                href={`/recherche?page=${pageActuelle + 1}`}
                className="px-3 py-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-100"
              >
                Suivant
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}