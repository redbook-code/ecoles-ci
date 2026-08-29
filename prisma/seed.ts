import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const region = await prisma.region.create({
    data: { name: "Abidjan" },
  });

  const city = await prisma.city.create({
    data: { name: "Abidjan", regionId: region.id },
  });

  const cocody = await prisma.commune.create({
    data: { name: "Cocody", cityId: city.id },
  });

  const riviera = await prisma.commune.create({
    data: { name: "Riviera", cityId: city.id },
  });

  await prisma.school.create({
    data: {
      slug: "groupe-scolaire-les-palmiers-abidjan",
      name: "Groupe Scolaire Les Palmiers",
      type: "LYCEE",
      status: "PRIVE",
      cityId: city.id,
      communeId: cocody.id,
      isVerified: true,
      source: "ETABLISSEMENT",
    },
  });

  await prisma.school.create({
    data: {
      slug: "ecole-primaire-publique-riviera",
      name: "École Primaire Publique Riviera",
      type: "PRIMAIRE",
      status: "PUBLIC",
      cityId: city.id,
      communeId: riviera.id,
      isVerified: false,
      source: "PUBLIQUE",
    },
  });

  console.log("Données de test créées avec succès.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });