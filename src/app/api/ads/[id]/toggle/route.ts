import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ad = await prisma.ad.findUnique({ where: { id } });
  if (!ad) {
    return NextResponse.json({ error: "Publicité introuvable." }, { status: 404 });
  }

  await prisma.ad.update({
    where: { id },
    data: { isActive: !ad.isActive },
  });

  return NextResponse.redirect(new URL("/admin/publicites", request.url));
}