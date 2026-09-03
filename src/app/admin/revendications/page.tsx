import { prisma } from "@/lib/prisma";

export default async function RevendicationsAdmin() {
  const demandes = await prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    include: { school: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">
          Demandes de revendication ({demandes.length})
        </h1>

        {demandes.length === 0 && (
          <p className="text-zinc-500">Aucune demande en attente.</p>
        )}

        <div className="grid gap-4">
          {demandes.map((demande) => (
            <div
              key={demande.id}
              className="bg-white border border-zinc-200 rounded-xl p-5"
            >
              <h2 className="font-semibold text-zinc-900">
                {demande.school.name}
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Demandé par {demande.user.name} ({demande.user.email})
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Le {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
              </p>

              <form
                action={`/api/schools/claim/${demande.id}/approve`}
                method="POST"
                className="mt-4 inline-block"
              >
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition mr-2"
                >
                  Approuver
                </button>
              </form>
              <form
                action={`/api/schools/claim/${demande.id}/reject`}
                method="POST"
                className="inline-block"
              >
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition"
                >
                  Rejeter
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}