import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ad = await prisma.ad.findUnique({ where: { id } });
  if (!ad) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  await prisma.ad.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.redirect(ad.linkUrl);
}