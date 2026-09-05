import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, advertiser, imageUrl, linkUrl, placement, endDate } = body;

    if (!title || !advertiser || !imageUrl || !linkUrl || !placement) {
      return NextResponse.json(
        { error: "Merci de remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.create({
      data: {
        title,
        advertiser,
        imageUrl,
        linkUrl,
        placement,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création." },
      { status: 500 }
    );
  }
}