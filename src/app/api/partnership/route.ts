import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolName, contactName, phone, email, message } = body;

    if (!schoolName || !contactName || !phone) {
      return NextResponse.json(
        { error: "Merci de remplir les champs obligatoires." },
        { status: 400 }
      );
    }

    const demande = await prisma.partnershipRequest.create({
      data: {
        schoolName,
        contactName,
        phone,
        email: email || null,
        message: message || null,
      },
    });

    return NextResponse.json(demande, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la demande." },
      { status: 500 }
    );
  }
}