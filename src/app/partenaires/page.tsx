import PartnershipForm from "@/components/PartnershipForm";

export default function PartenairesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-blue-900 text-white px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold max-w-2xl mx-auto">
          Faites connaitre votre etablissement a des milliers de parents
        </h1>
        <p className="mt-4 text-blue-100 max-w-xl mx-auto">
          Devenez partenaire ECOLES CI et recevez des demandes d&apos;inscription
          directement de parents interesses par votre etablissement.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="border border-zinc-200 rounded-xl p-6">
            <h3 className="font-semibold text-zinc-900 mb-2">
              Fiche verifiee
            </h3>
            <p className="text-sm text-zinc-600">
              Badge de confiance visible par tous les parents, et controle
              total sur les informations de votre etablissement.
            </p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-6">
            <h3 className="font-semibold text-zinc-900 mb-2">
              Mise en avant
            </h3>
            <p className="text-sm text-zinc-600">
              Votre etablissement apparait en priorite dans les resultats
              de recherche, avant les autres ecoles.
            </p>
          </div>
          <div className="border border-zinc-200 rounded-xl p-6">
            <h3 className="font-semibold text-zinc-900 mb-2">
              Demandes directes
            </h3>
            <p className="text-sm text-zinc-600">
              Recevez les demandes d&apos;inscription des parents directement,
              sans intermediaire.
            </p>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4 text-center">
            Interesse ? Contactez-nous
          </h2>
          <PartnershipForm />
        </div>
      </section>
    </main>
  );
}