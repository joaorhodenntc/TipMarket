import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tips = await prisma.tip.findMany({
      select: {
        id: true,
        price: true,
        imageTipBlur: true,
        gameDate: true,
      },
    });

    const currentDateTime = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const validTips = tips.filter((tip) => {
      const gameDateTime = new Date(tip.gameDate);
      return gameDateTime >= currentDateTime;
    });

    if (validTips.length === 0) {
      return NextResponse.json(
        { message: "Tip indisponível no momento" },
        { status: 200 }
      );
    }

    validTips.sort(
      (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
    );

    // Pegar a última tip válida
    const lastTip = validTips[0];

    return NextResponse.json(lastTip, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar tips:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
