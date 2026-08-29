import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const ecoles = await prisma.school.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, cityId: true },
  });

  const seen = new Set<string>();
  const toDelete: string[] = [];

  for (const ecole of ecoles) {
    const key = `${ecole.name.trim().toLowerCase()}|${ecole.cityId}`;
    if (seen.has(key)) {
      toDelete.push(ecole.id);
    } else {
      seen.add(key);
    }
  }

  console.log(`${toDelete.length} doublon(s) trouvé(s) sur ${ecoles.length} écoles.`);

  if (toDelete.length > 0) {
    const result = await prisma.school.deleteMany({
      where: { id: { in: toDelete } },
    });
    console.log(`${result.count} doublon(s) supprimé(s).`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });