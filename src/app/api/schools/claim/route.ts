import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolId, name, email, phone, message } = body;

    if (!schoolId || !name || !email) {
      return NextResponse.json(
        { error: "Merci de remplir les champs obligatoires." },
        { status: 400 }
      );
    }

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      return NextResponse.json({ error: "École introuvable." }, { status: 404 });
    }

    const existing = await prisma.verificationRequest.findUnique({
      where: { schoolId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Une demande est déjà en cours pour cette école." },
        { status: 409 }
      );
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, role: "SCHOOL_ADMIN" },
      });
    }

    await prisma.verificationRequest.create({
      data: {
        schoolId,
        userId: user.id,
        status: "PENDING",
      },
    });

    if (phone || message) {
      await prisma.school.update({
        where: { id: schoolId },
        data: {
          phone: phone || school.phone,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande." },
      { status: 500 }
    );
  }
}