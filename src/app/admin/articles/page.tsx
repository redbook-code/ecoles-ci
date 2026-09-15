import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/ArticleForm";
import Link from "next/link";

const LABELS_CATEGORIE: Record<string, string> = {
  EDUCATION: "Education",
  ORIENTATION: "Orientation",
  EXAMENS: "Examens",
  CONSEILS_PARENTS: "Conseils aux parents",
  ACTUALITE: "Actualite du secteur",
};

export default async function ArticlesAdmin() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">
          Articles ({articles.length})
        </h1>

        <ArticleForm />

        <h2 className="text-lg font-semibold text-zinc-900 mt-10 mb-4">
          Articles publies
        </h2>

        <div className="grid gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-zinc-200 rounded-xl p-5"
            >
              <p className="text-xs text-blue-900 font-medium">
                {LABELS_CATEGORIE[article.category] ?? article.category}
              </p>
              <Link
                href={`/actualites/${article.slug}`}
                target="_blank"
                className="font-semibold text-zinc-900 hover:underline"
              >
                {article.title}
              </Link>
              <p className="text-xs text-zinc-400 mt-1">
                Par {article.author} le{" "}
                {new Date(article.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}