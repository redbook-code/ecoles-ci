import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const demande = await prisma.verificationRequest.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  await prisma.school.update({
    where: { id: demande.schoolId },
    data: { isVerified: true },
  });

  return NextResponse.redirect(new URL("/admin/revendications", request.url));
}