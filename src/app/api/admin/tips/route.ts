import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Extrai os dados do corpo da requisição
    const { imageTip, imageTipBlur, dateGame, hourGame } = await request.json();

    // Validação básica dos dados
    if (!imageTip || !imageTipBlur || !dateGame || !hourGame) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Cria a tip no banco de dados
    const newTip = await prisma.tip.create({
      data: {
        imageTip,
        imageTipBlur,
        dateGame: new Date(dateGame),
        hourGame: new Date(hourGame),
      },
    });

    return NextResponse.json(newTip, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tip:", error);
    return NextResponse.json({ error: "Erro ao criar tip" }, { status: 500 });
  }
}
