import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <h1 className="max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight">
          Trouvez l&apos;école idéale en Côte d&apos;Ivoire
        </h1>
        <p className="max-w-xl mt-4 text-lg text-zinc-300">
          Découvrez, comparez et contactez les établissements scolaires partout en Côte d&apos;Ivoire.
        </p>

        <form
          action="/recherche"
          method="GET"
          className="w-full max-w-3xl mt-10 bg-white rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row gap-3"
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
      </section>

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
          ].map((niveau) => (
            <Link
              key={niveau.type}
              href={`/recherche?type=${niveau.type}`}
              className="rounded-xl border border-zinc-200 p-6 text-center font-medium text-zinc-800 hover:border-zinc-900 hover:shadow-md transition cursor-pointer"
            >
              {niveau.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <AdBanner placement="homepage" />
      </section>
    </main>
  );
}