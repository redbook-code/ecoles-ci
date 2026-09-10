import { prisma } from "@/lib/prisma";

export default async function PartenairesAdmin() {
  const demandes = await prisma.partnershipRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">
          Demandes de partenariat ({demandes.length})
        </h1>

        {demandes.length === 0 && (
          <p className="text-zinc-500">Aucune demande pour l&apos;instant.</p>
        )}

        <div className="grid gap-4">
          {demandes.map((demande) => (
            <div
              key={demande.id}
              className="bg-white border border-zinc-200 rounded-xl p-5"
            >
              <h2 className="font-semibold text-zinc-900">
                {demande.schoolName}
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                {demande.contactName} · {demande.phone}
                {demande.email ? ` · ${demande.email}` : ""}
              </p>
              {demande.message && (
                <p className="text-sm text-zinc-500 mt-2 italic">
                  &quot;{demande.message}&quot;
                </p>
              )}
              <p className="text-xs text-zinc-400 mt-2">
                {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}