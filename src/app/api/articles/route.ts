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
    const { title, excerpt, content, category, coverImage, author } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Merci de remplir au moins le titre et le contenu." },
        { status: 400 }
      );
    }

    const baseSlug = toSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const article = await prisma.article.create({
      data: {
        slug,
        title,
        excerpt: excerpt || null,
        content,
        category: category || "EDUCATION",
        coverImage: coverImage || null,
        author: author || "Redaction ECOLES CI",
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'article." },
      { status: 500 }
    );
  }
}