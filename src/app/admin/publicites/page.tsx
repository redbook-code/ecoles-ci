import { prisma } from "@/lib/prisma";
import AdForm from "@/components/AdForm";

const LABELS_PLACEMENT: Record<string, string> = {
  homepage: "Page d'accueil",
  recherche: "Résultats de recherche",
  fiche_ecole: "Fiche école",
};

export default async function PublicitesAdmin() {
  const publicites = await prisma.ad.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">
          Publicités
        </h1>

        <AdForm />

        <h2 className="text-lg font-semibold text-zinc-900 mt-10 mb-4">
          Publicités existantes
        </h2>

        <div className="grid gap-4">
          {publicites.map((ad) => (
            <div
              key={ad.id}
              className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-zinc-900">{ad.title}</p>
                <p className="text-sm text-zinc-500">
                  {ad.advertiser} · {LABELS_PLACEMENT[ad.placement] ?? ad.placement}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  {ad.impressions} affichages · {ad.clicks} clics
                </p>
              </div>
              <form action={`/api/ads/${ad.id}/toggle`} method="POST">
                <button
                  type="submit"
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                    ad.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {ad.isActive ? "Active" : "Inactive"}
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}