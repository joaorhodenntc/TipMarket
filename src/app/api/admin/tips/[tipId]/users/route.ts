import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Purchase, FreeTip } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    // Buscar usuários que compraram a tip e têm pagamento aprovado
    const purchasers = await prisma.purchase.findMany({
      where: {
        tip_id: params.tipId,
        status: "approved", // Filtrando apenas pagamentos aprovados
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    // Buscar usuários que receberam a tip gratuitamente
    const freeTipUsers = await prisma.freeTip.findMany({
      where: {
        tip_id: params.tipId,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    // Formatando a resposta
    const users = [
      ...purchasers.map((purchase: any) => ({
        id: purchase.user.id,
        name: purchase.user.full_name || "Sem nome",
        email: purchase.user.email,
        type: "Comprador" as const,
      })),
      ...freeTipUsers.map((freeTip: any) => ({
        id: freeTip.user.id,
        name: freeTip.user.full_name || "Sem nome",
        email: freeTip.user.email,
        type: "Free" as const,
      })),
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
