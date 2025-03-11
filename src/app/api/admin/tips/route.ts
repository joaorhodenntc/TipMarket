import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Listar todas as tips
export async function GET() {
  try {
    const tips = await prisma.tip.findMany({
      orderBy: {
        gameDate: "desc",
      },
    });

    return NextResponse.json(tips);
  } catch (error) {
    console.error("Erro ao buscar tips:", error);
    return NextResponse.json({ error: "Erro ao buscar tips" }, { status: 500 });
  }
}

// POST - Criar nova tip
export async function POST(request: Request) {
  try {
    // Extrai os dados do corpo da requisição
    const { game, description, odd, imageTip, imageTipBlur, gameDate } =
      await request.json();

    // Validação básica dos dados
    if (
      !imageTip ||
      !imageTipBlur ||
      !gameDate ||
      !game ||
      !description ||
      !odd
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Cria a tip no banco de dados
    const newTip = await prisma.tip.create({
      data: {
        game,
        description,
        odd,
        imageTip,
        imageTipBlur,
        gameDate: new Date(gameDate),
      },
    });

    return NextResponse.json(newTip, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tip:", error);
    return NextResponse.json({ error: "Erro ao criar tip" }, { status: 500 });
  }
}
