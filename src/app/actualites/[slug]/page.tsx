import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

const LABELS_CATEGORIE: Record<string, string> = {
  EDUCATION: "Education",
  ORIENTATION: "Orientation",
  EXAMENS: "Examens",
  CONSEILS_PARENTS: "Conseils aux parents",
  ACTUALITE: "Actualite du secteur",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article) {
    return { title: "Article non trouve | ECOLES CI" };
  }

  return {
    title: `${article.title} | ECOLES CI`,
    description: article.excerpt ?? article.content.slice(0, 150),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/actualites" className="text-sm text-blue-900 hover:underline">
          ← Retour aux actualites
        </Link>

        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-64 object-cover rounded-xl mt-6"
          />
        )}

        <p className="text-xs text-blue-900 font-medium mt-6">
          {LABELS_CATEGORIE[article.category] ?? article.category}
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 mt-2">
          {article.title}
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Par {article.author} le{" "}
          {new Date(article.createdAt).toLocaleDateString("fr-FR")}
        </p>

        <div className="mt-8 text-zinc-700 whitespace-pre-line leading-relaxed">
          {article.content}
        </div>
      </div>
    </main>
  );
}