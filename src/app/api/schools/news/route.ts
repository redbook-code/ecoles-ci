import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolId, title, content } = body;

    if (!schoolId || !title || !content) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs." },
        { status: 400 }
      );
    }

    const news = await prisma.schoolNews.create({
      data: { schoolId, title, content },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la publication." },
      { status: 500 }
    );
  }
}