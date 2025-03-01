import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Pega o user-id dos headers
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Busca todas as Tips que o usuário comprou ou recebeu grátis
    const tips = await prisma.tip.findMany({
      where: {
        OR: [
          { purchases: { some: { user_id: userId } } }, // Tips compradas
          { free_tips: { some: { user_id: userId } } }, // Tips gratuitas
        ],
      },
      orderBy: { gameDate: "desc" }, // Ordena pela data do jogo, mais recentes primeiro
    });

    return NextResponse.json(tips);
  } catch (error) {
    console.error("Erro ao buscar tips do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
