import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const tipId = params.tipId;
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const tip = await prisma.tip.findUnique({
      where: { id: tipId },
      include: { purchases: true, free_tips: true },
    });

    if (!tip) {
      return NextResponse.json(
        { error: "Tip não encontrada" },
        { status: 404 }
      );
    }

    // Verifica se o usuário tem acesso à tip
    const hasAccess =
      tip.purchases.some((p) => p.user_id === userId) ||
      tip.free_tips.some((f) => f.user_id === userId);

    return NextResponse.json({
      id: tip.id,
      image: hasAccess ? tip.imageTip : tip.imageTipBlur,
      dateGame: tip.gameDate,
    });
  } catch (error) {
    console.error("Erro ao buscar tip:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
