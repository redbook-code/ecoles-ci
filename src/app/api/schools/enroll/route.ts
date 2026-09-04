import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolId, parentName, parentPhone, parentEmail, studentLevel, message } = body;

    if (!schoolId || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: "Merci de remplir les champs obligatoires." },
        { status: 400 }
      );
    }

    const demande = await prisma.enrollmentRequest.create({
      data: {
        schoolId,
        parentName,
        parentPhone,
        parentEmail: parentEmail || null,
        studentLevel: studentLevel || null,
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