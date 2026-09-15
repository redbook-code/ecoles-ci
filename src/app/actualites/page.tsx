import { prisma } from "@/lib/prisma";
import Link from "next/link";

const LABELS_CATEGORIE: Record<string, string> = {
  EDUCATION: "Education",
  ORIENTATION: "Orientation",
  EXAMENS: "Examens",
  CONSEILS_PARENTS: "Conseils aux parents",
  ACTUALITE: "Actualite du secteur",
};

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      ...(categorie ? { category: categorie } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const [aLaUne, ...autres] = articles;

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-zinc-900 mb-2">
          Actualites scolaires et educatives
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Conseils, orientation, examens et actualite de l&apos;education en Cote d&apos;Ivoire
        </p>

        <div className="flex gap-2 flex-wrap mb-10 border-b border-zinc-200 pb-4">
          <Link
            href="/actualites"
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              !categorie ? "bg-blue-900 text-white" : "bg-zinc-100 text-zinc-600"
            }`}
          >
            Tout
          </Link>
          {Object.entries(LABELS_CATEGORIE).map(([valeur, label]) => (
            <Link
              key={valeur}
              href={`/actualites?categorie=${valeur}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                categorie === valeur
                  ? "bg-blue-900 text-white"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-zinc-500">Aucun article publie pour l&apos;instant.</p>
        )}

        {aLaUne && (
          <Link
            href={`/actualites/${aLaUne.slug}`}
            className="block mb-10 rounded-2xl overflow-hidden border border-zinc-200 hover:shadow-lg transition sm:flex"
          >
            {aLaUne.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={aLaUne.coverImage}
                alt={aLaUne.title}
                className="w-full sm:w-1/2 h-64 object-cover"
              />
            ) : (
              <div className="w-full sm:w-1/2 h-64 bg-blue-900" />
            )}
            <div className="p-6 sm:w-1/2">
              <p className="text-xs text-blue-900 font-medium">
                {LABELS_CATEGORIE[aLaUne.category] ?? aLaUne.category}
              </p>
              <h2 className="font-semibold text-zinc-900 mt-2 text-2xl">
                {aLaUne.title}
              </h2>
              {aLaUne.excerpt && (
                <p className="text-sm text-zinc-600 mt-3">{aLaUne.excerpt}</p>
              )}
              <p className="text-xs text-zinc-400 mt-4">
                Par {aLaUne.author} le{" "}
                {new Date(aLaUne.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </Link>
        )}

        <div className="grid sm:grid-cols-3 gap-6">
          {autres.map((article) => (
            <Link
              key={article.id}
              href={`/actualites/${article.slug}`}
              className="block rounded-xl overflow-hidden border border-zinc-200 hover:shadow-md transition"
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
                <p className="text-xs text-zinc-400 mt-3">
                  {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}