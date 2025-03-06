import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário é obrigatório" },
        { status: 400 }
      );
    }

    // Busca as tips que têm pagamento aprovado
    const userTips = await prisma.tip.findMany({
      where: {
        OR: [
          {
            // Tips com pagamento aprovado
            purchases: {
              some: {
                user_id: userId,
                status: "approved",
              },
            },
          },
          {
            // Tips gratuitas
            free_tips: {
              some: {
                user_id: userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        game: true,
        description: true,
        odd: true,
        imageTipBlur: true,
        imageTip: true,
        gameDate: true,
        status: true,
      },
    });

    return NextResponse.json(userTips);
  } catch (error) {
    console.error("Erro ao buscar tips do usuário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tips do usuário" },
      { status: 500 }
    );
  }
}
