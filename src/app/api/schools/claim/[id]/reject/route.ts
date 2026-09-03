import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.verificationRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  return NextResponse.redirect(new URL("/admin/revendications", request.url));
}