import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAR_PAGE = 50;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageActuelle = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const [totalEcoles, ecolesPubliques, ecolesPrivees, ecolesVerifiees, ecoles] =
    await Promise.all([
      prisma.school.count(),
      prisma.school.count({ where: { status: "PUBLIC" } }),
      prisma.school.count({ where: { status: "PRIVE" } }),
      prisma.school.count({ where: { isVerified: true } }),
      prisma.school.findMany({
        include: { city: true, commune: true },
        orderBy: { createdAt: "desc" },
        skip: (pageActuelle - 1) * PAR_PAGE,
        take: PAR_PAGE,
      }),
    ]);

  const totalPages = Math.ceil(totalEcoles / PAR_PAGE);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Tableau de bord
          </h1>
          <Link
            href="/admin/ecoles/nouvelle"
                       className="px-4 py-2 rounded-lg bg-blue-900 text-white text-sm font-medium hover:bg-blue-800 transition"
          >
            + Ajouter une école
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Total écoles</p>
            <p className="text-2xl font-semibold text-zinc-900">{totalEcoles}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Publiques</p>
            <p className="text-2xl font-semibold text-zinc-900">{ecolesPubliques}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Privées</p>
            <p className="text-2xl font-semibold text-zinc-900">{ecolesPrivees}</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4">
            <p className="text-sm text-zinc-500">Vérifiées</p>
            <p className="text-2xl font-semibold text-zinc-900">{ecolesVerifiees}</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 text-zinc-600 text-left">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Ville</th>
                <th className="px-4 py-3">Vérifiée</th>
              </tr>
            </thead>
            <tbody>
              {ecoles.map((ecole) => (
                <tr key={ecole.id} className="border-t border-zinc-100">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {ecole.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{ecole.type}</td>
                  <td className="px-4 py-3 text-zinc-600">{ecole.status}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {ecole.commune?.name ? `${ecole.commune.name}, ` : ""}
                    {ecole.city.name}
                  </td>
                  <td className="px-4 py-3">
                    {ecole.isVerified ? (
                      <span className="text-emerald-600">Oui</span>
                    ) : (
                      <span className="text-zinc-400">Non</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-zinc-600">
          <p>
            Page {pageActuelle} sur {totalPages} ({totalEcoles} écoles)
          </p>
          <div className="flex gap-2">
            {pageActuelle > 1 && (
              <Link
                href={`/admin?page=${pageActuelle - 1}`}
                className="px-3 py-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-100"
              >
                Précédent
              </Link>
            )}
            {pageActuelle < totalPages && (
              <Link
                href={`/admin?page=${pageActuelle + 1}`}
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