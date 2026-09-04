import { prisma } from "@/lib/prisma";
import PublierActualiteForm from "@/components/PublierActualiteForm";

export default async function ActualitesAdmin() {
  const ecoles = await prisma.school.findMany({
    where: { isVerified: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const actualites = await prisma.schoolNews.findMany({
    include: { school: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">
          Actualités des écoles
        </h1>

        {ecoles.length === 0 ? (
          <p className="text-zinc-500 mb-8">
            Aucune école vérifiée pour l&apos;instant — seules les écoles
            vérifiées peuvent publier des actualités.
          </p>
        ) : (
          <PublierActualiteForm ecoles={ecoles} />
        )}

        <h2 className="text-lg font-semibold text-zinc-900 mt-10 mb-4">
          Dernières publications
        </h2>

        <div className="grid gap-4">
          {actualites.map((actu) => (
            <div
              key={actu.id}
              className="bg-white border border-zinc-200 rounded-xl p-5"
            >
              <p className="text-sm text-blue-900 font-medium">
                {actu.school.name}
              </p>
              <h3 className="font-semibold text-zinc-900 mt-1">{actu.title}</h3>
              <p className="text-sm text-zinc-600 mt-1">{actu.content}</p>
              <p className="text-xs text-zinc-400 mt-2">
                {new Date(actu.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}