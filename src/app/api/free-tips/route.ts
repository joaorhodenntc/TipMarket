import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { user_id, tip_id } = await request.json();

    if (!user_id || !tip_id) {
      return NextResponse.json(
        { error: "Campos obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se a tip grátis já foi liberada
    const existingFreeTip = await prisma.freeTip.findFirst({
      where: { user_id, tip_id },
    });

    if (existingFreeTip) {
      return NextResponse.json(
        { error: "Tip grátis já foi liberada" },
        { status: 400 }
      );
    }

    // Cria a tip grátis
    const freeTip = await prisma.freeTip.create({
      data: { user_id, tip_id },
    });

    return NextResponse.json(freeTip, { status: 201 });
  } catch (error) {
    console.error("Erro ao liberar tip grátis:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
