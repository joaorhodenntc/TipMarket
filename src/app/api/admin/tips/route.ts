import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const { giveAccessToLastBuyers, ...tipData } = data;

    // Validação dos campos obrigatórios
    if (
      !tipData.game ||
      !tipData.description ||
      !tipData.odd ||
      !tipData.price ||
      !tipData.gameDate ||
      !tipData.imageTip ||
      !tipData.imageTipBlur
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar a tip com os dados validados
    const tip = await prisma.tip.create({
      data: {
        game: tipData.game,
        description: tipData.description,
        odd: Number(tipData.odd),
        price: Number(tipData.price),
        gameDate: new Date(tipData.gameDate),
        imageTip: tipData.imageTip,
        imageTipBlur: tipData.imageTipBlur,
        status: "pending",
      },
    });

    // Se a opção de dar acesso gratuito estiver habilitada
    if (giveAccessToLastBuyers) {
      // Primeiro, encontrar a última tip que deu red
      const lastTip = await prisma.tip.findFirst({
        where: {
          status: "red",
        },
        orderBy: {
          gameDate: "desc",
        },
      });

      if (lastTip) {
        // Buscar todos os usuários que tiveram acesso à última tip (compra ou free)
        const [purchaseUsers, freeUsers] = await Promise.all([
          // Usuários que compraram
          prisma.purchase.findMany({
            where: {
              status: "approved",
              tip_id: lastTip.id,
            },
            select: {
              user_id: true,
            },
          }),
          // Usuários que receberam free
          prisma.freeTip.findMany({
            where: {
              tip_id: lastTip.id,
            },
            select: {
              user_id: true,
            },
          }),
        ]);

        // Combinar os IDs únicos dos usuários
        const userIds = [
          ...new Set([
            ...purchaseUsers.map((p) => p.user_id),
            ...freeUsers.map((f) => f.user_id),
          ]),
        ];

        // Criar registros de FreeTip para cada usuário
        if (userIds.length > 0) {
          await prisma.freeTip.createMany({
            data: userIds.map((userId) => ({
              user_id: userId,
              tip_id: tip.id,
            })),
          });
        }
      }
    }

    return NextResponse.json(tip);
  } catch (error) {
    console.error("Erro ao criar tip:", error);
    return NextResponse.json({ error: "Erro ao criar tip" }, { status: 500 });
  }
}
