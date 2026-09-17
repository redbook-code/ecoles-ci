import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { prisma } from "@/lib/prisma";
import AnimatedStats from "@/components/AnimatedStats";
import AnimatedCard from "@/components/AnimatedCard";

const LABELS_CATEGORIE: Record<string, string> = {
  EDUCATION: "Education",
  ORIENTATION: "Orientation",
  EXAMENS: "Examens",
  CONSEILS_PARENTS: "Conseils aux parents",
  ACTUALITE: "Actualite du secteur",
};

export default async function Home() {
  const [totalEcoles, totalVilles, totalVerifiees, articles] = await Promise.all([
    prisma.school.count(),
    prisma.city.count(),
    prisma.school.count({ where: { isVerified: true } }),
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO avec photo de fond */}
      <section
        className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-ecole.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-900/80 to-blue-900/95" />

        <div className="relative z-10">
          <h1 className="max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight">
            Trouvez l&apos;école idéale en Côte d&apos;Ivoire
          </h1>
          <p className="max-w-xl mt-4 text-lg text-blue-100 mx-auto">
            Découvrez, comparez et contactez les établissements scolaires partout en Côte d&apos;Ivoire.
          </p>

          <form
            action="/recherche"
            method="GET"
            className="w-full max-w-3xl mt-10 bg-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              name="q"
              placeholder="Nom de l'établissement"
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-zinc-900 outline-none"
            />
            <input
              type="text"
              name="ville"
              placeholder="Ville / commune"
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 text-zinc-900 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-900 text-white font-medium hover:bg-blue-800 transition"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Chiffres clés animés */}
      <AnimatedStats
        totalEcoles={totalEcoles}
        totalVilles={totalVilles}
        totalVerifiees={totalVerifiees}
      />

      {/* Parcourir par niveau */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-8 text-center">
          Parcourir par niveau
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Écoles maternelles", type: "MATERNELLE" },
            { label: "Écoles primaires", type: "PRIMAIRE" },
            { label: "Collèges", type: "COLLEGE" },
            { label: "Lycées", type: "LYCEE" },
            { label: "Écoles professionnelles", type: "PROFESSIONNEL" },
            { label: "Universités et grandes écoles", type: "UNIVERSITE" },
          ].map((niveau, i) => (
            <AnimatedCard key={niveau.type} delay={i * 0.08}>
              <Link
                href={`/recherche?type=${niveau.type}`}
                className="block rounded-xl border border-zinc-200 p-6 text-center font-medium text-zinc-800 hover:border-blue-900 hover:shadow-lg transition cursor-pointer h-full"
              >
                {niveau.label}
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Actualites */}
      {articles.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Actualites scolaires
            </h2>
            <Link
              href="/actualites"
              className="text-sm text-blue-900 font-medium hover:underline"
            >
              Voir toutes les actualites →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <AnimatedCard key={article.id} delay={i * 0.1}>
                <Link
                  href={`/actualites/${article.slug}`}
                  className="block rounded-xl overflow-hidden border border-zinc-200 hover:shadow-lg transition h-full"
                >
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-blue-100" />
                  )}
                  <div className="p-4">
                    <p className="text-xs text-blue-900 font-medium">
                      {LABELS_CATEGORIE[article.category] ?? article.category}
                    </p>
                    <h3 className="font-semibold text-zinc-900 mt-1">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <AdBanner placement="homepage" />
      </section>
    </main>
  );
}