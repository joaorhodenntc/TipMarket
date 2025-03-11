import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tips = await prisma.tip.findMany({
      where: {
        status: {
          in: ["green", "red"],
        },
      },
      orderBy: {
        gameDate: "desc",
      },
      select: {
        id: true,
        game: true,
        description: true,
        odd: true,
        gameDate: true,
        status: true,
      },
    });

    return NextResponse.json(tips);
  } catch (error) {
    console.error("Erro ao buscar histórico de tips:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de tips" },
      { status: 500 }
    );
  }
}
