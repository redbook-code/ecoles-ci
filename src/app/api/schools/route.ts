import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cityName, communeName, type, status, phone, description } = body;

    if (!name || !cityName || !communeName || !type || !status) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    // Trouver ou créer la région "Abidjan" par défaut pour l'instant
    let region = await prisma.region.findUnique({ where: { name: "Abidjan" } });
    if (!region) {
      region = await prisma.region.create({ data: { name: "Abidjan" } });
    }

    // Trouver ou créer la ville
    let city = await prisma.city.findFirst({ where: { name: cityName } });
    if (!city) {
      city = await prisma.city.create({
        data: { name: cityName, regionId: region.id },
      });
    }

    // Trouver ou créer la commune
    let commune = await prisma.commune.findFirst({
      where: { name: communeName, cityId: city.id },
    });
    if (!commune) {
      commune = await prisma.commune.create({
        data: { name: communeName, cityId: city.id },
      });
    }

    // Créer un slug unique
    const baseSlug = toSlug(`${name}-${cityName}`);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.school.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const school = await prisma.school.create({
      data: {
        slug,
        name,
        type,
        status,
        cityId: city.id,
        communeId: commune.id,
        phone: phone || null,
        description: description || null,
        isVerified: false,
        source: "ETABLISSEMENT",
      },
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'école." },
      { status: 500 }
    );
  }
}