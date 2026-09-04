import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ecole = await prisma.school.findUnique({ where: { id } });
  if (!ecole) {
    return NextResponse.json({ error: "École introuvable." }, { status: 404 });
  }

  await prisma.school.update({
    where: { id },
    data: { isFeatured: !ecole.isFeatured, isPremium: !ecole.isFeatured },
  });

  return NextResponse.redirect(new URL("/admin", request.url));
}