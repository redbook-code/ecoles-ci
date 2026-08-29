import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function guessTypeFromName(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes("LYCEE")) return "LYCEE";
  if (upper.includes("UNIVERSITE")) return "UNIVERSITE";
  return "COLLEGE";
}

const VALID_TYPES = ["MATERNELLE", "PRIMAIRE", "COLLEGE", "LYCEE", "PROFESSIONNEL", "UNIVERSITE"];
const VALID_STATUS = ["PUBLIC", "PRIVE"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    const text = await file.text();
    const rows: Record<string, string>[] = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const isOfficialFormat = rows.length > 0 && "Nom d'établissement" in rows[0];

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    let region = await prisma.region.findUnique({ where: { name: "Côte d'Ivoire" } });
    if (!region) {
      region = await prisma.region.create({ data: { name: "Côte d'Ivoire" } });
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNumber = i + 2;

      let name: string | undefined;
      let cityName: string | undefined;
      let type: string | undefined;
      let status: string | undefined;
      let phone: string | undefined;
      let description: string | undefined;

      if (isOfficialFormat) {
        name = row["Nom d'établissement"]?.trim();
        cityName = row["Situation géographique"]?.trim();
        status = row["Statut"]?.trim().toUpperCase();
        type = name ? guessTypeFromName(name) : undefined;
      } else {
        name = row.name?.trim();
        cityName = row.cityName?.trim();
        type = row.type?.trim().toUpperCase();
        status = row.status?.trim().toUpperCase();
        phone = row.phone?.trim();
        description = row.description?.trim();
      }

      if (!name || !cityName || !type || !status) {
        skipped++;
        errors.push(`Ligne ${lineNumber} : champs obligatoires manquants ou ville non renseignée.`);
        continue;
      }

      if (!VALID_TYPES.includes(type)) {
        skipped++;
        errors.push(`Ligne ${lineNumber} : type "${type}" invalide.`);
        continue;
      }

      if (!VALID_STATUS.includes(status)) {
        skipped++;
        errors.push(`Ligne ${lineNumber} : statut "${status}" invalide.`);
        continue;
      }

      let city = await prisma.city.findFirst({ where: { name: cityName } });
      if (!city) {
        city = await prisma.city.create({
          data: { name: cityName, regionId: region.id },
        });
      }

      const baseSlug = toSlug(`${name}-${cityName}`);
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.school.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.school.create({
        data: {
          slug,
          name,
          type: type as never,
          status: status as never,
          cityId: city.id,
          phone: phone || null,
          description: description || null,
          isVerified: false,
          source: "PUBLIQUE",
          sourceUrl: isOfficialFormat
            ? "https://data.gouv.ci/datasets/liste-detablissements-scolaires-dabidjan-etab-ci"
            : null,
          lastVerifiedAt: isOfficialFormat ? new Date() : null,
        },
      });

      created++;
    }

    return NextResponse.json({ created, skipped, errors: errors.slice(0, 20) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du fichier." },
      { status: 500 }
    );
  }
}